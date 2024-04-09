import { View, Text } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { MAP_TYPES, WMSTile } from 'react-native-maps'
import { IWMSTileProps } from '../../interfaces'
import { TechnicalAnalysisService } from '@/app/services/technical_analysis';
import { APP } from '@/app/utils/app';
import { DATASOURCE } from '../../enums';
import { number } from 'yup';

const ENABLE_TILES = true;

/**
 * Layer that renders WMS Tiles. An example are those served by GeoServer.
 * @param props 
 * @param ref 
 * @returns 
 */
const WMSTileLayer = (props: IWMSTileProps, ref) => { 
  // See https://github.com/react-native-maps/react-native-maps/blob/master/docs/tiles.md
  // See https://stackoverflow.com/questions/76219455/is-there-a-way-to-force-single-tile-request-for-wmstile-in-react-native-maps
  
  // Example : http://192.168.101.6:8600/geoserver/participatory/wms?service=WMS&request=GetMap&layers=participatory%3Akenya_land_cover20240325135240583027&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=4070118.882129066,0,4109254.6406110763,39135.75848200963
 
  const { analysis_name, admin_id, admin_level } = props; 

  const options = {
    format: 'image/png',
    srs: 'EPSG:3857',
    // opacity: 0.5,
    tile_size: 512
  };

  const [template, set_template] = useState('');
  const [opacity, set_opacity] = useState(0.5);

  /** Expose child methods to the parent */
  useImperativeHandle(ref, () => ({
    change_opacity: (val: number) => set_opacity(val)
  }), []);
   
  const get_analysis = () => {
    //const add_analysis = (analysis_name: object, vector_id: string, admin_level: number) => { 
      APP.toggle_loading(true);
      const analysis = TechnicalAnalysisService.get_analysis(analysis_name).then((doc) => {
        //remove_analysis(doc.analysis_name); 
        
        TechnicalAnalysisService.get_computation(doc.name, admin_id, admin_level).then((res) => {
          
          // Check if it is vector or raster
          if(doc.datasource_type == DATASOURCE.RASTER){
            // The style_field is the analysis_name as the computation adds a new property analysi_name
            let url = APP.get_full_backend_url(res.result['rasterfile']);
            let layer_name = doc.analysis_name;
            if(ENABLE_TILES){
              url = res.result['tiles']['url'];
              let layer = res.result['tiles']['layer'];

              let srs = options.srs;
              let tmp = `${url}?service=WMS&request=GetMap&layers=${layer}&styles=&format=${options.format}&transparent=true&version=1.1.1&width={width}&height={height}&srs=${srs}&bbox={minX},{minY},{maxX},{maxY}`
              set_template(tmp);
            }

            // set_datasource(
            //         analysis_name, 
            //         null, 
            //         url, 
            //         doc.analysis_name, 
            //         DATA_TYPE.RASTER, 
            //         analysis_name, 
            //         legend_items,
            //         layer_name)
            // .then(res => {          
            //   add_legend_v2(doc.analysis_name, legend_items, doc.analysis_name);
            //   APP.toggle_loading(false);
            // })
          }
          // if(analysis_doc.datasource_type == DATASOURCE.TABULAR){
  
          // }   
        });      
      }); 
  }

  // const srs = "EPSG:3857";
  // const { url, layer, format, src } = options;
  // const template = `${url}?service=WMS&request=GetMap&layers=${layer}&styles=&format=${format}&transparent=true&version=1.1.1&width={width}&height={height}&srs=${srs}&bbox={minX},{minY},{maxX},{maxY}`
  
  // const load_analysis = (analysis_name: object, vector_id: string, admin_level: number) => { 
  //   APP.toggle_loading(true);
  //   const analysis = TechnicalAnalysisService.get_analysis(analysis_name).then((doc) => {
  //     //remove_analysis(doc.analysis_name); 
      
  //     TechnicalAnalysisService.get_computation(doc.name, vector_id, admin_level).then((res) => {
  //       // Check if it is vector or raster
  //       if(doc.datasource_type == DATASOURCE.RASTER){
  //         // The style_field is the analysis_name as the computation adds a new property analysi_name
  //         let url = APP.get_full_backend_url(res.result['rasterfile']);
  //         let layer_name = doc.analysis_name;
  //         if(ENABLE_TILES){
  //           url = res.result['tiles']['url'];
  //           layer_name = res.result['tiles']['layer'];
  //         }
  //         // set_datasource(
  //         //         analysis_name, 
  //         //         null, 
  //         //         url, 
  //         //         doc.analysis_name, 
  //         //         DATA_TYPE.RASTER, 
  //         //         analysis_name, 
  //         //         legend_items,
  //         //         layer_name)
  //         // .then(res => {          
  //         //   add_legend_v2(doc.analysis_name, legend_items, doc.analysis_name);
  //         //   APP.toggle_loading(false);
  //         // })
  //       }
  //       // if(analysis_doc.datasource_type == DATASOURCE.TABULAR){

  //       // }   
  //     });      
  //   });  
  // }

  // const add_legend_v2 = (analysis_name: string, items: ILegendItem[], title:string) => { 
  //   legend_items = items
  //   const legend = L.control({ position: 'bottomright' });
  //   map_data.value.forEach(el => {
  //     if(el.label == analysis_name) {
  //       el['legend_items'] = items;
  //       el['legend'] = legend;
  //     }
  //   });     

  //   const labels = [`<strong>${title}</strong>`]
  //   legend.onAdd = (map) => {

  //     const div = L.DomUtil.create('div', 'info legend')
  //     const grades = [0, 10, 20, 50, 100, 200, 500, 1000]
  //     //const labels = []
  //     let from, to

  //     items.forEach(el => {
  //       let from = el.lower_val;
  //       let to = el.upper_val;
  //       let color = el.color;
  //       switch(el.item_type) {
  //         case LEGEND_TYPE.TEXT:
  //           labels.push(`<i style="background:${color}"></i> ${from}${to ? `&ndash;${to}` : '+'}`) 
  //           break
  //         case LEGEND_TYPE.NUMERIC:
  //           labels.push(`<i style="background:${color}"></i> ${from}${to ? `&ndash;${to}` : '+'}`) 
  //           break
  //         case LEGEND_TYPE.DATE:
  //           labels.push(`<i style="background:${color}"></i> ${from}${to ? `&ndash;${to}` : '+'}`)   
  //         break
  //         default:
  //           break  
  //       }
  //       // if(el.item_type == LEGEND_TYPE.TEXT){
  //       // }
  //     })
  //     // for(let i =0; i < grades.length; i++){
  //     //   from = grades[i]
  //     //   to = grades[i+1]

  //     //   labels.push(`<i style="background:${get_color(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`) 
  //     // }
  //     div.innerHTML = labels.join('<br>')
  //     return div
  //   }
  //   legend.addTo(map_instance)
  // }

  useEffect(() => {
    get_analysis();
  }, [])

  useEffect(() => {
  }, [template])

  return (                                                                                                                                                                               
    (template) && <WMSTile
        // urlTemplate2={'http://192.168.101.6:8600/geoserver/participatory/wms?service=WMS&request=GetMap&layers=participatory:kenya_land_cover20240325152729116563&styles=&format=image/png&transparent=true&version=1.1.1&width={width}&height={height}&srs=EPSG:3857&bbox={minX},{minY},{maxX},{maxY}'}
        urlTemplate={template}
        zIndex={1}
        opacity={opacity}
        tileSize={options.tile_size}
        shouldReplaceMapContent={true}
    />
  )
} 
export default forwardRef(WMSTileLayer);