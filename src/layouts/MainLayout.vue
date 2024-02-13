<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Engage&trade;
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

          <!---HELP SEction-->
          <q-btn round dense flat color="white" icon="help">
            <q-menu>
              <q-list dense bordered padding class="rounded-borders">
                <q-item clickable v-close-popup @click="toggleAboutDlg()">
                  <q-item-section>
                    <q-item-label>{{ t('MAIN_LAYOUT.HEADER.ABOUT') }}</q-item-label>
                </q-item-section>
                </q-item>
                <q-separator></q-separator>
                <q-item to="/help" clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>{{ t('MAIN_LAYOUT.HEADER.HELP') }}</q-item-label>
                </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn round dense flat>           
            <q-avatar color="white" text-color="primary" size="sm">{{ userInitials }}</q-avatar>          
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <q-list>
                    <q-item to="/user-profile" active-class="q-item-no-link-highlighting">
                      <q-item-label>{{ t('MAIN_LAYOUT.HEADER.MY_PROFILE') }} </q-item-label>
                    </q-item>
                    <q-item to="/user-profile" active-class="q-item-no-link-highlighting">
                      <q-item-label>{{ t('MAIN_LAYOUT.HEADER.TOGGLE_THEME') }} </q-item-label>
                    </q-item>
                    <q-item class="items-center">
                      <q-btn
                        color="primary"
                        :label="t('MAIN_LAYOUT.HEADER.LOGOUT')"
                        push
                        size="sm"
                        @click="logout"
                        v-close-popup
                      >
                      </q-btn>
                  </q-item>
                  </q-list>
                </div>

                <q-separator vertical inset class="q-mx-lg"></q-separator>

                <div class="column items-center">
                  <q-avatar size="72px">
                    <q-icon name="person" />
                  </q-avatar>

                  <div class="text-subtitle1 q-mt-md q-mb-xs">{{ user.full_name }}</div>
                  
                </div>
              </div>
            </q-menu>
          </q-btn>

          <!-- <q-btn-dropdown
            class="glossy"
            color="purple"
            :label="t('A')"
          >
             <div class="row no-wrap q-pa-md">
              <div class="column">
                <q-list dense bordered padding class="rounded-borders">
                  <q-item to="/user-profile" active-class="q-item-no-link-highlighting">
                    <q-item-label>{{ t('MAIN_LAYOUT.HEADER.MY_PROFILE') }} </q-item-label>
                  </q-item>
                  <q-item to="/user-profile" active-class="q-item-no-link-highlighting">
                    <q-item-label>{{ t('MAIN_LAYOUT.HEADER.TOGGLE_THEME') }} </q-item-label>
                  </q-item>
                  <q-item class="items-center">
                    <q-btn
                      color="primary"
                      :label="t('MAIN_LAYOUT.HEADER.LOGOUT')"
                      push
                      size="sm"
                      v-close-popup
                    >
                    </q-btn>
                 </q-item>
                </q-list>
              </div>

              <q-separator vertical inset class="q-mx-lg"></q-separator>

              <div class="column items-center">
                <q-avatar size="72px">
                  <q-icon name="person" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ user.full_name }}</div>
                
              </div>
            </div>
          </q-btn-dropdown> -->
        </div>
        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >

      <q-list>   
        <q-item>
          <q-item-label header>
            {{ t('MAIN_LAYOUT.NAVIGATOR.TITLE') }}
          </q-item-label>
        </q-item>  
        <!-- <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label> {{ t('MAIN_LAYOUT.NAVIGATOR.DASHBOARD') }} </q-item-label>
          </q-item-section>
        </q-item> -->

        <!--:to="{ name: 'dashboard', params: { dashboard: dashboard.name }}" -->
        <q-expansion-item
          icon="dashboard"
          :label="t('MAIN_LAYOUT.NAVIGATOR.DASHBOARD')"
        >
          <q-list class="q-pl-lg">
            <q-item v-for="dashboard in dashboards" :key="dashboard.name"
               :to="`/dashboard/${dashboard.name}`" 
               active-class="q-item-no-link-highlighting">                
               <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ dashboard.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item
          icon="pages"
          :label="t('MAIN_LAYOUT.NAVIGATOR.ENGAGEMENTS')"
        >
          <q-list class="q-pl-lg">
            <!--<q-item :to="{ name: 'dynamic-list'}" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="map"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Sample process 1</q-item-label>
              </q-item-section>
            </q-item>            
            <q-item to="/MapMarker" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="location_on"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Sample process 2 </q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/StreetView" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="streetview"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Sample process 3</q-item-label>
              </q-item-section>
            </q-item> -->
          </q-list>

          <q-list class="q-pl-lg" v-for="engagement in engagements" :key="engagement.engagement_name">
            <q-item 
                clickable
                @click="navigateEngagement(engagement)"          
                active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="location_on" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ engagement.engagement_name }}</q-item-label>
              </q-item-section>
            </q-item>

            <!-- <q-item 
                :to="{ name: 'wizard', params: { doctype: 'Engagement', docname: engagement.name }}" 
                active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="location_on" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ engagement.engagement_name }}</q-item-label>
              </q-item-section>
            </q-item> -->
          </q-list>
        </q-expansion-item>
        
        <q-expansion-item
          icon="troubleshoot"
          :label="t('MAIN_LAYOUT.NAVIGATOR.DIAGNOSTICS_TITLE')"
        >
          <q-list class="q-pl-lg">
            <q-item
              :to="`/map/?maptype=raster`" 
              active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="map"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Climatic</q-item-label>
              </q-item-section>
            </q-item>

            <q-item 
              :to="`/map?maptype=vector`" 
              active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="map"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Resource map</q-item-label>
              </q-item-section>
            </q-item>
            <!-- <q-item to="/MapMarker" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="location_on"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Rainfall map</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/StreetView" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="streetview"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Temperature map</q-item-label>
              </q-item-section>
            </q-item> -->
          </q-list>
        </q-expansion-item>

        <q-expansion-item
          icon="troubleshoot"
          :label="t('MAIN_LAYOUT.NAVIGATOR.ACTION_PLANS_TITLE')"
        >
          <q-list class="q-pl-lg">
            <q-item  
              :to="`/list/Engagement Action Task`" 
              active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="fa fa-eye" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('MAIN_LAYOUT.NAVIGATOR.VIEW_ACTION_TASK') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item 
              to="/form/Engagement Action Task Update/new" 
              active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="edit"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('MAIN_LAYOUT.NAVIGATOR.UPDATE_ACTION_TASK') }}</q-item-label>
              </q-item-section>
            </q-item>            
          </q-list>
        </q-expansion-item>

        <q-item 
          to="/resources" 
          active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="school"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('MAIN_LAYOUT.NAVIGATOR.REFERENCE_RESOURCES_TITLE') }}</q-item-label>
          </q-item-section>
        </q-item>
       
        <q-expansion-item
          icon="troubleshoot"
          :label="t('MAIN_LAYOUT.NAVIGATOR.REPORTS_TITLE')"
        >
          <q-list class="q-pl-lg">
            <q-item  
              :to="`/report/User`" 
              active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="pie_chart"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Users</q-item-label>
              </q-item-section>
            </q-item>

            <q-item :to="`/report/Engagement`" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="bar_chart"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Engagements</q-item-label>
              </q-item-section>
            </q-item>            
          </q-list>
        </q-expansion-item>

        <q-expansion-item
          icon="troubleshoot"
          :label="t('MAIN_LAYOUT.NAVIGATOR.AI_TOOLS')"
        >
          <q-list class="q-pl-lg">
            <q-item  
              :to="`/ai`" 
              active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="report"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Text based modeling</q-item-label>
              </q-item-section>
            </q-item> 
          </q-list>
        </q-expansion-item>

        <q-expansion-item
          icon="troubleshoot"
          :label="t('MAIN_LAYOUT.NAVIGATOR.GRM')"
        >
          <q-list class="q-pl-lg">
            <q-item  
              :to="`/ai`" 
              active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="report"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>New Complaint/Feedback</q-item-label>
              </q-item-section>
            </q-item> 
          </q-list>
        </q-expansion-item>

        <q-item 
            :to="'/user-profile'" 
            active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="person"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('MAIN_LAYOUT.NAVIGATOR.USER_PROFILE') }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/dynamic-form" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="report"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Dynamic form</q-item-label>
          </q-item-section>
        </q-item> -->
      
      </q-list>

      <!-- <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list> -->

      <AboutDialog v-model="aboutDlgVisible"/>
    </q-drawer>
    
     <!-- place QPageSticky at end of page -->
     <q-page-sticky expand position="top">
        <q-toolbar class="bg-accent text-white">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <!-- <q-toolbar-title>
            <div class="text-h7" v-if="docname && docname !== 'new'">
              {{ doctype }} : {{ docname }}
            </div>
            <div class="text-h6" v-else>
              Add new {{ doctype }}
            </div>
          </q-toolbar-title>  -->
          <q-breadcrumbs active-color="white" style="font-size: 16px" class="q-pl-sm">
            <q-breadcrumbs-el :label="$props.doctype" :to="`/list/${$props.doctype}`" />
            <q-breadcrumbs-el class="text-caption" v-if="docname" :label="$props.docname" />
            <q-breadcrumbs-el v-else :label="t('FORM_VIEW_PAGE.NEW_DOCTYPE')" />
          </q-breadcrumbs>
        </q-toolbar>

        <!-- <q-toolbar inset>
          <q-breadcrumbs active-color="white" style="font-size: 16px">
            <q-breadcrumbs-el label="Home" icon="home" />
            <q-breadcrumbs-el label="Components" icon="widgets" />
            <q-breadcrumbs-el label="Toolbar" />
          </q-breadcrumbs>
        </q-toolbar> -->

      </q-page-sticky>
    
    <q-page-container class="q-mt-lg">
      <router-view /> 
    </q-page-container>
  </q-layout>
</template>

<!-- <script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import NotificationList from '../components/NotificationList.vue'
import { useI18n } from 'vue-i18n'

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
 -->

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import NotificationList from '../components/NotificationList.vue' 
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { AppUtil } from 'src/utils/app';
import AboutDialog from 'src/components/AboutDialog.vue';
import { DashboardService } from 'src/services/DashboardService';
import { DocTypeService } from 'src/services/DocTypeService';
import { IDBReadParam } from 'src/interfaces';
import { useRouter, useRoute } from 'vue-router';
import { useEngagementStore } from 'src/stores/engagement-store';
import { DOCTYPES } from 'src/enums';
import { AuthenticationService } from 'src/services/AuthenticationService';
import { TechnicalAnalysisService } from 'src/services/TechnicalAnalysisService';

export default defineComponent({
  // name: 'LayoutName',
  components: {
    NotificationList,
    //EssentialLink,
    AboutDialog
  },
  setup() {
    const t = (text) => AppUtil.translate(text) 
    const router = useRouter()
    const route = useRoute()
    const leftDrawer = ref(false) 
    const notificationsCount = ref(5)
    const leftDrawerOpen = ref(false)
    const user = ref(AppUtil.get_current_user())  
    const aboutDlgVisible = ref(false)
    const engagementStore = useEngagementStore()
    const navigate = (path: string, params: object={}) => AppUtil.route_to_path(path, params)

    const userInitials = ref()
    userInitials.value = AppUtil.get_current_user_initials() 

    const navigateEngagement = (engagement) => {  
      engagementStore.set_current_engagement(engagement)
      if(engagement.has_data_forms){ 
        AppUtil.route_to_path(`/list/${DOCTYPES.ENGAGEMENT_ENTRY}`, {}, { 'engagement': engagement.name })
      }      
      return {}
    }
    
    // const engagements = [{
    //   engagement_name: 'PCRA Makueni 2023',
    //   engagement_type: 'Survey',
    //   engagement_template: 'Default',
    //   administrative_level: 'Makueni'
    // },
    // {
    //   engagement_name: 'PCRA Narok 2023',
    //   engagement_type: 'Survey',
    //   engagement_template: 'Default',
    //   administrative_level: 'Narok'
    // }]
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    function toggleAboutDlg () {
      aboutDlgVisible.value = !aboutDlgVisible.value
    }

    const dashboards = ref([])
    
    DashboardService.get_dashboards().then((recs)=> { 
      dashboards.value = recs
    })

    const engagements = ref([])
    let cfg = {} as IDBReadParam
    cfg.filters = [['status', '=', 'Open'], ['is_published', '=', 1]]
    cfg.fields = ["*"]// ['name', 'engagement_name', 'engagement_type', 'engagement_template', 'administration_level']
    new DocTypeService('Engagement').get_list(cfg).then((recs) => {
      engagements.value = recs
    })

    const logout = async () => {      
      const res = await AuthenticationService.logout()
      if(res){
        // AppUtil.notify("Logged out")
        AppUtil.route_to_path("/login")
      } else {
        AppUtil.notify_error(t('GLOBAL.SERVER_ERROR'))
      }
    }

    const set_breadcrumbs = ( crumbs: object ) => {

    }
    return { 
      t,
      logout,
      leftDrawer,
      leftDrawerOpen,
      notificationsCount,
      toggleLeftDrawer,
      //essentialLinks,
      user,
      userInitials,
      aboutDlgVisible,
      toggleAboutDlg,
      engagements,
      dashboards,
      navigateEngagement,
      navigate,
    }
  }
})
</script>

