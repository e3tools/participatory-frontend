<template>
  <q-page padding>    
    <!-- content -->
    <q-card class="bg-transparent no-shadow no-border" bordered>
      <q-card-section class="q-pa-none">

        <div v-show="false" class="row no-wrap q-col-gutter-sm q-ma-sm shadow-1">
          <q-toolbar class="col-12 bg-secondary text-white shadow-2 rounded-borders">
            <q-select    
              filled
              v-model="adminOne"
              use-input         
              fill-input       
              hide-selected
              input-debounce="0"                 
              :options="adminOneOptions"
              @filter="filterAdminOne"
              @input-value="setModelAdminOne" 
              behavior="menu"
              option-label="shapeName"
              option-value="shapeID"
              placeholder="County"
              style="max-width2:116px; max-width: 33%;"
            />
            <q-space />
            <q-select    
              filled
              v-model="adminTwo"
              use-input         
              fill-input       
              hide-selected
              input-debounce="0"                 
              :options="adminTwoOptions"
              @filter="filterAdminTwo"
              @input-value="setModelAdminTwo" 
              behavior="menu"
              option-label="shapeName"
              option-value="shapeID"
              placeholder="Sub-county"
              style="max-width2:117px; width: 33%;"   
            />
            <q-space />
            <q-select    
              filled
              v-model="adminThree"
              use-input         
              fill-input       
              hide-selected
              input-debounce="0"                 
              :options="adminThreeOptions"
              @filter="filterAdminThree"
              @input-value="setModelAdminThree" 
              behavior="menu"
              option-label="shapeName"
              option-value="shapeID"
              placeholder="Ward"
              style="max-width2:120px; max-width: 33%;"    
            />
            <!-- <q-toolbar-title>Title</q-toolbar-title>
            <q-btn flat round dense icon="search" /> -->
          </q-toolbar>
          <!-- <q-toolbar class="col-4 bg-primary text-white">
            <q-space />
            <q-btn flat round dense icon="bluetooth" class="q-mr-sm" />
            <q-btn flat round dense icon="more_vert" />
          </q-toolbar> -->
        </div>

        <div class="row q-col-gutter-sm" style="background-color: secondary">   
          <!--County-->
          <div class="col-4">          
            <q-item class="q-pa-none">             
              <q-item-section> 
                <q-select    
                    filled
                    v-model="adminOne"
                    use-input         
                    fill-input       
                    hide-selected
                    input-debounce="0"                 
                    :options="adminOneOptions"
                    @filter="filterAdminOne"
                    @input-value="setModelAdminOne" 
                    behavior="menu"
                    option-label="shapeName"
                    option-value="shapeID"
                    placeholder="County"
                    style="max-width:116px"
                    @update:model-value="selectShape"
                  />
              </q-item-section>  
              <q-separator vertical inset />
              <!-- <q-item-section>
                <q-icon class="text-center"
                  size="1.0em"
                  name="arrow_forward"
                  color="primary"
                />
              </q-item-section>            -->
            </q-item>
          </div>
          <!-- <q-separator vertical inset /> -->

          <!--Sub-County-->
          <div class="col-4">          
            <q-item class="q-pa-none">
              <q-item-section> 
                <q-select    
                    filled
                    v-model="adminTwo"
                    use-input         
                    fill-input       
                    hide-selected
                    input-debounce="0"                 
                    :options="adminTwoOptions"
                    @filter="filterAdminTwo"
                    @input-value="setModelAdminTwo" 
                    behavior="menu"
                    option-label="shapeName"
                    option-value="shapeID"
                    placeholder="Sub-county"
                    style="max-width:117px"   
                    @update:model-value="selectShape"
                     />
              </q-item-section>
              <q-separator vertical inset />
              <!-- <q-item-section>
                <q-icon class="text-center"
                  size="1.0em"
                  name="arrow_forward"
                  color="primary"
                />
              </q-item-section>    -->

            </q-item>
          </div>
          <!-- <q-separator class="col-1" vertical inset /> -->

          <!--Ward-->
          <div class="col-4">          
            <q-item class="q-pa-none">
              <q-item-section>
                <q-select    
                    filled
                    v-model="adminThree"
                    use-input         
                    fill-input       
                    hide-selected
                    input-debounce="0"                 
                    :options="adminThreeOptions"
                    @filter="filterAdminThree"
                    @input-value="setModelAdminThree" 
                    behavior="menu"
                    option-label="shapeName"
                    option-value="shapeID"
                    placeholder="Ward"
                    style="max-width:120px"    
                    @update:model-value="selectShape"
                />
              </q-item-section>
            </q-item> 
          </div>

          <!--Periodicity-->
          <!-- <div class="col-4">          
            <q-item class="q-pa-none">
              <q-item-section>
                <q-input label="Period" placeholder="Period"/>
              </q-item-section>
            </q-item>
          </div> -->
          <!-- <q-breadcrumbs class="text-brown">
            <template v-slot:separator>
              <q-icon
                size="1.5em"
                name="arrow_forward"
                color="primary"
              />
            </template>

            <q-breadcrumbs-el label="" icon="home">
              <q-input label="County" placeholder="Period"/>
            </q-breadcrumbs-el>
            <q-breadcrumbs-el icon="widgets">
              <q-input label="Sub-county" placeholder="Sub-county"/>
            </q-breadcrumbs-el>
            <q-breadcrumbs-el label="" icon="navigation">
              <q-input label="Ward" placeholder="Ward"/>
            </q-breadcrumbs-el>
          </q-breadcrumbs> -->

        </div>
      </q-card-section>
    </q-card>
    <q-separator inset />
    <div v-if="loading" class="text-center">
      <q-spinner-ios
        color="primary"
        size="4em"
      /> 
    </div>
   
    <basic-map 
      ref="mapRef" 
      datasource_type="geojson" 
      style_field="density" 
      :center="[0.35243520, 37.89184570312501]"
      @toggle-analysis="toggle_analysis"  
   />
    <MapStatisticsDialog :show="true" />
  </q-page>
</template>


<script lang="ts"> 
import { onMounted } from 'vue';
import { defineAsyncComponent, defineComponent, ref}  from 'vue';  
import { VectorService } from '../services/VectorService'
import { RasterService } from '../services/RasterService'
import { TechnicalAnalysisService } from 'src/services/TechnicalAnalysisService';
import { useRoute } from 'vue-router';

import { watchEffect } from 'vue'; 
import { useQuasar } from 'quasar';
import { AppUtil } from '../utils/app'
import { Dialog } from 'quasar';
import MapStatisticsDialog from '../components/map/MapStatisticsDialog.vue';
import SummaryImg from '../assets/images/pp3.jpeg'
import ExampleComponent from '../components/ExampleComponent.vue'
import { ILegendItem } from '../interfaces'
import { LEGEND_TYPE, ANALYSIS_TYPE } from '../enums'

const VECTOR = 'vector'
const RASTER = 'raster'

export default defineComponent({
  name: 'MapPage',
  props: ['maptype', 'analysis'],
  components: {
    'basic-map': defineAsyncComponent(() => import('components/map/BasicMap.vue')),
    MapStatisticsDialog
  },
  setup(props) {
    const $q = useQuasar()
    const mapRef = ref(null)
    const loading = ref(true)
    const route = useRoute()
    let adminZeroFeatures = []
    let adminOneFeatures = []
    let adminTwoFeatures = []
    let adminThreeFeatures = []

    let adminZeroNames = []
    let adminOneNames = []
    let adminTwoNames = []
    let adminThreeNames = []

    const adminZeroOptions = ref([])
    const adminOneOptions = ref([])
    const adminTwoOptions= ref([])
    const adminThreeOptions = ref([])

    const adminZero = ref(null)
    const adminOne = ref(null)
    const adminTwo = ref(null)
    const adminThree = ref(null)
    const analysis = ref(null)
    const query = route.query

    // if (props.analysis) {
    //   //If there is a query
    //   const analysis = TechnicalAnalysisService.get_analysis(props.analysis).then((doc) => {
    //     mapRef.value.set_datasource(JSON.parse(doc.geom), null, doc.name) 
    //     let legend_items = []
    //     let analysis_type = doc.analysis_type
    //     for(let i=0; i < doc.legend.length; i++) {
    //       let itm = doc.legend[i]
    //       let cfg = {} as ILegendItem
    //       cfg.color = itm.color
    //       cfg.label = itm.label
    //       switch(analysis_type){
    //         case LEGEND_TYPE.TEXT:
    //           cfg.item_type = LEGEND_TYPE.TEXT
    //           cfg.lower_val = itm.alphatext_value
    //           cfg.upper_val = itm.alphatext_value    
    //           break;
    //         case LEGEND_TYPE.NUMERIC:
    //           cfg.item_type = LEGEND_TYPE.NUMERIC
    //           cfg.lower_val = itm.lower_numeric
    //           cfg.upper_val = itm.upper_numeric  
    //           break;
    //         case LEGEND_TYPE.DATE:
    //           cfg.item_type = LEGEND_TYPE.DATE
    //           cfg.lower_val = itm.lower_date
    //           cfg.upper_val = itm.upper_date    
    //           break;
    //       } 
    //       legend_items.push(cfg)
    //     }
    //     mapRef.value.add_legend_v2(legend_items, doc.analysis_name)
    //   })
    // }

    // VectorService.get_admin_zero().then((data) => { 
    //   adminZeroFeatures = data 
    //   adminZeroNames = parseAdmins(data)
    //   adminZeroOptions.value = adminZeroNames
    // })
    // VectorService.get_admin_one().then((data) => {
    //   adminOneFeatures = data 
    //   adminOneNames = parseAdmins(data)
    //   adminOneOptions.value = adminOneNames
    // })
    // VectorService.get_admin_two().then((data) => { 
    //   adminTwoFeatures = data
    //   adminTwoNames = parseAdmins(data)
    //   adminTwoOptions.value = adminTwoNames
    // })
    // VectorService.get_admin_three().then((data) => {
    //   adminThreeFeatures = data 
    //   adminThreeNames = parseAdmins(data)
    //   adminThreeOptions.value = adminThreeNames
    // })
    
    const parseAdmins = (collection) => { 
      const res = []
      collection.features.forEach(element => { 
        res.push({'shapeID': element.properties.shapeID, 'shapeName': element.properties.shapeName })
      });
      return res
    }

    const filterAdmins = (adminLevel, val, update) => {
        if (val === '') {
          update(() => { 
            switch(adminLevel){
              case 0:
                adminZeroOptions.value = adminZeroNames
                break;
              case 1:
                adminOneOptions.value = adminOneNames
                break;
              case 2:
                adminTwoOptions.value = adminTwoNames
                break;
              case 3:
                adminThreeOptions.value = adminThreeNames
                break;
            }
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase() 
          switch(adminLevel){
              case 0:
                adminZeroOptions.value = adminZeroNames.filter(v => v.shapeName.toLowerCase().indexOf(needle) > -1)
                break;
              case 1:
                adminOneOptions.value = adminOneNames.filter(v => v.shapeName.toLowerCase().indexOf(needle) > -1)
                break;
              case 2:
                adminTwoOptions.value = adminTwoNames.filter(v => v.shapeName.toLowerCase().indexOf(needle) > -1)
                break;
              case 3:
                adminThreeOptions.value = adminThreeNames.filter(v => v.shapeName.toLowerCase().indexOf(needle) > -1)
                break;
            }
        })
      }

    watchEffect(() => {
       if (mapRef.value) { 
          VectorService.get_states()
          .then((states) => {
              //mapRef.value.set_datasource(states, null, 'Maryland States')
            }
          )
          //map.set_datasource(null, 'https://api.npoint.io/fdbc5b08a7e7eccb6052')
          
          VectorService.get_admin_zero().then((data) => { 
              adminZeroFeatures = data 
              adminZeroNames = parseAdmins(data)
              adminZeroOptions.value = adminZeroNames 
              if(query.maptype == VECTOR){
                mapRef.value.set_datasource(data, null, 'Kenya')
              }
              loading.value = false

              AppUtil.notify(AppUtil.translate('Select a County, Sub-County or Ward'), false, 'center')
            })
 
          VectorService.get_admin_one().then((data) => {
            adminOneFeatures = data 
            adminOneNames = parseAdmins(data)
            adminOneOptions.value = adminOneNames
            if(query.maptype == VECTOR){
              mapRef.value.set_datasource(data, null, 'Counties')
            }
          })
          VectorService.get_admin_two().then((data) => { 
            adminTwoFeatures = data
            adminTwoNames = parseAdmins(data)
            adminTwoOptions.value = adminTwoNames
            if(query.maptype == VECTOR){
              mapRef.value.set_datasource(data, null, 'Sub-Counties')
            }  
          })
          VectorService.get_admin_three().then((data) => {
            adminThreeFeatures = data 
            adminThreeNames = parseAdmins(data)
            adminThreeOptions.value = adminThreeNames
            if(query.maptype == VECTOR){
              mapRef.value.set_datasource(data, null, 'Wards')
              mapRef.value.add_legend()
            }
          })          
          // mapRef.value.add_tile_layer()
      } else {
        // not mounted yet, or the element was unmounted (e.g. by v-if)
      }
    })

    const setModelAdminOne = (val) => {  
      adminOne.value = val
    }

    const setModelAdminTwo = (val) => {  
      adminTwo.value = val
    }

    const setModelAdminThree = (val) => {  
      adminThree.value = val
    }

    const get_map_instance = () => {
      return mapRef.value ? mapRef.value.get_map_instance() : null
    }

    const selectShape = (admin: object) => { 
      const mapComponent = mapRef.value
      mapComponent.reset_all_feature_styles()
      let feature = mapComponent.select_feature(admin.shapeID, null) 
      let shape = null
      if(!feature){
        shape = adminZeroFeatures.features.filter(el => el.properties.shapeID == admin.shapeID)
        if(shape.length == 0){
          shape = adminOneFeatures.features.filter(el => el.properties.shapeID == admin.shapeID)
        }
        if(shape.length == 0){
          shape = adminTwoFeatures.features.filter(el => el.properties.shapeID == admin.shapeID)
        }
        if(shape.length !== 0){ 
          const layer = mapComponent.add_feature(shape[0])    
          //search again
          feature = mapComponent.select_feature(admin.shapeID, layer)
        }
      }
      if(feature){
        //get_map_instance().fitBounds(feature.getBounds())
        mapComponent.zoom_to_feature(feature)
        //getRaster(feature).then((data) => {
        getRaster(shape?.[0], feature).then((data) => {
          console.log('Raster data: ', data)
          showRasterStats(shape?.[0])

          // Dialog.create({
          //   position: 'bottom',
          //   persistent: true,
          //   color: 'primary',
          //   title: 'Rainfall Statistics',
          //   component: ExampleComponent,
          //   componentProps: {},
          //   //message: 'Statistics for the selected area will go here.',
          //   // message: 'Statistics for the selected area will go here. <img class="text-center" style="height:300px;width:300px;" src="https://www.researchgate.net/profile/Aung-Oo-3/publication/312375537/figure/fig2/AS:472550774972417@1489676292112/Average-monthly-rainfall-and-temperature-a-1990-20121-and-mean-temperature-and.png" alt="No image" />',
          //   // html: true,
          //   // form: {
          //   //   option: {
          //   //     type: 'radio',
          //   //     model: 'opt1',
          //   //     items: [
          //   //       {label: 'Option 1', value: 'opt1'},
          //   //       {label: 'Option 2', value: 'opt2'},
          //   //       {label: 'Option 3', value: 'opt3'}
          //   //     ]
          //   //   }
          //   // },
          //   buttons: [
          //     'Cancel',
          //     {
          //       label: 'Ok',
          //       handler (data) {
          //         //Toast.create('Returned ' + JSON.stringify(data))
          //         // data.option is 'opt1'
          //       }
          //     }
          //   ]
          // })
        })
      } 
    }

    const getRaster = async (shape: object, feature: object) => { 
      //const raster = await RasterService.getRainfall(feature.feature.geometry) 
      const raster = await RasterService.getRainfall(shape.geometry) 
      mapRef.value.add_image_overlay(raster, raster, feature.getBounds())
      //get_map_instance().fitBounds(feature.getBounds())
      return raster
    }

    const showRasterStats = (data: object) => {
      Dialog.create({
        position: 'bottom',
        persistent: true,
        color: 'primary',
        title: `Rainfall Statistics: ${data.properties.shapeName}`,
        //component: MapStatisticsDialog,
        //message: 'Statistics for the selected area will go here.',
        message: 'Statistics for the selected area will go here. <img class="text-center" style="height:300px;width:300px;" src="https://www.researchgate.net/profile/Aung-Oo-3/publication/312375537/figure/fig2/AS:472550774972417@1489676292112/Average-monthly-rainfall-and-temperature-a-1990-20121-and-mean-temperature-and.png" alt="No image" />',
        html: true,
        form: {
          option: {
            type: 'radio',
            model: 'opt1',
            items: [
              {label: 'Option 1', value: 'opt1'},
              {label: 'Option 2', value: 'opt2'},
              {label: 'Option 3', value: 'opt3'}
            ]
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            class: 'save',
            handler (data) {
              //Toast.create('Returned ' + JSON.stringify(data))
              // data.option is 'opt1'
            }
          }
        ]
      })
    }

    const toggle_analysis = (val: string, show: boolean) => { 
      if(show){
        //check if the layer exists or not
        let exists = mapRef.value.analysis_exists(val)
        if(exists) {
          mapRef.value.remove_analysis(val) //remove the layer first to allow for redraw
        }
        mapRef.value.add_analysis(val);
      } else {
        mapRef.value.remove_analysis(val)
      }      
    }

    //  onMounted(() => {
    //     VectorService.get_states().then((states) => { 
    //       mapRef.value.set_datasource(states)
    //     })      
    //  })
     return {
      loading,
      mapRef,
      adminZero,
      adminOne,
      adminTwo,
      adminThree,
      adminZeroOptions,
      adminOneOptions,
      adminTwoOptions,
      adminThreeOptions,
      filterAdminOne: (val, update) => filterAdmins(1, val, update),
      filterAdminTwo: (val, update) => filterAdmins(2, val, update),
      filterAdminThree: (val, update) => filterAdmins(3, val, update),
      setModelAdminOne,
      setModelAdminTwo,
      setModelAdminThree,
      selectShape,
      toggle_analysis
     }
  }
})
</script>
