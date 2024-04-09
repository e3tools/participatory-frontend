import { View, Text } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Geojson, GeojsonProps } from 'react-native-maps'
import { IGeoJsonProps } from '@/app/modules/mapping/interfaces'
import { APP } from '@/app/utils/app'
import { TechnicalAnalysisService } from '@/app/services/technical_analysis'
import { DATASOURCE } from '../../enums'
import AppLoader from '@/app/components/shared/AppLoader'

/**
 * Layer that renders GeoJSON data
 * @param props 
 * @param ref 
 * @returns 
 */
const GeoJsonLayer = (props/*: IGeoJsonProps*/, ref) => {
    const { properties, analysis_name, admin_id, admin_level, ...rest } = props; 
    const [geojson, set_geojson] = useState(props.geojson);

    const [opacity, set_opacity] = useState(0);
    const [loading, set_loading] = useState(false);

    /** Expose child methods to the parent */
    useImperativeHandle(ref, ()=> {
     change_opacity: (val: number) => set_opacity(val); 
    }, 
    []);

    const get_analysis = () => {
      //const add_analysis = (analysis_name: object, vector_id: string, admin_level: number) => { 
        APP.toggle_loading(true);
        set_loading(true); 
        const analysis = TechnicalAnalysisService.get_analysis(analysis_name).then((doc) => {
          //remove_analysis(doc.analysis_name);  
          TechnicalAnalysisService.get_computation(doc.name, admin_id, admin_level).then((res) => {
            // Check if it is vector or raster
            console.log("RESS: ", res)
            if(doc.datasource_type == DATASOURCE.RASTER){
              // let legend_items = make_legend(doc);    
              set_geojson(res.result);  
            }
            set_loading(false);
          });      
        }); 
    }

    useEffect(()=> {
      set_geojson(props.geojson);
    }, [props.geojson]);

    useEffect(() => {
      if(!geojson){
        //get_analysis();
      }
    }, []);

  return ( 
        geojson ? <Geojson 
                    geojson={geojson}
                    strokeColor="gray"
                    fillColor={`rgba(76, 175, 80, ${opacity})`} //opacity is the last param
                    strokeWidth={5}
                  /> : (loading ? <View></View> : <AppLoader loading_text={'Loading...'}/>) 
        )
}

export default forwardRef(GeoJsonLayer);