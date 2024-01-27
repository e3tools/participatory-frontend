<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawer = !leftDrawer"
        />
        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="white" 
              :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
              @click="$q.fullscreen.toggle()"
              v-if="$q.screen.gt.sm">
          </q-btn>
          <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              {{ notificationsCount }}
            </q-badge>
            <q-menu>
              <q-list style="min-width: 100px">
                <notification-list></notification-list>
                <q-card class="text-center no-shadow no-border">
                  <q-btn :label="t('MAIN_LAYOUT.HEADER.VIEW_ALL')" style="max-width:120px !important" flat dense
                      class="text-indigo-8">
                  </q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>

      <q-tabs>
        <q-route-tab
          icon="map"
          to="/your/route"
          replace
          label="One Tab"
        />
        <q-route-tab
          icon="assignment"
          to="/some/other/route"
          replace
          label="Other Tab"
        />
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawer"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <q-list>
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label> {{ t('MAIN_LAYOUT.NAVIGATOR.DASHBOARD') }} </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

    </q-drawer>
   
    <!-- (Optional) The Footer -->
    <q-footer>
      <q-tabs switch-indicator>
        <q-route-tab
          icon="map"
          to="/your/route"
          replace
          label="One Tab"
        />
        <q-route-tab
          icon="assignment"
          to="/some/other/route"
          replace
          label="Other Tab"
        />
      </q-tabs>

      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawer = !leftDrawer"
        />
        <q-toolbar-title>
          Footer
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer
      v-model="leftDrawer"
      side="left"
      bordered
      content-class="bg-grey-2"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- Content here -->
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import NotificationList from '../components/NotificationList.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  // name: 'LayoutName',
  components: {
    NotificationList
  },
  setup() {
    const { t } = useI18n()
    const leftDrawer = ref(false) 
    const notificationsCount = ref(5)

    return { 
      t,
      leftDrawer,
      notificationsCount
    }
  }
})
</script>
