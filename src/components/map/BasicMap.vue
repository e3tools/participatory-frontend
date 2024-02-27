<template>
  <div class="q-pa-sm" :id="map_id">
    <map-query-dialog ref="map_query_dialog_ref" 
        @toggle-analysis="do_toggle" 
        @select-admin="select_admin"
        @update-opacity="update_opacity" />
  </div>  
</template>
 
<script lang="ts">

import { defineAsyncComponent, defineComponent, onMounted, ref } from 'vue' 
import L from 'leaflet' 
import 'leaflet/dist/leaflet.css'
import { watchEffect } from 'vue'
import { reactive, watch } from 'vue'  
import { useRoute } from 'vue-router' 
import { ILegendItem } from '../../interfaces'
import { LEGEND_TYPE, DATASOURCE, DATA_TYPE, OPERATOR } from '../../enums'
import { alphaNum } from '@vuelidate/validators'
import { TechnicalAnalysisService } from 'src/services/TechnicalAnalysisService'
import { VectorService } from 'src/services/VectorService'
import { AppUtil } from 'src/utils/app'
import { onUnmounted } from 'vue'
import { useQuasar } from 'quasar';

const ENABLE_TILES = true;

export default defineComponent({
  name: 'BasicMap',
  props: ['datasource_type', 'style_field', 'center'],
  components: {
    'map-query-dialog': defineAsyncComponent(()=> import('../map/MapQueryDialog.vue'))
  },
  setup (props, ctx) {
    const $q = useQuasar();
    const map_id = 'map-div'
    let layer_control_instance = null
    let map_instance = null
    let map_data = ref([]) 
    
    let datasource = ref({})
    let geojson_layer = null
    let image_overlay = null
    let info_control = null
    let map_query_control = null
    let data_label = 'Dataset'
    const current_layer = ref(null)
    const route = useRoute()
    let analysis_doc = null;
    const selected_feature = ref(null);

    const map_options = {
      center: L.latLng(props.center ? props.center : [-0.437099, 36.958010/*27.0902, -95.7129*/]),
      zoom: 6,
      zoomControl: true,
      zoomAnimation: false,
      mapBounds: L.latLngBounds(
        L.latLng(18.91619, -171.791110603),
        L.latLng(71.3577635769, -66.96466)
      ),
      layers: []
    }
    
    let legend_items = []
    const init_map = () => { 
      //create tile layer and add to map
      // const osm = L.tileLayer(
      //   `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
      //   {
      //     attribution:
      //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      //   }
      // ).addTo(map)

      const osm = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          }
      )

      var osmHOT = L.tileLayer(
        'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', 
        {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
        }
      )

      const darkMap = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }
      )
      map_options['layers'] = [osm/*, osmHOT, darkMap*/]
       // create the map
       const map = L.map(map_id, map_options)

      // create layer_control_instance
      layer_control_instance = L.control
        .layers({
          osm,
          //osmHOT,
          //darkMap
        })
        .addTo(map)

        map.on('zoomstart', () => {
          //console.log('Zoom started')
        })

        map.on('baselayerchange', function(e) {
            console.log(e, 'Base layer change'); 
            current_layer.value.bringToFront();
        });

        map_instance = map 
    }
    
    // const changeBaseMap => (base_map) {
    //   // const selected_base_map = this.baseMaps[base_map]; // get selected layer
    //   // this.map.addLayer(selected_base_map);
    //   // selected_base_map.bringToFront();// make the layer
    //   // // if(this.selected_base_map) this.map.removeLayer(this.selected_base_map)
    //   // this.selected_base_map = selected_base_map
    //   // if (this.current_raster) this.current_raster.bringToFront(); //ensure the layer is top most
    //   // if (this.raster_layers.length)
    //   //   this.raster_layers[0]?.bringToFront();
    //   // this.raster_layers[1]?.bringToFront();
    // },

    /**
     *  Create info control
    */
    const addInfoControl = () => {
      // control that shows info on hover
      info_control = L.control()
      let info_div = null

      info_control.onAdd = (map) => {
        info_div = L.DomUtil.create('div', 'info')
        info_div.innerHtml = '<span>TT</span>' 
        //this.update() 
        return info_div
      }

      info_control.update = (fProps) => {
        let contents = ''
        if(fProps.density !== undefined){
          contents = fProps ? `<b>${fProps.name}</b> <br />${fProps.density} people / mi <sup>2</sup>`: 'Hover over a state'
        } else {
          contents = fProps ? `<b>${fProps.shapeName}</b>`: 'Hover over an area'
        }
        info_div.innerHTML = `<h4>Details</h4> ${contents}`
      }

      info_control.addTo(map_instance)
    } 

    const addMapQueryControl = () => {
      let button = null
      map_query_control = L.Control.extend({
        options: {
          position: 'topleft'
        },
        onAdd: function(map){
          button = L.DomUtil.create('input');//, 'btnQueryMap')
          button.type = 'button'
          //button.title = 'Query Map'
          button.value = '??'
          button.innerHTML = '<i class="fa fa-bars"></i>'
          button.class = 'fa-solid fa-question' //'q-btn q-btn-item'
          button.onclick = function(e) {
            map_query_dialog_ref.value.showWindow(true)
          }
          return button
        },
        onRemove: function(map){
          //nothing to do
          console.log('Removing map query button')
        },
        update: function(fProps){
          console.log('Updating control')
        }
      })

      //map_instance.addControl(new map_query_control())
      new map_query_control().addTo(map_instance)
    }

    const fetchData = async (url) => {
      //const url = 'https://api.npoint.io/fdbc5b08a7e7eccb6052';
      try {
        const response = await fetch(url)
        const data = await response.json()
        return data
      } catch (err) {
        console.log('Error', err)
      }
    } 

    /**
     * Set datasource. Supply either the actual data or a url to fetch data from
     * @param data 
     * @param url 
     */
    const set_datasource = async (analysis_name:string, data=null, url=null, label='Dataset', data_type=DATA_TYPE.GEOJSON, style_field=null, legend_items: ILegendItem[]=[], layer_name: string=null) => { 
      if(data && url){ 
        throw('Data and URL cannot be supplied at the same time. Provide one or the other')
      }  
      data_label = label
      const fetchGeoJson = async () => { 
         return await fetchData('https://api.npoint.io/fdbc5b08a7e7eccb6052')
      }     
      if(data_type == DATA_TYPE.GEOJSON){
        if(data){
          map_data.value.push({ 'datatype': data_type, 'data': data, 'label': label, style_field, 'legend_items': legend_items });
        } 
        else {
          const d = await fetchGeoJson()  
          map_data.value.push({ 'datatype': data_type, 'data': data, 'label': label, style_field, 'legend_items': legend_items });
        }   
        const layer = add_geojson_layer(data, label);
        map_data.value[map_data.value.length - 1]['layer'] = layer
      }
      else if (data_type == DATA_TYPE.RASTER){ 
        const bounds = get_selected_feature()?.getBounds();
        map_data.value.push({ 'datatype': data_type, 'data': url, 'label': label, style_field, 'legend_items': legend_items });
        let raster_layer = null;
        if(!ENABLE_TILES){
          raster_layer = add_image_overlay(url, analysis_name, bounds);
        } else {
          raster_layer = add_tile_layer(url, layer_name);
        } 
        map_data.value[map_data.value.length - 1]['layer'] = raster_layer;
        //show the clipped vector
        //show raster on top of the clipped vector
      }
    }

    /**
     * Construct Legend Items from analysis doctype
     * @param analysis_doc 
     */
    const make_legend = (analysis_doc: object) => {
      let legend_items = []
      let analysis_type = analysis_doc?.analysis_type;
      for(let i=0; i < analysis_doc?.legend?.length; i++) {
        let itm = analysis_doc.legend[i]
        let cfg = {} as ILegendItem
        cfg.color = itm.color
        cfg.label = itm.label
        cfg.operator = itm.operator
        switch(analysis_type){
          case LEGEND_TYPE.TEXT:
            cfg.item_type = LEGEND_TYPE.TEXT
            cfg.absolute_val = itm.alphatext_value
            cfg.lower_val = itm.alphatext_value
            cfg.upper_val = itm.alphatext_value    
            break;
          case LEGEND_TYPE.NUMERIC:
            cfg.item_type = LEGEND_TYPE.NUMERIC
            cfg.absolute_val = itm.numeric_value
            cfg.lower_val = itm.lower_numeric
            cfg.upper_val = itm.upper_numeric  
            break;
          case LEGEND_TYPE.DATE:
            cfg.item_type = LEGEND_TYPE.DATE
            cfg.absolute_val = itm.date_value
            cfg.lower_val = itm.lower_date
            cfg.upper_val = itm.upper_date    
            break;
        } 
        legend_items.push(cfg)
      }
      return legend_items;
    }

    const get_analysis = (label: string) => {
      let res = map_data.value?.filter(el => el.label == label);
      return res?.length > 0 ? res[0] : null;
    }
    const analysis_exists = (label: string) => {
      let res = get_analysis(label);
      return res != null
    }

    const remove_analysis = (label: string) => {
      let layers = layer_control_instance?._layers.slice(); 
      for(let i=0; i < layers?.length; i++){
        let layer = layers[i];
        if(/*layer.name == label &&*/ layer.overlay){
          layer_control_instance.removeLayer(layer.layer);
        }
      }

      let items = map_data.value?.filter(el => el.label == label);
      items.forEach((el)=> {
        //remove the layer
        if(el.layer){
          if(map_instance.hasLayer(el.layer)){
            console.log("Has layer")
            map_instance.removeLayer(el.layer);  
          }
        }
        if(el.legend){
          map_instance.removeControl(el.legend);
        }
      })
      //reset map_data to exclude the removed items
      map_data.value =  map_data.value?.filter(el => el.label != label); 
    }

    const add_geojson_layer = (data: object, label: '', addToControl=true) => {
      let layer = null;
      if(data){
        try{
          // add to the map
          layer = L.geoJson(data, {
            on_each_feature: on_each_feature,
            style: style_feature
          }).addTo(map_instance) 

          if(addToControl){
            // Add to the layer control
            layer_control_instance.addOverlay(
              layer,
              label
            )  
          }
          geojson_layer = layer
          map_instance.fitBounds(layer.getBounds());
        } catch (err) {
            console.log(err, err.message)
        }
      }
      return layer
    }

    const add_geojson_layer_GROUP = (data: object, label: '', addToControl=true) => {
      let layer = null;
      let layer_group = null;
      if(data){
        try{
          // add to the map
          // layer = L.geoJson(data, {
          //   on_each_feature: on_each_feature,
          //   style: style_feature
          // }).addTo(map_instance)

          

          layer = L.geoJson(data, {
            on_each_feature: on_each_feature,
            style: style_feature
          })

          layer_group = L.layerGroup([layer]).addTo(map_instance);

          if(addToControl){
            // Add to the layer control
            layer_control_instance.addOverlay(
              layer_group,
              label
            )  
          }
          geojson_layer = layer_group
          map_instance.fitBounds(layer.getBounds());
        } catch (err) {
            console.log(err, err.message)
        }
      }
      return layer_group
    }
    
    const style_feature = (feature: object) => { 
      return {
        fillColor: get_color_v2(feature.properties[feature.style_field], feature.style_field), // get_color(feature.properties[feature.style_field]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.9,// 0.7
      }
    }

    const get_color = (val) => { 
      return val > 1000 ? '#800026' :
           val > 500  ? '#BD0026' :
           val > 200  ? '#E31A1C' :
           val > 100  ? '#FC4E2A' :
           val > 50   ? '#FD8D3C' :
           val > 20   ? '#FEB24C' :
           val > 10   ? '#FED976' :
                        '#FFEDA0';
    }

    const get_color_v2 = (val: object, analysis_name: string) => {
      let map_info = get_analysis(analysis_name);
      for(let i=0; i < map_info?.legend_items.length; i++){
        let itm = map_info.legend_items[i];
        let match = match_legend_item(val, itm)
        if(match) {
          return itm.color;
        }
      }
      return '';// '#FFEDA0';
    }

    const match_legend_item = (val: object, legend_item: ILegendItem) => {
      const op = legend_item.operator;
      let match = false; 
      let absolute_val = legend_item.absolute_val;// val instanceof Date ? legend_item.date_val : !isNaN(val) ? legend_item.numeric_value : legend_item.alphatext_value.toString();
      let lower_val = legend_item.lower_val;// val instanceof Date ? legend_item.lower_date : !isNaN(val) ? legend_item.lower_numeric : null;
      let upper_val = legend_item.upper_val;// val instanceof Date ? legend_item.upper_date : !isNaN(val) ? legend_item.upper_numeric : null;

      if(val instanceof String) {
        if([OPERATOR.EQUALS, OPERATOR.IN, OPERATOR.LIKE].includes(op)){
          match = absolute_val.indexOf(val) != 0
        }
        else if ([OPERATOR.NOT_EQUALS, OPERATOR.NOT_IN, OPERATOR.NOT_LIKE].includes(op)) {
          match = absolute_val.indexOf(val) == -1;
        }
      } 
      else {
        if([OPERATOR.EQUALS, OPERATOR.GREATER_OR_EQUAL_TO, OPERATOR.LESS_OR_EQUAL_TO].includes(op)) {
          match = absolute_val === val;
        }
        else if ([OPERATOR.LESS_THAN].includes(op)) {
          match = val < absolute_val;
        }
        else if ([OPERATOR.GREATER_THAN].includes(op)) {
          match = val > absolute_val;
        }
        else if ([OPERATOR.BETWEEN].includes(op)) {
          match = lower_val <= val && val <= upper_val;
        }
      }
      return match;
    }

     /**
     * Hightlight feature
     * @param e 
     */
     const highlight_feature = (e) => {
      const layer = e.target

      select_feature(layer);
      // layer.setStyle({
      //   weight: 5,
      //   color: '#666',
      //   dashArray: '',
      //   fillOpacity: 0.7
      // })

      // layer.bringToFront()
      // info_control.update(layer.feature.properties)
    }
    
    /**
     * Get feature
     */
    const get_feature = (id: string, feature: object) => {      
      let res = feature
      if(!feature && id){
        for(var i=0; i < Object.keys(map_instance._layers).length; i++){
          let el = Object.values(map_instance._layers)[i] 
          if(el.feature !== undefined && el.feature.properties.name == id){
            res = el 
            break
          }
        } 
      } 
      return res
    }

    /**
     * Select feature
     */
    const select_feature = async (id: string, level: number, layer: object) => {      
      // if(!layer && id){
      //   for(var i=0; i < Object.keys(map_instance._layers).length; i++){
      //     let el = Object.values(map_instance._layers)[i] 
      //     if(el.feature !== undefined && el.feature.properties.shapeID == id){
      //       layer = el 
      //       break
      //     }
      //   } 
      // }  
      selected_feature.value = null;
      let feature = get_feature(id, layer)
      if(!feature){
        //try add the feature first
        const admin = await VectorService.get_admin(id, level);
        let added_layer = add_feature(JSON.parse(admin.geom)['features'][0], admin.name);
        feature = get_feature(id, added_layer);
      }
      if(feature){
        selected_feature.value = feature;
        feature.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        })

        feature.bringToFront()
        if(feature?.feature){
          info_control.update(feature?.feature?.properties)
        }
      }
      return feature
    }
    /**
     * Reset Highlight
     * @param e
     */
    const reset_highlight = (e) => {
      geojson_layer.resetStyle(e.target)
    }

    /**
     * Reset all styles for the current layer
     * @param id 
     * @param layer 
     */
    const reset_all_feature_styles = () => {
      if(geojson_layer){ 
        geojson_layer.resetStyle()
      }  
    }

    /**
     * Zoom to feature
     * @param e 
     */
    const _zoom_feature = (e) => {
      map_instance.fitBounds(e.target.getBounds())
    }

    /**
     * Zoom to feature
     * @param e 
     */
     const zoom_to_feature = (feature: object) => {
      if(feature){
        map_instance.fitBounds(feature.getBounds())
      }
    }

    /**
     * Loop utility for each feature
     * @param feature 
     * @param layer ]
     */
    const on_each_feature = (feature, layer) => { 
      if(layer) {
        if(feature.properties /*&& feature.properties.name*/) {
          layer.on({
            mouseover: highlight_feature,
            //mouseout: reset_highlight,
            click: _zoom_feature
          })
        }
      } else {
        console.log('Invalid layer: ', feature)
      }
    }

    const add_legend = () => {
      const legend = L.control({ position: 'bottomright' })

      legend.onAdd = (map) => {

        const div = L.DomUtil.create('div', 'info legend')
        const grades = [0, 10, 20, 50, 100, 200, 500, 1000]
        const labels = []
        let from, to

        for(let i =0; i < grades.length; i++){
          from = grades[i]
          to = grades[i+1]

          labels.push(`<i style="background:${get_color(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`) 
        }
        div.innerHTML = labels.join('<br>')
        return div
      }

      legend.addTo(map_instance)
    }

    const add_legend_v2 = (analysis_name: string, items: ILegendItem[], title:string) => { 
      legend_items = items
      const legend = L.control({ position: 'bottomright' });
      map_data.value.forEach(el => {
        if(el.label == analysis_name) {
          el['legend_items'] = items;
          el['legend'] = legend;
        }
      });     

      const labels = [`<strong>${title}</strong>`]
      legend.onAdd = (map) => {

        const div = L.DomUtil.create('div', 'info legend')
        const grades = [0, 10, 20, 50, 100, 200, 500, 1000]
        //const labels = []
        let from, to

        items.forEach(el => {
          let from = el.lower_val;
          let to = el.upper_val;
          let color = el.color;
          switch(el.item_type) {
            case LEGEND_TYPE.TEXT:
              labels.push(`<i style="background:${color}"></i> ${from}${to ? `&ndash;${to}` : '+'}`) 
              break
            case LEGEND_TYPE.NUMERIC:
              labels.push(`<i style="background:${color}"></i> ${from}${to ? `&ndash;${to}` : '+'}`) 
              break
            case LEGEND_TYPE.DATE:
              labels.push(`<i style="background:${color}"></i> ${from}${to ? `&ndash;${to}` : '+'}`)   
            break
            default:
              break  
          }
          // if(el.item_type == LEGEND_TYPE.TEXT){
          // }
        })
        // for(let i =0; i < grades.length; i++){
        //   from = grades[i]
        //   to = grades[i+1]

        //   labels.push(`<i style="background:${get_color(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`) 
        // }
        div.innerHTML = labels.join('<br>')
        return div
      }
      legend.addTo(map_instance)
    }

    const add_tile_layer = (url: '', layer: '') => {
      //see http://thredds.northwestknowledge.net:8080/thredds/wms/TERRACLIMATE_ALL/data/TerraClimate_ws_2022.nc?service=WMS&version=1.3.0&request=GetCapabilities
      
      // url = 'http://ows.mundialis.de/services/service?'
      // layer = 'SRTM30-Colored-Hillshade'
      // url = 'http://41.227.30.141:8600/geoserver/ldms/wms?'
      // layer = 'ldms:lulc20231230163929437000'
      //url = 'http://kmddl.meteo.go.ke:8081/SOURCES/.KMD/.Kenya_v03r05/.ALL/.Rainfall/.daily/.precip/%28TotRain%29%28seasonalStat%29cvn/parameter/%28PerDA%29eq/%7Bdataflag%7Dif/%281%29%28DayStart%29cvn/parameter/%28%20%29append/%28Jul%29%28seasonStart%29cvn/parameter/append/%28%20-%20%29append/%2830%29%28DayEnd%29cvn/parameter/append/%28%20%29append/%28Sep%29%28seasonEnd%29cvn/parameter/append/5/%28spellThreshold%29cvn/parameter/1/%28wetThreshold%29cvn/parameter/0.0/%28seasonalStat%29cvn/get_parameter/%28TotRain%29eq/%7Bnip/nip/flexseastotAvgFill//units//mm/def/40.0//probExcThresh1/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWD%29eq/%7B3/-1/roll/pop/flexseasonalfreqGT/30.0//probExcThresh2/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDD%29eq/%7B3/-1/roll/pop/flexseasonalfreqLT/30.0//probExcThresh3/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28RainInt%29eq/%7B3/-1/roll/pop/flexseasonalmeandailyvalueGT//units/%28mm/day%29def/10.0//probExcThresh4/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDS%29eq/%7BflexseasonalnonoverlapDSfreq//units//spells/def/3.0//probExcThresh5/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWS%29eq/%7BflexseasonalnonoverlapWSfreq//units//spells/def/3.0//probExcThresh6/parameter%7Dif/%28PoE%29%28yearlyStat%29cvn/parameter/%28CoV%29eq/%7Bpop/dup%5BT%5Drmsaover/exch%5BT%5Daverage/div//percent/unitconvert/%28%20%29exch%7Dif/startcolormap/DATA/0/100/RANGE/transparent/black/navy/0/VALUE/navy/navy/2/bandmax/blue/blue/6/bandmax/DeepSkyBlue/DeepSkyBlue/12/bandmax/aquamarine/aquamarine/20/bandmax/PaleGreen/PaleGreen/25/bandmax/moccasin/moccasin/30/bandmax/yellow/yellow/40/bandmax/DarkOrange/DarkOrange/50/bandmax/red/red/60/bandmax/DarkRed/DarkRed/80/bandmax/brown/brown/100/bandmax/brown/endcolormap/%28yearlyStat%29cvn/get_parameter/%28CoV%29eq/%7BDATA/0/50/RANGE%7Dif/%28yearlyStat%29cvn/get_parameter/%28Var%29eq/%7Bpop/units/exch//units/undef%5BT%5Dstddev/Infinity/maskge/dup/mul/DATA/0/AUTO/RANGE/exch//units/exch/cvntos/%282%29append/cvn/def/%28%20%29exch%7Dif/%28yearlyStat%29cvn/get_parameter/dup/%28PoE%29eq/exch/%28PonE%29eq/or/%7B//probExcThresh/parameter/exch/units/3/-2/roll/exch/flaggt%5BT%5Daverage//yearlyStat/get_parameter/%28PoE%29ne/%7B-1/mul/1/add%7Dif//percent/unitconvert/correlationcolorscale/DATA/0/100/RANGE/exch/cvntos/%28%20%29exch//probExcThresh/get_parameter/s==/exch/%28%20%29exch/%28%20%295/array/astore/concat/exch%7Dif/exch/%28yearlyStat%29cvn/get_parameter/exch/%28in%20%29lpar/%28seasonStart%29cvn/get_parameter/%28%20%29%28DayStart%29cvn/get_parameter/%28%20-%20%29%28seasonEnd%29cvn/get_parameter/%28%20%29%28DayEnd%29cvn/get_parameter/rpar/12/array/astore/concat/%28long_name%29cvn/exch/def/%28name%29cvn/%28proba%29cvn/def/a-/-a/SOURCES/.WORLDBATH/.bath/X/32/43/RANGE/Y/-6/6/RANGE/1/index/SOURCES/.Features/.Political/.Kenya/a:/.Wards/.the_geom/:a:/.SubCounties/.the_geom/:a:/.Counties/.the_geom/:a/X/Y/fig-/colors/colors/||/colors/grey/verythin/stroke/stroke/black/thinnish/stroke/-fig/%28antialias%29cvn/true/psdef/%28framelabel%29cvn/%28seasonalStat%29cvn/get_parameter/%28TotRain%29eq/%7B%28Total%20Rainfall%29%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWD%29eq/%7B%28Number%20of%20Wet%20Days%20-%20days%20above%20%29//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDD%29eq/%7B%28Number%20of%20Dry%20Days%20-%20days%20below%20%29//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28RainInt%29eq/%7B%28Rainfall%20Intensity%20-%20average%20daily%20rainfall%20for%20days%20above%20%29//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDS%29eq/%7B%28Number%20of%20Dry%20Spells%20-%20%29//spellThreshold/get_parameter/s==/append/%28%20or%20more%20continuous%20days%20below%20%29append//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWS%29eq/%7B%28Number%20of%20Wet%20Spells%20-%20%29//spellThreshold/get_parameter/s==/append/%28%20or%20more%20continuous%20days%20above%20%29append//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/psdef/%28layers%29cvn%5B%28proba%29cvn/%28SubCounties%29cvn/%28Counties%29cvn%5Dpsdef/wms.xml?plotaxislength=840'
      //url = 'http://thredds.northwestknowledge.net:8080/thredds/wms/TERRACLIMATE_ALL/data/TerraClimate_ws_2022.nc?REQUEST=GetLegendGraphic&LAYER=ws&PALETTE=invblues_11'
      //layer = 'ws'
      const wms_layer = L.tileLayer.wms(url, {
            layers: layer,
            transparent: true,
            format: 'image/png'
        }).addTo(map_instance);
      current_layer.value = wms_layer;
      return wms_layer;
    }

    const add_image_overlay = (url: '', layer: '', bounds: object) => {
      //see http://thredds.northwestknowledge.net:8080/thredds/wms/TERRACLIMATE_ALL/data/TerraClimate_ws_2022.nc?service=WMS&version=1.3.0&request=GetCapabilities
      
      // url = 'http://ows.mundialis.de/services/service?'
      // layer = 'SRTM30-Colored-Hillshade'
      // url = 'http://41.227.30.141:8600/geoserver/ldms/wms?'
      // layer = 'ldms:lulc20231230163929437000'
      //url = 'http://kmddl.meteo.go.ke:8081/SOURCES/.KMD/.Kenya_v03r05/.ALL/.Rainfall/.daily/.precip/%28TotRain%29%28seasonalStat%29cvn/parameter/%28PerDA%29eq/%7Bdataflag%7Dif/%281%29%28DayStart%29cvn/parameter/%28%20%29append/%28Jul%29%28seasonStart%29cvn/parameter/append/%28%20-%20%29append/%2830%29%28DayEnd%29cvn/parameter/append/%28%20%29append/%28Sep%29%28seasonEnd%29cvn/parameter/append/5/%28spellThreshold%29cvn/parameter/1/%28wetThreshold%29cvn/parameter/0.0/%28seasonalStat%29cvn/get_parameter/%28TotRain%29eq/%7Bnip/nip/flexseastotAvgFill//units//mm/def/40.0//probExcThresh1/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWD%29eq/%7B3/-1/roll/pop/flexseasonalfreqGT/30.0//probExcThresh2/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDD%29eq/%7B3/-1/roll/pop/flexseasonalfreqLT/30.0//probExcThresh3/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28RainInt%29eq/%7B3/-1/roll/pop/flexseasonalmeandailyvalueGT//units/%28mm/day%29def/10.0//probExcThresh4/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDS%29eq/%7BflexseasonalnonoverlapDSfreq//units//spells/def/3.0//probExcThresh5/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWS%29eq/%7BflexseasonalnonoverlapWSfreq//units//spells/def/3.0//probExcThresh6/parameter%7Dif/%28PoE%29%28yearlyStat%29cvn/parameter/%28CoV%29eq/%7Bpop/dup%5BT%5Drmsaover/exch%5BT%5Daverage/div//percent/unitconvert/%28%20%29exch%7Dif/startcolormap/DATA/0/100/RANGE/transparent/black/navy/0/VALUE/navy/navy/2/bandmax/blue/blue/6/bandmax/DeepSkyBlue/DeepSkyBlue/12/bandmax/aquamarine/aquamarine/20/bandmax/PaleGreen/PaleGreen/25/bandmax/moccasin/moccasin/30/bandmax/yellow/yellow/40/bandmax/DarkOrange/DarkOrange/50/bandmax/red/red/60/bandmax/DarkRed/DarkRed/80/bandmax/brown/brown/100/bandmax/brown/endcolormap/%28yearlyStat%29cvn/get_parameter/%28CoV%29eq/%7BDATA/0/50/RANGE%7Dif/%28yearlyStat%29cvn/get_parameter/%28Var%29eq/%7Bpop/units/exch//units/undef%5BT%5Dstddev/Infinity/maskge/dup/mul/DATA/0/AUTO/RANGE/exch//units/exch/cvntos/%282%29append/cvn/def/%28%20%29exch%7Dif/%28yearlyStat%29cvn/get_parameter/dup/%28PoE%29eq/exch/%28PonE%29eq/or/%7B//probExcThresh/parameter/exch/units/3/-2/roll/exch/flaggt%5BT%5Daverage//yearlyStat/get_parameter/%28PoE%29ne/%7B-1/mul/1/add%7Dif//percent/unitconvert/correlationcolorscale/DATA/0/100/RANGE/exch/cvntos/%28%20%29exch//probExcThresh/get_parameter/s==/exch/%28%20%29exch/%28%20%295/array/astore/concat/exch%7Dif/exch/%28yearlyStat%29cvn/get_parameter/exch/%28in%20%29lpar/%28seasonStart%29cvn/get_parameter/%28%20%29%28DayStart%29cvn/get_parameter/%28%20-%20%29%28seasonEnd%29cvn/get_parameter/%28%20%29%28DayEnd%29cvn/get_parameter/rpar/12/array/astore/concat/%28long_name%29cvn/exch/def/%28name%29cvn/%28proba%29cvn/def/a-/-a/SOURCES/.WORLDBATH/.bath/X/32/43/RANGE/Y/-6/6/RANGE/1/index/SOURCES/.Features/.Political/.Kenya/a:/.Wards/.the_geom/:a:/.SubCounties/.the_geom/:a:/.Counties/.the_geom/:a/X/Y/fig-/colors/colors/||/colors/grey/verythin/stroke/stroke/black/thinnish/stroke/-fig/%28antialias%29cvn/true/psdef/%28framelabel%29cvn/%28seasonalStat%29cvn/get_parameter/%28TotRain%29eq/%7B%28Total%20Rainfall%29%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWD%29eq/%7B%28Number%20of%20Wet%20Days%20-%20days%20above%20%29//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDD%29eq/%7B%28Number%20of%20Dry%20Days%20-%20days%20below%20%29//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28RainInt%29eq/%7B%28Rainfall%20Intensity%20-%20average%20daily%20rainfall%20for%20days%20above%20%29//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDS%29eq/%7B%28Number%20of%20Dry%20Spells%20-%20%29//spellThreshold/get_parameter/s==/append/%28%20or%20more%20continuous%20days%20below%20%29append//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWS%29eq/%7B%28Number%20of%20Wet%20Spells%20-%20%29//spellThreshold/get_parameter/s==/append/%28%20or%20more%20continuous%20days%20above%20%29append//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/psdef/%28layers%29cvn%5B%28proba%29cvn/%28SubCounties%29cvn/%28Counties%29cvn%5Dpsdef/wms.xml?plotaxislength=840'
      //url = 'http://thredds.northwestknowledge.net:8080/thredds/wms/TERRACLIMATE_ALL/data/TerraClimate_ws_2022.nc?REQUEST=GetLegendGraphic&LAYER=ws&PALETTE=invblues_11'
      //layer = 'ws'
      var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
      var altText = 'Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.';
      var latLngBounds = bounds// L.latLngBounds([[40.799311, -74.118464], [40.68202047785919, -74.33]]);
      if(image_overlay){
          map_instance.removeLayer(image_overlay)
      }
      image_overlay = L.imageOverlay(url, latLngBounds, {
          //opacity: 1.0,
          errorOverlayUrl: url, // errorOverlayUrl,
          // alt: altText,
          interactive: true,
          crossOrigin: false
      }).addTo(map_instance)  
      //L.rectangle(latLngBounds).addTo(map_instance);
      map_instance.fitBounds(latLngBounds);
      image_overlay.bringToFront();
      return image_overlay;
    }

    onMounted(() => {
      init_map()
      addInfoControl()
      addMapQueryControl() 
      //add_legend()
    })

    // watchEffect(() => {
    //   // watch map_data for changes
    //   if (Object.keys(map_data).length !== 0) {
    //     // Add to the map
    //     if(props.datasource_type == 'geojson'){
    //       add_geojson_layer(map_data)
    //     }  
    //   }
    // })

    // watch(() => map_data.value, () => {
    //   // watch map_data for changes 
    //   //if (Object.keys(map_data.value).length !== 0) {
    //   if (map_data.value.length !== 0) {
    //     // Add to the map
    //     if(props.datasource_type == 'geojson'){
    //       add_geojson_layer(map_data.value['data'], data_label)
    //     }  
    //   }
    // })

    watch(() => [...map_data.value], (currVal, oldVal) => {
      //See https://www.netlify.com/blog/2021/01/29/deep-dive-into-the-vue-composition-apis-watch-method/#:~:text=Introduction%20to%20the%20Watch%20API,log(currentValue)%3B%20console.
      // watch map_data for changes 
      //if (Object.keys(map_data.value).length !== 0) {
      if (currVal.length !== 0) {
        // Add to the map 
        /*
        map_data.value.forEach((el, idx) => { 
          if(el.datatype == 'geojson'){
            let layer = add_geojson_layer(el['data'], el['label']);
            map_data.value[idx]['layer'] = layer
          }  
        }) */
      }
    })  

    const add_feature = (geojson_feature: object, layer_id: string) => {
      if(geojson_layer){
        //If there is a current layer, remove
        map_instance.removeLayer(geojson_layer)
        geojson_layer = null
      }
      const clone = Object.assign({}, geojson_feature);
      const geom = geojson_feature.geometry
      delete clone.geometry
      var feature = {
          "type": "Feature",
          "properties": clone,
          "geometry": geom
      };
      return add_geojson_layer(feature, layer_id, false) 
    }
    
    const add_analysis = (analysis_name: object, vector_id: string, admin_level: number) => { 
      $q.loading.show({});
      const analysis = TechnicalAnalysisService.get_analysis(analysis_name).then((doc) => {
        remove_analysis(doc.analysis_name); 
        
        TechnicalAnalysisService.get_computation(doc.name, vector_id, admin_level).then((res) => {
          // Check if it is vector or raster
          if(doc.datasource_type == DATASOURCE.VECTOR){
            let legend_items = make_legend(doc);      
            // The style_field is the analysis_name as the computation adds a new property analysi_name
            set_datasource(analysis_name, res.result, null, doc.analysis_name, DATA_TYPE.GEOJSON, analysis_name, legend_items)
            .then(res => {          
              add_legend_v2(doc.analysis_name, legend_items, doc.analysis_name);
              $q.loading.hide();
            })       
          }
          if(doc.datasource_type == DATASOURCE.RASTER){
            // The style_field is the analysis_name as the computation adds a new property analysi_name
            let url = AppUtil.get_full_backend_url(res.result['rasterfile']);
            let layer_name = doc.analysis_name;
            if(ENABLE_TILES){
              url = res.result['tiles']['url'];
              layer_name = res.result['tiles']['layer'];
            }
            set_datasource(
                    analysis_name, 
                    null, 
                    url, 
                    doc.analysis_name, 
                    DATA_TYPE.RASTER, 
                    analysis_name, 
                    legend_items,
                    layer_name)
            .then(res => {          
              add_legend_v2(doc.analysis_name, legend_items, doc.analysis_name);
              $q.loading.hide();
            })
          }
          // if(analysis_doc.datasource_type == DATASOURCE.TABULAR){

          // }   
        });     
        
        /*
        if(doc.datasource_type == DATASOURCE.VECTOR){
            let legend_items = make_legend(doc);      
            // The style_field is the analysis_name as the computation adds a new property analysi_name
            set_datasource(JSON.parse(doc.geom), null, doc.analysis_name, DATA_TYPE.GEOJSON, analysis_name, legend_items)
            .then(res => {          
              add_legend_v2(doc.analysis_name, legend_items, doc.analysis_name);
            })          
          }   
          if(analysis_doc.datasource_type == DATASOURCE.RASTER){
            
          }
          // if(analysis_doc.datasource_type == DATASOURCE.TABULAR){

          // }   
          */
      });  
    }

    const get_selected_feature = () => selected_feature.value;

    const map_query_dialog_ref = ref(null)
    onUnmounted(() => {
      $q.loading.hide();
    })
    return {
      map_id,
      map_options,
      datasource: null,
      get_map_instance: () => map_instance,
      layer_control_instance,
      set_datasource,
      add_tile_layer, 
      add_image_overlay,
      map_query_dialog_ref,
      select_feature,
      reset_all_feature_styles,
      add_legend,
      add_legend_v2,
      add_feature,
      zoom_to_feature,     
      add_analysis,
      do_toggle: function(analysis_name, show) { 
        const selected_admin = map_query_dialog_ref.value.get_selected_admin();        
        ctx.emit('toggle-analysis', analysis_name, selected_admin?.name, selected_admin?.level, show);
      },
      select_admin: (admin) => {
        console.log("New admin is ", admin);
        select_feature(admin.name, admin.level, null).then(()=> {
          console.log("Admin selected");
        });
      },
      update_opacity: function(opacities: object){
        //alert('opacity changing...')
        //ctx.emit('update-opacity')
        if(opacities) {
          for (const [key, value] of Object.entries(opacities)) {
            let mp = get_analysis(key);
            //mp.layer.setOpacity(value);
            if(mp){     
              if(mp.datatype == DATA_TYPE.VECTOR){
                mp?.layer?.setStyle({ opacity: value });
              }
              else if (mp.datatype == DATA_TYPE.RASTER){
                mp?.layer?.setParams({ 'opacity': value });
              }
            }
          }
        }
      },
      analysis_exists,
      remove_analysis
    }
  }
})
</script>

<style>

#map-div {
  height: 75vh;
  width: 100%;
  overflow: hidden;
}

.info { 
  padding: 6px 8px; 
  font: 14px/16px Arial, Helvetica, sans-serif; 
  background: white; 
  background: rgba(255,255,255,0.8); 
  box-shadow: 0 0 15px rgba(0,0,0,0.2); 
  border-radius: 5px;
} 
  
.info h4 { 
  margin: 0 0 5px; 
  color: #777; 
  font-size: medium;
}

.legend { 
  text-align: left; 
  line-height: 18px; 
  color: #555;
} 

.legend i { 
  width: 18px; 
  height: 18px; 
  float: left; 
  margin-right: 8px; 
  opacity: 0.7; 
}

</style>