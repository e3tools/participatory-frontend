<template>
  <div class="q-pa-sm" id="map-div"  style="width:100%; height:500px">
  </div>
</template>
 
<script lang="ts">

import { defineComponent, onMounted, ref } from 'vue'
import { AppUtil } from 'src/utils/app'
import L from 'leaflet' 
import 'leaflet/dist/leaflet.css'  

export default defineComponent({
  name: 'BasicMap',
  props: ['datasourceType', 'styleField', 'center'],
  setup(props) {
    // set center of map
    const center = props.center ? props.center : [-15.385229, 28.343006]
    let map = null
    //let infoDiv = null
    const datasource = ref(null)
    let info = null;
    
    /**
     * Create map
     */
    const createMap = () => {
      const osm = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          }
      )

      const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      });

      map = L.map('map-div', {
          zoomControl: true,
          layersScroll: true,
        center: center,
        zoom: 15,
        zoomAnimation: false,
        fadeAnimation: true,
        layers: [darkMap, osm]
      }).setView([37.8, -96], 4);

      var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // map = L.map('map-div', {
      //   zoomControl: false,
      //   layersScroll: true,
      //   center: center,
      //   zoom: 15,
      //   zoomAnimation: false,
      //   fadeAnimation: true,
      //   layers: [darkMap, osm]
      // })
      
      // L.marker([-15.385229, 28.343006]).addTo(map).bindPopup("Plot 09 Munali Rd, Lusaka 10101, Zambia");

      //map = L.map('map-div').setView([37.8, -96], 4); 
 
      map.on('locationfound', onLocationFound)
      map.on('locationerror', onLocationError)
    }  

    /**
     *  Create info control
     */
    const addInfoControl = () => {
      // control that shows info on hover
      const info = L.control()
      let infoDiv = null

      info.onAdd = (map) => {
        infoDiv = L.DomUtil.create('div', 'info')
        //this.update() 
      }

      info.update = (fProps) => {
        const contents = fProps ? `<b>${fProps.name}</b> <br />${fProps.density} people / mi <sup>2</sup>`: 'Hover over a state'
        infoDiv.innerHTML = `<h4>US Population Density</h4> ${contents}`
      }

      info.addTo(map)
    }

    /**
     * Set datasource
     * @param data 
     */
    const setDatasource = (data) => {
      datasource.value = data
      const loadGeoJson = (data) => { 
        datasource.value = L.geoJson(data, { 
          style: styleFeature,
          onEachFeature
        }).addTo(map)
      }

      if(props.datasourceType == 'geojson'){
        loadGeoJson(datasource.value)
      }   
    }

    /** 
     * Set attribution
     */
    const setAttribution = (props) => {
      let attribution = props.attribution ? props.attribution : 'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>'
      map.attributionControl.addAttribution(attribution)
    }

    /**
     * Hightlight feature
     * @param e 
     */
    const highlightFeature = (e) => {
      const layer = e.target

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      })

      layer.bringToFront()
      info.update(layer.feature.properties)
    }

    /**
     * Reset Highlight
     * @param e
     */
    const resetHighlight = (e) => {
      datasource.value.resetStyle(e.target)
    }

    /**
     * Zoom to feature
     * @param e 
     */
    const zoomToFeature = (e) => {
      map.fitBounds(e.target.getBounds())
    }

    /**
     * Loop utility for each feature
     * @param feature 
     * @param layer 
     */
    const onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      })
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

          labels.push(`<i style="background:{getColor(from  + 1)}"></i> $${from}${to ? `&ndash;${to}` : '+'}`)
        }
        div.innerHTML = labels.join('<br>')
        return div
      }

      legend.addTo(map)
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
    const styleFeature = (feature) => {
        return {
          fillColor: getColor(feature.properties[props.styleField]),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        }
    }
    
    const yourLocation = () => {
      map = L.map('map-div').setView([51.505, -0.09], 10)

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
    }     

    const onLocationFound = (e) => {
      var radius = e.accuracy

      L.marker(e.latlng)
        .addTo(map)
        .bindPopup("You are within " + radius + " meters from this point")
        .openPopup()

      L.circle(e.latlng, radius).addTo(map)
    }

    const onLocationError = (e) => {
      AppUtil.showError('Location error')
    }

    onMounted(() => {
      //yourLocation()
      createMap() 
      addInfoControl()
    })

    return {
      datasource,
      //yourLocation, 
      setDatasource
    }
  }
})
</script>
