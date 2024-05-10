import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IMarkerProps } from '@/app/modules/mapping/interfaces'
import { Marker } from 'react-native-maps'

/**
 * Render basic marker on a map
 */
export default function MapMarker(props: IMarkerProps) {
    const [location, set_location] = useState(props.location); 
    useEffect(()=> {
        set_location(props.location);
    }, [props.location]);
  return (
    <Marker 
        coordinate={location}
        title={props.title}
        description={props.description}
        // draggable={props.draggable}           
        draggable         
        onDragEnd={(e)=> { 
            console.log("Drag end");
            if(props.draggable){
                console.log("Drag end");
                set_location(e.nativeEvent.coordinate);
            } 
            else {
                void 0 
            }}
        }
        pinColor={props.draggable ? "#0000ff": "#ff0000"}
    />
  )
}