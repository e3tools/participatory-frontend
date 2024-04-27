import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IAnalysisProps } from '../interfaces'
import WMSTileLayer from '../components/layers/WMSTileLayer'
import GeoJsonLayer from '../components/layers/GeoJsonLayer'
import { APP } from '@/app/utils/app'
import { TechnicalAnalysisService } from '@/app/services/technical_analysis' 
import { DATASOURCE } from '../enums'

// import ENABLE_TILES from '@app/modules/mapping/constants';

export default function AnalysisDispatcher(props: IAnalysisProps) {
  const { analysis, admin_id, admin_level, datasource_type } = { props };
  const [computation, set_computation] = useState(null);

  useEffect(() => {
    
    const retrieve_analysis = () => {
      get_analysis(analysis, admin_id, admin_level);
    }
    
    retrieve_analysis();
  }, [])

  const get_analysis = (analysis_name: object, vector_id: string, admin_level: number) => { 
    APP.toggle_loading(true);
    const analysis = TechnicalAnalysisService.get_analysis(analysis_name).then((doc) => {
      remove_analysis(doc.analysis_name); 
      
      TechnicalAnalysisService.get_computation(doc.name, vector_id, admin_level).then((res) => { 
        // Check if it is vector or raster
        if(doc.datasource_type == DATASOURCE.VECTOR){
          set_computation(DATASOURCE.VECTOR);

          let legend_items = make_legend(doc);      
          // The style_field is the analysis_name as the computation adds a new property analysi_name
          set_datasource(analysis_name, res.result, null, doc.analysis_name, DATA_TYPE.GEOJSON, analysis_name, legend_items)
          .then(res => {          
            add_legend_v2(doc.analysis_name, legend_items, doc.analysis_name);
            APP.toggle_loading(false);
          })       
        }
        if(doc.datasource_type == DATASOURCE.RASTER){
          // The style_field is the analysis_name as the computation adds a new property analysi_name
          let url = APP.get_full_backend_url(res.result['rasterfile']);
          let layer_name = doc.analysis_name;
          if('ENABLE_TILES' == 1){
            url = res.result['tiles']['url'];
            layer_name = res.result['tiles']['layer'];
            set_computation(DATASOURCE.RASTER);
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
            APP.toggle_loading(true);
          })
        }
        if(analysis_doc.datasource_type == DATASOURCE.TABULAR){

        }   
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


  return (
    <View>
      {
        datasource_type == DATASOURCE.RASTER ? <WMSTileLayer /> : (
        datasource_type == DATASOURCE.VECTOR ? <GeoJsonLayer /> : (
          <View>Invalid analysis</View>
        ))
      }
    </View>
  )
}