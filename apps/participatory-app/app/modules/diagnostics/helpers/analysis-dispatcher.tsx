import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IAnalysisProps } from '../interfaces';
import WMSTileLayer from 'gis/components/layers/wms-tile-layer';
import GeoJsonLayer from 'gis/components/layers/geojson-layer';
import { APP } from 'common';
import { DATASOURCE } from '../enums';

// import ENABLE_TILES from '@app/modules/mapping/constants';

export default function AnalysisDispatcher(props: IAnalysisProps) {
  const { analysis, adminId, adminLevel, datasourceType } = { props };

  useEffect(() => {
    const retrieve_analysis = () => {
      get_analysis();
    };

    retrieve_analysis();
  }, [adminId, adminLevel, analysis]);

  const get_analysis = () => {
    APP.toggle_loading(true);
  };

  return (
    <View>
      {datasourceType === DATASOURCE.RASTER ? (
        <WMSTileLayer
          analysis_name={analysis}
          admin_id={adminId}
          admin_level={adminLevel}
        />
      ) : datasourceType === DATASOURCE.VECTOR ? (
        <GeoJsonLayer />
      ) : (
        <View>Invalid analysis</View>
      )}
    </View>
  );
}
