<template>
  <div class="q-pa-sm" :id="map_id">
    <map-query-dialog ref="map_query_dialog"/>
  </div>  
</template>
 
<script lang="ts">

import { defineAsyncComponent, defineComponent, onMounted, ref } from 'vue'
import { AppUtil } from 'src/utils/app'
import L from 'leaflet' 
import 'leaflet/dist/leaflet.css'
import { watchEffect } from 'vue'
import { reactive, watch } from 'vue'  
import { useRoute } from 'vue-router' 
import { ILegendItem } from '../../interfaces'
import { LEGEND_TYPE } from '../../enums'

const GEOJSON = 'geojson'

export default defineComponent({
  name: 'BasicMap',
  props: ['datasource_type', 'style_field', 'center'],
  components: {
    'map-query-dialog': defineAsyncComponent(()=> import('../map/MapQueryDialog.vue'))
  },
  setup (props) {
    const map_id = 'map-div'
    let layer_control_instance = null
    let mapInstance = null
    let map_data = ref([]) 
    
    let datasource = ref({})
    let geojson_layer = null
    let image_overlay = null
    let info_control = null
    let map_query_control = null
    let data_label = 'Dataset'
    const current_layer = ref(null)
    const route = useRoute()
    let analysis_doc = null

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

        mapInstance = map 
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

      info_control.addTo(mapInstance)
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
            map_query_dialog.value.showWindow(true)
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

      //mapInstance.addControl(new map_query_control())
      new map_query_control().addTo(mapInstance)
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
     const set_datasource = async (data=null, url=null, label='Dataset', data_type=GEOJSON) => {
      console.log('set datasource')
      if(data && url){
        throw('Data and URL cannot be supplied at the same time. Provide one or the other')
      }  
      data_label = label
      const fetchGeoJson = async () => { 
         return await fetchData('https://api.npoint.io/fdbc5b08a7e7eccb6052')
      }
      if(data){
        map_data.value.push({ 'datatype': data_type, 'data': data, 'label': label })
      }
      else {
        if(data_type == GEOJSON){
          const d = await fetchGeoJson()
          map_data.value.push({ 'datatype': data_type, 'data': data, 'label': label })
        }   
      }
    }

    const add_geojson_layer = (data: object, label: '', addToControl=true) => {
      let layer = null
      if(data){
        try{
          // add to the map
          layer = L.geoJson(data, {
            on_each_feature: on_each_feature,
            style: style_feature
          }).addTo(mapInstance)

          if(addToControl){
            // Add to the layer control
            layer_control_instance.addOverlay(
              layer,
              label
            )  
          }
          geojson_layer = layer
        } catch (err) {
            console.log(err, err.message)
        }
      }
      return layer
    }
    
    const style_feature = (feature) => {
        return {
          fillColor: /*route.maptype == 'vector' ? */get_color(feature.properties[props.style_field]),// : '',
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

    const getColor2 = (val) => {
      for(let i=0; i < legend_items.length; i++){

      }
    }

     /**
     * Hightlight feature
     * @param e 
     */
     const highlight_feature = (e) => {
      const layer = e.target

      select_feature(layer)
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
        for(var i=0; i < Object.keys(mapInstance._layers).length; i++){
          let el = Object.values(mapInstance._layers)[i] 
          if(el.feature !== undefined && el.feature.properties.shapeID == id){
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
    const select_feature = (id: string, layer: object) => {      
      // if(!layer && id){
      //   for(var i=0; i < Object.keys(mapInstance._layers).length; i++){
      //     let el = Object.values(mapInstance._layers)[i] 
      //     if(el.feature !== undefined && el.feature.properties.shapeID == id){
      //       layer = el 
      //       break
      //     }
      //   } 
      // }  
      const feature = get_feature(id, layer)
      if(!feature){
        //try add the feature first

      }
      if(feature){
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
      mapInstance.fitBounds(e.target.getBounds())
    }

    /**
     * Zoom to feature
     * @param e 
     */
     const zoom_to_feature = (feature: object) => {
      if(feature){
        mapInstance.fitBounds(feature.getBounds())
      }
    }

    /**
     * Loop utility for each feature
     * @param feature 
     * @param layer 
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

      legend.addTo(mapInstance)
    }

    const add_legend_v2 = (items: ILegendItem[], title:string) => {
      debugger;
      legend_items = items
      const legend = L.control({ position: 'bottomright' })

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

      legend.addTo(mapInstance)
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
      current_layer.value = L.tileLayer.wms(url, {
            layers: layer,
            transparent: true,
            format: 'image/png'
        }).addTo(mapInstance)  
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
        mapInstance.removeLayer(image_overlay)
     }
      image_overlay = L.image_overlay(url, latLngBounds, {
          //opacity: 1.0,
          errorOverlayUrl: url, // errorOverlayUrl,
          // alt: altText,
          interactive: true,
          crossOrigin: false
      }).addTo(mapInstance)  
      //L.rectangle(latLngBounds).addTo(mapInstance);
      mapInstance.fitBounds(latLngBounds);
      image_overlay.bringToFront();
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
        map_data.value.forEach((el) => { 
          if(el.datatype == 'geojson'){
            add_geojson_layer(el['data'], el['label'])
          }  
        }) 
      }
    })  

    const add_feature = (geojson_feature: object) => {
      if(geojson_layer){
        //If there is a current layer, remove
        mapInstance.removeLayer(geojson_layer)
        geojson_layer = null
      }
      const clone = Object.assign({}, geojson_feature);
      const geom = geojson_feature.geometry
      delete clone.geometry
      var geojson_feature = {
          "type": "Feature",
          "properties": clone,
          "geometry": geom
      };

      return add_geojson_layer(geojson_feature, '', false) 
    }
 
    const map_query_dialog = ref(null)
    return {
      map_id,
      map_options,
      datasource: null,
      get_map_instance: () => mapInstance,
      layer_control_instance,
      set_datasource,
      add_tile_layer, 
      add_image_overlay,
      map_query_dialog,
      select_feature,
      reset_all_feature_styles,
      add_legend,
      add_legend_v2,
      add_feature,
      zoom_to_feature
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