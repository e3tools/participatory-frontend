
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <WbData> </WbData>
      <WbSelect v-model="selected" :options="options" />
      <WbSelect v-model="selected" :options="users" />
      <!-- <q-input
      filled
      v-model="name"
      label="Your name"
      hint="Name and surname"
      lazy-rules
      :rules="[val => val && val.length > 0 || 'Please type something']"
    /> -->
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import WbData from './controls/Data.vue';
import WbSelect from './controls/Select.vue';

// import frappe from '../../boot/frappe'
import { get_current_instance } from 'vue';

export default defineComponent({
  name: 'WbForm',
  components: { WbData, WbSelect },
  setup() {
    const $q = useQuasar();
    // const $frappe = new frappe.Frappe()

    const name = ref(null);

    const options = ['One', 'Two', 'Three'];
    const users = ref([]);
    const selected = ref();
    const auth = ref({
                    usr: 'administrator',
                    pwd: '123'
                })

    const { proxy } = get_current_instance();//get global variables
    const resp = async () => {
      let rep = await proxy.$frappe.get_list({
         doctype: 'Country', 
         filters: null,
         or_filters: null,
         fields: '*'
      });
      users.value = rep;
    };

    const tryLogin = async() => {
      let user = await proxy.$frappe.login(auth)
      if(user && !user.status_code){
        localStorage.set('frappeUser', {
          token: user.token,
          userData: user.data
        })
      }
    }
    tryLogin()

    resp();

    return {
      name,
      options,
      selected,
      users,

      onSubmit() {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted',
        });
      },

      onReset() {
        name.value = null;
      },
    };
  },
});
</script>
