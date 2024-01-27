<template>
  <div class="q-pa-sm" :id="mapId">
    <map-query-dialog ref="mapQueryDialog"/>
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

const GEOJSON = 'geojson'

export default defineComponent({
  name: 'BasicMap',
  props: ['datasourceType', 'styleField', 'center'],
  components: {
    'map-query-dialog': defineAsyncComponent(()=> import('../map/MapQueryDialog.vue'))
  },
  setup (props) {
    const mapId = 'map-div'
    let layerControlInstance = null
    let mapInstance = null
    let mapData = ref([]) 
    
    let datasource = ref({})
    let geoJsonLayer = null
    let imageOverlay = null
    let infoControl = null
    let mapQueryControl = null
    let dataLabel = 'Dataset'
    const currentLayer = ref(null)
    const route = useRoute()

    const mapOptions = {
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

    const initMap = () => {
     

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
      mapOptions['layers'] = [osm/*, osmHOT, darkMap*/]
       // create the map
       const map = L.map(mapId, mapOptions)

      // create layerControlInstance
      layerControlInstance = L.control
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
            currentLayer.value.bringToFront();
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
      infoControl = L.control()
      let infoDiv = null

      infoControl.onAdd = (map) => {
        infoDiv = L.DomUtil.create('div', 'info')
        infoDiv.innerHtml = '<span>TT</span>' 
        //this.update() 
        return infoDiv
      }

      infoControl.update = (fProps) => {
        let contents = ''
        if(fProps.density !== undefined){
          contents = fProps ? `<b>${fProps.name}</b> <br />${fProps.density} people / mi <sup>2</sup>`: 'Hover over a state'
        } else {
          contents = fProps ? `<b>${fProps.shapeName}</b>`: 'Hover over an area'
        }
        infoDiv.innerHTML = `<h4>Details</h4> ${contents}`
      }

      infoControl.addTo(mapInstance)
    } 

    const addMapQueryControl = () => {
      let button = null
      mapQueryControl = L.Control.extend({
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
            mapQueryDialog.value.showWindow(true)
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

      //mapInstance.addControl(new mapQueryControl())
      new mapQueryControl().addTo(mapInstance)
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
     const setDatasource = async (data=null, url=null, label='Dataset', dataType=GEOJSON) => {
      console.log('set datasource')
      if(data && url){
        throw('Data and URL cannot be supplied at the same time. Provide one or the other')
      }  
      dataLabel = label
      const fetchGeoJson = async () => { 
         return await fetchData('https://api.npoint.io/fdbc5b08a7e7eccb6052')
      }
      if(data){
        mapData.value.push({ 'datatype': dataType, 'data': data, 'label': label })
      }
      else {
        if(dataType == GEOJSON){
          const d = await fetchGeoJson()
          mapData.value.push({ 'datatype': dataType, 'data': data, 'label': label })
        }   
      }
    }

    const addGeoJSONLayer = (data: object, label: '', addToControl=true) => {
      let layer = null
      if(data){
        try{
          // add to the map
          layer = L.geoJson(data, {
            onEachFeature: onEachFeature,
            style: styleFeature
          }).addTo(mapInstance)

          if(addToControl){
            // Add to the layer control
            layerControlInstance.addOverlay(
              layer,
              label
            )  
          }
          geoJsonLayer = layer
        } catch (err) {
            console.log(err, err.message)
        }
      }
      return layer
    }
    
    const styleFeature = (feature) => {
        return {
          fillColor: /*route.maptype == 'vector' ? */getColor(feature.properties[props.styleField]),// : '',
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.9,// 0.7
        }
    }

    const getColor = (val) => { 
      return val > 1000 ? '#800026' :
           val > 500  ? '#BD0026' :
           val > 200  ? '#E31A1C' :
           val > 100  ? '#FC4E2A' :
           val > 50   ? '#FD8D3C' :
           val > 20   ? '#FEB24C' :
           val > 10   ? '#FED976' :
                        '#FFEDA0';
    }

     /**
     * Hightlight feature
     * @param e 
     */
     const highlightFeature = (e) => {
      const layer = e.target

      selectFeature(layer)
      // layer.setStyle({
      //   weight: 5,
      //   color: '#666',
      //   dashArray: '',
      //   fillOpacity: 0.7
      // })

      // layer.bringToFront()
      // infoControl.update(layer.feature.properties)
    }
    
    /**
     * Get feature
     */
    const getFeature = (id: string, feature: object) => {      
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
    const selectFeature = (id: string, layer: object) => {      
      // if(!layer && id){
      //   for(var i=0; i < Object.keys(mapInstance._layers).length; i++){
      //     let el = Object.values(mapInstance._layers)[i] 
      //     if(el.feature !== undefined && el.feature.properties.shapeID == id){
      //       layer = el 
      //       break
      //     }
      //   } 
      // }  
      const feature = getFeature(id, layer)
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
          infoControl.update(feature?.feature?.properties)
        }
      }
      return feature
    }
    /**
     * Reset Highlight
     * @param e
     */
    const resetHighlight = (e) => {
      geoJsonLayer.resetStyle(e.target)
    }

    /**
     * Reset all styles for the current layer
     * @param id 
     * @param layer 
     */
    const resetAllFeatureStyles = () => {
      if(geoJsonLayer){ 
        geoJsonLayer.resetStyle()
      }  
    }

    /**
     * Zoom to feature
     * @param e 
     */
    const _zoomFeature = (e) => {
      mapInstance.fitBounds(e.target.getBounds())
    }

    /**
     * Zoom to feature
     * @param e 
     */
     const zoomToFeature = (feature: object) => {
      if(feature){
        mapInstance.fitBounds(feature.getBounds())
      }
    }

    /**
     * Loop utility for each feature
     * @param feature 
     * @param layer 
     */
    const onEachFeature = (feature, layer) => { 
      if(layer) {
        if(feature.properties /*&& feature.properties.name*/) {
          layer.on({
            mouseover: highlightFeature,
            //mouseout: resetHighlight,
            click: _zoomFeature
          })
        }
      } else {
        console.log('Invalid layer: ', feature)
      }
    }

    const addLegend = () => {
      const legend = L.control({ position: 'bottomright' })

      legend.onAdd = (map) => {

        const div = L.DomUtil.create('div', 'info legend')
        const grades = [0, 10, 20, 50, 100, 200, 500, 1000]
        const labels = []
        let from, to

        for(let i =0; i < grades.length; i++){
          from = grades[i]
          to = grades[i+1]

          labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`) 
        }
        div.innerHTML = labels.join('<br>')
        return div
      }

      legend.addTo(mapInstance)
    }

    const addTileLayer = (url: '', layer: '') => {
      //see http://thredds.northwestknowledge.net:8080/thredds/wms/TERRACLIMATE_ALL/data/TerraClimate_ws_2022.nc?service=WMS&version=1.3.0&request=GetCapabilities
      
      // url = 'http://ows.mundialis.de/services/service?'
      // layer = 'SRTM30-Colored-Hillshade'
      // url = 'http://41.227.30.141:8600/geoserver/ldms/wms?'
      // layer = 'ldms:lulc20231230163929437000'
      //url = 'http://kmddl.meteo.go.ke:8081/SOURCES/.KMD/.Kenya_v03r05/.ALL/.Rainfall/.daily/.precip/%28TotRain%29%28seasonalStat%29cvn/parameter/%28PerDA%29eq/%7Bdataflag%7Dif/%281%29%28DayStart%29cvn/parameter/%28%20%29append/%28Jul%29%28seasonStart%29cvn/parameter/append/%28%20-%20%29append/%2830%29%28DayEnd%29cvn/parameter/append/%28%20%29append/%28Sep%29%28seasonEnd%29cvn/parameter/append/5/%28spellThreshold%29cvn/parameter/1/%28wetThreshold%29cvn/parameter/0.0/%28seasonalStat%29cvn/get_parameter/%28TotRain%29eq/%7Bnip/nip/flexseastotAvgFill//units//mm/def/40.0//probExcThresh1/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWD%29eq/%7B3/-1/roll/pop/flexseasonalfreqGT/30.0//probExcThresh2/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDD%29eq/%7B3/-1/roll/pop/flexseasonalfreqLT/30.0//probExcThresh3/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28RainInt%29eq/%7B3/-1/roll/pop/flexseasonalmeandailyvalueGT//units/%28mm/day%29def/10.0//probExcThresh4/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDS%29eq/%7BflexseasonalnonoverlapDSfreq//units//spells/def/3.0//probExcThresh5/parameter%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWS%29eq/%7BflexseasonalnonoverlapWSfreq//units//spells/def/3.0//probExcThresh6/parameter%7Dif/%28PoE%29%28yearlyStat%29cvn/parameter/%28CoV%29eq/%7Bpop/dup%5BT%5Drmsaover/exch%5BT%5Daverage/div//percent/unitconvert/%28%20%29exch%7Dif/startcolormap/DATA/0/100/RANGE/transparent/black/navy/0/VALUE/navy/navy/2/bandmax/blue/blue/6/bandmax/DeepSkyBlue/DeepSkyBlue/12/bandmax/aquamarine/aquamarine/20/bandmax/PaleGreen/PaleGreen/25/bandmax/moccasin/moccasin/30/bandmax/yellow/yellow/40/bandmax/DarkOrange/DarkOrange/50/bandmax/red/red/60/bandmax/DarkRed/DarkRed/80/bandmax/brown/brown/100/bandmax/brown/endcolormap/%28yearlyStat%29cvn/get_parameter/%28CoV%29eq/%7BDATA/0/50/RANGE%7Dif/%28yearlyStat%29cvn/get_parameter/%28Var%29eq/%7Bpop/units/exch//units/undef%5BT%5Dstddev/Infinity/maskge/dup/mul/DATA/0/AUTO/RANGE/exch//units/exch/cvntos/%282%29append/cvn/def/%28%20%29exch%7Dif/%28yearlyStat%29cvn/get_parameter/dup/%28PoE%29eq/exch/%28PonE%29eq/or/%7B//probExcThresh/parameter/exch/units/3/-2/roll/exch/flaggt%5BT%5Daverage//yearlyStat/get_parameter/%28PoE%29ne/%7B-1/mul/1/add%7Dif//percent/unitconvert/correlationcolorscale/DATA/0/100/RANGE/exch/cvntos/%28%20%29exch//probExcThresh/get_parameter/s==/exch/%28%20%29exch/%28%20%295/array/astore/concat/exch%7Dif/exch/%28yearlyStat%29cvn/get_parameter/exch/%28in%20%29lpar/%28seasonStart%29cvn/get_parameter/%28%20%29%28DayStart%29cvn/get_parameter/%28%20-%20%29%28seasonEnd%29cvn/get_parameter/%28%20%29%28DayEnd%29cvn/get_parameter/rpar/12/array/astore/concat/%28long_name%29cvn/exch/def/%28name%29cvn/%28proba%29cvn/def/a-/-a/SOURCES/.WORLDBATH/.bath/X/32/43/RANGE/Y/-6/6/RANGE/1/index/SOURCES/.Features/.Political/.Kenya/a:/.Wards/.the_geom/:a:/.SubCounties/.the_geom/:a:/.Counties/.the_geom/:a/X/Y/fig-/colors/colors/||/colors/grey/verythin/stroke/stroke/black/thinnish/stroke/-fig/%28antialias%29cvn/true/psdef/%28framelabel%29cvn/%28seasonalStat%29cvn/get_parameter/%28TotRain%29eq/%7B%28Total%20Rainfall%29%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWD%29eq/%7B%28Number%20of%20Wet%20Days%20-%20days%20above%20%29//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDD%29eq/%7B%28Number%20of%20Dry%20Days%20-%20days%20below%20%29//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28RainInt%29eq/%7B%28Rainfall%20Intensity%20-%20average%20daily%20rainfall%20for%20days%20above%20%29//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumDS%29eq/%7B%28Number%20of%20Dry%20Spells%20-%20%29//spellThreshold/get_parameter/s==/append/%28%20or%20more%20continuous%20days%20below%20%29append//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/%28seasonalStat%29cvn/get_parameter/%28NumWS%29eq/%7B%28Number%20of%20Wet%20Spells%20-%20%29//spellThreshold/get_parameter/s==/append/%28%20or%20more%20continuous%20days%20above%20%29append//wetThreshold/get_parameter/s==/append/%28%20mm%29append%7Dif/psdef/%28layers%29cvn%5B%28proba%29cvn/%28SubCounties%29cvn/%28Counties%29cvn%5Dpsdef/wms.xml?plotaxislength=840'
      //url = 'http://thredds.northwestknowledge.net:8080/thredds/wms/TERRACLIMATE_ALL/data/TerraClimate_ws_2022.nc?REQUEST=GetLegendGraphic&LAYER=ws&PALETTE=invblues_11'
      //layer = 'ws'
      currentLayer.value = L.tileLayer.wms(url, {
            layers: layer,
            transparent: true,
            format: 'image/png'
        }).addTo(mapInstance)  
    }

    const addImageOverlay = (url: '', layer: '', bounds: object) => {
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
     if(imageOverlay){
        mapInstance.removeLayer(imageOverlay)
     }
      imageOverlay = L.imageOverlay(url, latLngBounds, {
          //opacity: 1.0,
          errorOverlayUrl: url, // errorOverlayUrl,
          // alt: altText,
          interactive: true,
          crossOrigin: false
      }).addTo(mapInstance)  
      //L.rectangle(latLngBounds).addTo(mapInstance);
      mapInstance.fitBounds(latLngBounds);
      imageOverlay.bringToFront();
    }

    onMounted(() => {
      initMap()
      addInfoControl()
      addMapQueryControl() 
      //addLegend()
    })

    // watchEffect(() => {
    //   // watch mapData for changes
    //   if (Object.keys(mapData).length !== 0) {
    //     // Add to the map
    //     if(props.datasourceType == 'geojson'){
    //       addGeoJSONLayer(mapData)
    //     }  
    //   }
    // })

    // watch(() => mapData.value, () => {
    //   // watch mapData for changes 
    //   //if (Object.keys(mapData.value).length !== 0) {
    //   if (mapData.value.length !== 0) {
    //     // Add to the map
    //     if(props.datasourceType == 'geojson'){
    //       addGeoJSONLayer(mapData.value['data'], dataLabel)
    //     }  
    //   }
    // })

    watch(() => [...mapData.value], (currVal, oldVal) => {
      //See https://www.netlify.com/blog/2021/01/29/deep-dive-into-the-vue-composition-apis-watch-method/#:~:text=Introduction%20to%20the%20Watch%20API,log(currentValue)%3B%20console.
      // watch mapData for changes 
      //if (Object.keys(mapData.value).length !== 0) {
      if (currVal.length !== 0) {
        // Add to the map 
        mapData.value.forEach((el) => { 
          if(el.datatype == 'geojson'){
            addGeoJSONLayer(el['data'], el['label'])
          }  
        }) 
      }
    })  

    const addFeature = (geoJsonFeature: object) => {
      if(geoJsonLayer){
        //If there is a current layer, remove
        mapInstance.removeLayer(geoJsonLayer)
        geoJsonLayer = null
      }
      const clone = Object.assign({}, geoJsonFeature);
      const geom = geoJsonFeature.geometry
      delete clone.geometry
      var geojsonFeature = {
          "type": "Feature",
          "properties": clone,
          "geometry": geom
      };

      return addGeoJSONLayer(geojsonFeature, '', false) 
    }
 
    const mapQueryDialog = ref(null)
    return {
      mapId,
      mapOptions,
      datasource: null,
      getMapInstance: () => mapInstance,
      layerControlInstance,
      setDatasource,
      addTileLayer, 
      addImageOverlay,
      mapQueryDialog,
      selectFeature,
      resetAllFeatureStyles,
      addLegend,
      addFeature,
      zoomToFeature
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