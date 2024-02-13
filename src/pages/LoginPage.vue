<template>
    <q-layout>
      <q-page-container>
        <q-page class="flex bg-image flex-center">
          <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
            <q-card-section>
              <q-avatar size="103px" class="absolute-center shadow-10">
                <img src="profile.svg">
              </q-avatar>
            </q-card-section>
            <q-card-section>
              <div class="text-center q-pt-lg">
                <div class="col text-h6 ellipsis">
                  {{ t('LOGIN_PAGE.TITLE')}}
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <q-form
                class="q-gutter-md"
              >
                <q-input
                  filled
                  v-model="username"
                  :label="t('LOGIN_PAGE.USERNAME')"
                  lazy-rules
                />
  
                <q-input
                  type="password"
                  filled
                  v-model="password"
                  :label="t('LOGIN_PAGE.PASSWORD')"
                  lazy-rules
  
                />
  
                <div>
                  <q-btn :label="t('LOGIN_PAGE.BUTTONS.LOGIN')" @click="doLogin" type="button" color="primary"/>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout> 
  </template>
  
  <script>
  import {defineComponent} from 'vue'
  import {ref} from 'vue'
  import { useI18n } from 'vue-i18n' 
  import { useRouter } from 'vue-router'
  import { AppUtil } from 'src/utils/app'
  import { AuthenticationService } from '../../src/services/AuthenticationService' 
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'
import { onMounted } from 'vue'
import apputil from 'src/boot/apputil'
  
  export default defineComponent({
    name: "LoginPage",
    setup() {
      const t = (text) => AppUtil.translate(text)
      const $q = useQuasar()
      const router = useRouter()
      const username = ref('')
      const password = ref('')
      const doLogin = async () => {
        const first = $q.loading.show({
          // group: 'first',
          // message: 'Saving...',
          // spinnerColor: 'white',
          // messageColor: 'amber'
        })
          const res = await AuthenticationService.login(username.value, password.value)
          if(res) {
            $q.loading.hide()
            AppUtil.notify(t('LOGIN_PAGE.LOGIN_SUCCESS_MESSAGE'))
            router.push("/")
          } else {
            console.log("Login fail")
            AppUtil.notify(t('LOGIN_PAGE.LOGIN_FAILURE_MESSAGE'), true)
            $q.loading.hide()
          }
      } 

      onBeforeUnmount(() => { 
        $q.loading.hide() 
      })

      onMounted(() => {
        const user = AppUtil.get_current_user()
        if(user) {
          AppUtil.route_to_path('/')
        }
      })
      return {
        router,  
        t,
        username,
        password,
        doLogin
      }
    },
  })
  </script>
  
  <style>
  
  .bg-image {
    /* background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%); */
    background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
  }
  </style>
  