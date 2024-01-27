<template >
  <div class="flex" style="flex-wrap: nowrap; gap:1px">
    <q-select outlined class="select" dense v-model="search_term" use-input clearable @clear="clearSelection"
      :placeholder="search_term ? '' : 'Search cards'" :options="search_results" input-debounce="500" behavior="menu"
      @filter="fetchOptions" @update:model-value="handleSelectedOwner" @focus="handleFocus"
      popup-content-class="selection-options">
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
            <div class="" style="gap:10px">
              <div class="text-grey text-caption"> Owner:{{ scope.opt.owner?.name }}</div>
              <div class="text-grey text-caption"> Location:{{ scope.opt.location?.name || 'N/A' }}</div>
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-btn outline color="grey-5" dense icon="add" to="/cards/create" v-show="!hide_add_btn">
      <q-tooltip>
        Create new card
      </q-tooltip>
    </q-btn>
    <!-- refresh button -->
    <q-btn outline color="grey-5" dense icon="refresh" @click="fetchhRecords">
      <q-tooltip>
        Refresh
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script>
import axios from "axios"
import { encrypt, decrypt } from "src/Utils/encryptAndDecrypt";
import generateHeaders from "src/Utils/generateHeaders.js";
//pinia store
import { storeToRefs } from "pinia";
import { useSettingStore } from "src/stores/settings_store";
const { getSettings } = storeToRefs(useSettingStore());
export default {
  props: {
    current_value: [String, Object],
    owner: String, // id of the selected organization
    location: String, // id of the selected location
    hide_add_btn: {
      type: Boolean,
      default: false
    },
  },
  emits: [
    'selected_value_emitted',
    'clear_selected_value',
  ],
  data() {
    return {
      search_term: "", // holds the search term
      search_results: [], // holds the search results
      cancelToken: undefined, // cancel token for axios
      all_records: [], // hollds all organizations
    }
  },
  computed: {
    //check if encryption is enabled
    encryptionEnabled() {
      return getSettings.value?.api_encryption_enabled;
    },
  },
  watch: {
    current_value: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        this.fetchhRecords(
          { card: val }
        )
      }
    },
    owner: {
      immediate: true,
      handler(val) {
        if (!val) return
        if (this.all_records.length) return
        this.fetchhRecords(
          { owner: val }
        )
      }
    },
  },
  methods: {
    // handle focus
    handleFocus() {
      if (this.all_records.length) return
      this.fetchhRecords()
    },
    // fetch a few record devices
    async fetchhRecords(params = {}) {
      try {
        const response = await this.$api.get(/api/v1/vending-machine/cards/, {
          headers: {
            ...generateHeaders(),
          },
          params,
          hide_loading_progress: true,
        });
        let response_data = response.data
        if (this.encryptionEnabled) response_data = JSON.parse(decrypt(response_data));
        const { message, success, results } = response_data;
        this.all_records = results.docs.map(record => {
          return {
            label: record.card_uid,
            ...record,

          }
        })
        this.search_results = this.all_records;
        this.search_term = this.all_records.find(record => record.id === this.current_value)
        if (this.search_term) {
          this.$emit('selected_value_emitted', this.search_term)
        }
      } catch (error) {
        console.log("Fetch card error ", error);
      }
    },
    async fetchOptions(search_term, update) {
      if (process.env.DEV) console.log("cards filter response all_records", this.all_records);
      let all_records = this.all_records
      if (this.owner) {
        all_records = all_records.filter(record => {
          if (this.owner === record?.owner?.id) return record;
        })
      }
      if (this.location) {
        all_records = all_records.filter(record => {
          if (this.location === record.location?.id) return record;
        })
      }
      if (search_term === '') {
        this.search_results = all_records;
        update();
        return;
      }
      const needle = search_term.toLowerCase()
      this.search_results = all_records.filter(element => element.label.toLowerCase().indexOf(needle) > -1)
      if (this.search_results.length) return update();
      const response = await this.apiSearch(search_term);
      if (!response?.success) return
      this.search_results = response.results?.map((record => {
        return {
          ...record,
          label: record?.name
        }
      }));
      if (this.search_results.length) return update();
      update();
    },

    // make search per input
    async apiSearch(search_term) {
      try {
        if (search_term.length < 2) return;
        //Check if there are any previous pending requests
        if (typeof this.cancelToken != typeof undefined) {
          this.cancelToken.cancel("Operation canceled due to new request.")
        }
        //Save the cancel token for the current request
        this.cancelToken = axios.CancelToken.source()
        const params = {
          search_term
        }
        if (this.owner) {
          params.owner = this.owner
        }
        const response = await this.$api.get(/api/v1/vending-machine/cards/, {
          hide_loading_progress: true, // hide loading progress
          cancelToken: this.cancelToken.token,
          headers: {
            ...generateHeaders(),
          },
          params,
        });
        let response_data = response.data
        if (this.encryptionEnabled) response_data = JSON.parse(decrypt(response_data));
        const { message, success, results } = response_data;

        return { results: results.docs, success: true }
      } catch (error) {
        if (process.env.DEV) console.log("error searching cards", error);
        return { success: false }
      }
    },
    //method to hande
    handleSelectedOwner(record) {
      if (!record) return;
      this.$emit('selected_value_emitted', record)
    },
    //clear selection
    clearSelection() {
      this.search_term = null
      this.$emit('clear_selected_value', true)
    }
  }
}
</script>
<style lang="scss" scoped>
.select {
  flex: 1;
  width: 240px;
}
</style>
<style lang="scss" ></style>