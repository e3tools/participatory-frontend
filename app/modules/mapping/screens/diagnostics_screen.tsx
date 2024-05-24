import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import MapView from 'react-native-maps'
import { PROVIDER_GOOGLE } from "react-native-maps"
import AppMap from '../components/map' 
import { IImageOverlayProps, IMarkerProps } from '../interfaces'
import { Button, Card, IconButton } from 'react-native-paper'
import LinkField from '../../../components/form/controls/link'
import AppSelect from '../../../components/form/controls/select'
import { VectorService } from '../../../services/vector'
import { APP } from '../../../utils/app'
import { useNavigation } from 'expo-router'

export default function Diagnostics() {
  const navigation = useNavigation();
  
  
  const [admins, set_admins] = useState([]);
  const [selected_admin, set_selected_admin] = useState(null);
  const map_ref = useRef<AppMap>(null);
  
  //Nyeri
  // const initial_region = {
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // }

  //Isiolo
  const initial_region = { 
    latitude: 0.35462,
    longitude: 37.58218,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  // Kenya bounding box
  const initial_bounds = [33.89, -4.68, 41.86, 5.51]; 

  // Nyeri bounds
  //const initial_bounds = [36.60403823901738, -0.644683701030667, 37.3078117370009, 0.015436301565340857];

  const markers: Array<IMarkerProps> = [
    {
      title: 'First',
      description: 'First Marker',
      location: {
        latitude: -27.2,
        longitude: 145
      },
      draggable: true
    },
    {
      title: 'Second',
      description: 'Second Marker',
      location: {
        latitude: -30.2,
        longitude: 150
      },
      draggable: false
    },
  ];

  const select_admin = (admin) => { 
    // selected_admin.value = admin;
    if(!admin){
      return;
    }
    map_ref?.current?.select_feature(admin.name, admin.level, null).then(()=> { 
    });
  }
  useEffect(() => {
    // const region = {
    //   latitude: 44.5013,
    //   longitude: -88.0622,
    //   latitudeDelta: 0.1,
    //   longitudeDelta: 0.1
    // };

    let region = {
      latitude: -26.8526,
      latitudeDelta: 27.4990,
      longitude: 148.1104,
      longitudeDelta: 15.9521, 
    }

    const geojson = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "coordinates": [
              [
                [
                  145.74815454298198,
                  -28.515687508471423
                ],
                [
                  145.33350465561375,
                  -32.06616241874832
                ],
                [
                  149.40407262757373,
                  -32.02001652514164
                ],
                [
                  152.07265745399468,
                  -28.648668948259136
                ],
                [
                  151.14205415620143,
                  -26.114295095630098
                ],
                [
                  145.74815454298198,
                  -28.515687508471423
                ]
              ]
            ],
            "type": "Polygon",
          }
        }
      ]
    };

    const overlay = {
      image: 'https://maps.gsi.go.jp/xyz/std/17/116423/51613.png',
      opacity: 1,
      bounds: [[35.68184060244454, 139.76531982421875], [35.679609609368576, 139.76806640625]]
    };// as IImageOverlayProps;

    setTimeout(() => {
      map_ref.current.add_markers(markers);
      // map_ref.current.focus_region(region);

      map_ref.current.add_geojson("layer1", geojson); 

      /*
      const coords = [
        {
          longitude: geojson.bbox[0],
          latitude: geojson.bbox[1]
        }, 
        {
          longitude: geojson.bbox[2],
          latitude: geojson.bbox[3], 
        }
      ]
      map_ref.current.fit_bounds(coords);
      */
      //map_ref.current.add_image_ovserlay("image1", overlay);

      const { width, height } = Dimensions.get('window');
      const ASPECT_RATIO = width / height;
      // map_ref.current.focus_region({
      //   latitude: 35.679976,
      //   longitude: 139.768458,
      //   latitudeDelta: 0.01,
      //   longitudeDelta: 0.01 * ASPECT_RATIO,
      // })
    }, 2000);

    setTimeout(() => {
      //map_ref.current.take_snapshot_and_share();
    }, 5000);
    
  }, []);

  useEffect(() => {
    VectorService.get_admin_tree(false).then((res) => { 
      set_admins(res);
    });
  }, []);

  useEffect(() => {
    select_admin(selected_admin);
  }, [selected_admin])

  useLayoutEffect(() => {
    navigation.setOptions({ title: APP._('MAP_PAGE.TITLE') }); 
  }, []);

  return (
    <View>
      {/* <Card>
        <Card.Actions> 
          <View style={{ flex: 1, flexDirection: 'row' }}>
             <View style={{ flex: 1, flexBasis: '80%' }}>
              <AppSelect 
                style={{ flex: 2 }}
                options={admins}
                label_field='admin_name'
                valuefield='name'
                searchable
                placeholder={APP._('MAP_PAGE.SEARCH_REGION')}
                on_change_value={(val) => { 
                    set_selected_admin(val);
                  } 
                }
              />
            </View>
            <View style={{ flex: 1, flexBasis: '25%' }}>
                <IconButton icon="cog-outline" size={20} mode='contained' onPress={() => APP.alert("Clicked")}/>
            </View>
          </View>
         
        </Card.Actions>
      </Card> */}
      <AppMap initial_region={initial_region} initial_bounds={initial_bounds} ref={map_ref} />
    </View>
  )
}

const styles = StyleSheet.create({
  map: {

  }
})