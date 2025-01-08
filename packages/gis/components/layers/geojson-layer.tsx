import { View, Text } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Geojson, GeojsonProps } from 'react-native-maps'
import AppLoader from 'ui/components/shared/app-loader'
import { APP } from 'common/utils/app'

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

    useEffect(()=> {
      set_geojson(props.geojson);
    }, [props.geojson]);

    useEffect(() => {
      if(!geojson){
        //get_analysis();
      }
    }, []);

  return geojson ? (
    <Geojson
      geojson={geojson}
      strokeColor="gray"
      fillColor={`rgba(76, 175, 80, ${opacity})`} //opacity is the last param
      strokeWidth={5}
    />
  ) : loading ? (
    <View></View>
  ) : (
    <AppLoader loadingText={APP._("GLOBAL.LOADING")} />
  );
}

export default forwardRef(GeoJsonLayer);