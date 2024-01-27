<template>
  <q-page padding class="q-pa-sm">
    <!-- content -->
    <div class="row q-col-gutter-sm">
      <div class="col-lg-10 col-md-10 col-xs-12 col-sm-12">
        <q-card class="card-bg primary no-shadow" bordered>        
          <q-card-section class="text-h6">
            <div class="text-h6"> {{ t('USER_PROFILE_PAGE.TITLES.PAGE') }}</div>
            <div class="text-subtitle2">{{ t('USER_PROFILE_PAGE.TITLES.USER_DETAILS') }}</div>
          </q-card-section>

          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section side>
                  <q-avatar icon="user">
                  </q-avatar>
                </q-item-section>
                <!-- <q-item-section>
                  <q-btn :label="t('USER_PROFILE_PAGE.LABELS.ADD_PHOTO')"
                         class="text-capitalize" 
                         rounded
                         color="info"
                         style="max-width: 120px;"
                  > 
                  </q-btn>              
                </q-item-section> -->
                <q-item-section>
                  <wb-button 
                    :label="t('USER_PROFILE_PAGE.LABELS.ADD_PHOTO')" 
                    :onClick="addPhoto"
                    style="max-width: 120px;" />
                </q-item-section>
              </q-item>
              

              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input dense color="blue" v-model="user_details.first_name" 
                  :label="t('USER_PROFILE_PAGE.LABELS.FIRST_NAME')"/>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input dense color="blue" v-model="user_details.middle_name" 
                  :label="t('USER_PROFILE_PAGE.LABELS.MIDDLE_NAME')"/>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input dense color="blue" v-model="user_details.last_name" 
                  :label="t('USER_PROFILE_PAGE.LABELS.LAST_NAME')"/>
                </q-item-section>
              </q-item> 
            </q-list>
          </q-card-section>

          <q-card-actions align="right">
            <wb-button>
              <template v-slot>
                {{ t('USER_PROFILE_PAGE.BUTTONS.UPDATE_USER_INFO') }}
              </template>
            </wb-button>           
          </q-card-actions>
        </q-card>  
      </div>

      <div class="col-lg-10 col-md-10 col-xs-12 col-sm-12">
        <q-card class="card-bg no-shadow" bordered>
          <q-card-section class="text-h6 q-pa-sm">
            {{ t('USER_PROFILE_PAGE.TITLES.CHANGE_PASSWORD') }}
          </q-card-section>
          <q-card-section class="row q-pa-sm">
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                {{ t('USER_PROFILE_PAGE.LABELS.CURRENT_PASSWORD')}}
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dense
                  outlined
                  round
                  v-model="password_dict.current_password"
                  :label="t('USER_PROFILE_PAGE.LABELS.CURRENT_PASSWORD')"
                ></q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                {{ t('USER_PROFILE_PAGE.LABELS.NEW_PASSWORD')}}
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dense
                  outlined
                  round
                  v-model="password_dict.new_password"
                  :label="t('USER_PROFILE_PAGE.LABELS.NEW_PASSWORD')"
                ></q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                {{ t('USER_PROFILE_PAGE.LABELS.CONFIRM_NEW_PASSWORD')}}
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dense
                  outlined
                  round
                  v-model="password_dict.confirm_new_password"
                  :label="t('USER_PROFILE_PAGE.LABELS.CONFIRM_NEW_PASSWORD')"
                ></q-input>
              </q-item-section>
            </q-item>

          </q-card-section>

          <q-card-actions align="right">
            <wb-button>
              <template v-slot>
                {{ t('USER_PROFILE_PAGE.BUTTONS.CHANGE_PASSWORD') }}
              </template>
            </wb-button>           
          </q-card-actions>

        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n';
import WbCard from '../components/base/Card.vue';
import WbButton from '../components/base/Button.vue';
// import WbData from '../components/form/controls/Data.vue'
export default defineComponent({
  name: 'UserProfilePage',
  components: {
    // WbData
    // BaseCard
    WbButton 
  },
  setup() {
    const { t } = useI18n()
    const user_details = ref({})
    const password_dict = ref({})
    const addPhoto = () => {
      console.log('Add photo')
    }

    return {
      t,
      user_details,
      password_dict,
      addPhoto
    }
  }
})
</script>
