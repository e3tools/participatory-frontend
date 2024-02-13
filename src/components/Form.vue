
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <WbData v-model="name"> </WbData>
      <WbSelect v-model="selected" :options="options" />
      <WbSelect v-model="selected_country" :options="countries" option_label="country_name" option_value="name" />
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
import WbData from '../components/base/controls/Data.vue'
import WbSelect from '../components/base/controls/Select.vue';
// import { getList } from '../../utils/database';
// import frappe from '../../boot/frappe' 
import { AppUtil } from 'src/utils/app';

//import { onLoginSuccess, onLoginFailure } from '../utils/authentication'
import { AuthenticationService } from 'src/services/AuthenticationService';
import { UserService } from 'src/services/user';

export default defineComponent({
  name: 'WbForm',
  components: { WbData, WbSelect },
  setup() {
    const $q = useQuasar()
    // const $frappe = new frappe.Frappe()
    const userService = new UserService()
    const name = ref(null)
    const db = AppUtil.get_db()

    const options = ['One', 'Two', 'Three']
    const countries = ref([])
    const selected = ref()
    const selected_country = ref()
    const country = ref()
    const auth = ref({
                    usr: 'administrator',
                    pwd: '123'
                })
  
    const get_list = async () => {      
      // let rep = await AppUtil.get_db().get_list(
      //   'Country', 
      //   null, //filters
      //   [['name', 'like', 'Ke%'], ['country_name', 'like', 'al%']],//or_filters,
      //   ['name', 'country_name'],
      //   'name DESC, country_name ASC',
      //   0
      // )
      let rep = await db.get_list({
        doctype: 'Country', 
        filters: null, //filters
        or_filters:[['name', 'like', 'Ke%'], ['country_name', 'like', 'al%']],//or_filters,
        fields: ['name', 'country_name'],
        order_by: 'name DESC, country_name ASC',
        limit_start: 0
      })
      countries.value = await rep.data
    };

    const get_doc =async () => {
      let doc = await db.get_doc({doctype: 'Country', docname:'Kenya'})
      country.value = doc
    }

    const tryLogin = async() => {
      let user = await AuthenticationService.login(auth.value.usr, auth.value.pwd)

      if(user && !user.status_code){ 
        console.log("Logged in")
      }
      else { 
        console.log("Login failure")
      } 
    }
    tryLogin()

    get_list()

    // get_doc()

    return {
      name,
      options,
      selected,
      selected_country,
      countries,

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
    }
  },
})
</script>
