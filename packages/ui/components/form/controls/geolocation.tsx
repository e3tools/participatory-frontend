import { StyleSheet, Text, View } from 'react-native';
import React, { createRef, Fragment, useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps'; 
import MapMarker from 'gis/components/layers/marker';
import { IGeolocationProps, IMarkerProps } from 'gis/interfaces';
import FieldLabel from 'ui/components/form/controls/field_label';
import { MAPUTIL } from 'gis/utils/map'; 

const GeoLocation = (props: IGeolocationProps) => {
    const [initial_region, set_initial_region] = useState({
        latitude: 0.35462,
        longitude: 37.58218,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [value, set_value] = useState(props.value);
    const [markers, set_markers] = useState(Array<IMarkerProps>());
    const map_ref = createRef<MapView>();
    
    /**
     * Listener for change of region
     * @param region 
     */
    const on_region_change = (region: Region) => { 
    }

    /**
     * Display markers on the map
     * @returns 
     */
    const display_markers = ()=> {
        return markers?.map((item, idx) => {
            return (
                <MapMarker
                    key={idx}
                    {...item} 
                />
            )
        });
    }
    useEffect(() => {
        props?.on_change_value?.(value); 
      }, [value])

    useEffect(()=>{
        const markers = Array<IMarkerProps>();
        set_markers([]);
        let val = props?.value ? JSON.parse(props?.value) : undefined;
        if(val){
            if (val.hasOwnProperty('type') && val['type'] == 'FeatureCollection'){
                val.features?.map((el, idx) => {
                    if(el.type == 'Feature') {
                        if(el.geometry.type == 'Point'){
                            const coordinates = el.geometry.coordinates;
                            const marker: IMarkerProps = {
                                title: '',
                                location: {
                                    longitude: coordinates[0],
                                    latitude: coordinates[1]
                                }
                            }
                            markers.push(marker)
                        }
                    }
                });
            } 
        }
        set_value(val);
        set_markers(markers);
    }, [props.value]);

    useEffect(()=>{
        let val = {
            "type": "FeatureCollection",
            "features": []
        }
        markers?.map((el, idx) => {
            val["features"].push({
                "type": "Feature",
                "properties":{},
                "geometry": {
                    "type": "Point",
                    "coordinates": [el.location.longitude, el.location.latitude]
                }
            })
        });
        set_value(JSON.stringify(val));
    }, [markers]);

  return (
    <Fragment>
        <FieldLabel label={props.label} reqd={props.reqd} hidden={props.hidden} />
        <View style={styles.container}>
            <MapView 
                ref={map_ref}
                initialRegion={initial_region}
                {...props} 
                style={styles.map} 
                // region={this.state.region}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={false}
                showsMyLocationButton={false}
                onRegionChangeComplete={on_region_change}
                zoomEnabled
                zoomControlEnabled
                zoomTapEnabled
                // ref={this.map_ref} 
                onPress={(e) => {  
                    const coords = e.nativeEvent.coordinate;                  
                    // set_value({ selected_point: { 'lat': coords.latitude, 'lon': coords.longitude }});                
                    const marker: IMarkerProps = {
                        //title: '',
                        //description: '',
                        location: {
                        latitude: coords.latitude,
                        longitude: coords.longitude
                        },
                        draggable: true 
                    }
                    const markers = new Array<IMarkerProps>();
                    markers.push(marker);
                    set_markers(markers);
                }}
                onMapLoaded={() => {  
                    map_ref.current.fitToCoordinates(MAPUTIL.bounds_to_coordinates(props.initial_bounds), { animated: true });
                }}
            >
                {
                    display_markers()
                }
            </MapView>
        </View> 
    </Fragment>
  )
}

export default GeoLocation

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      padding: 5
    },
    map: {
        minWidth: 300,
        minHeight: 400,
        //width: 400,
        //height: 500,
        maxWidth: '100%',
        maxHeight: '100%'
    //   width: '100px',
    //   height: '100px',
    },
})