import { View, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { make_request } from '@/app/utils/api';
import { extract_interventions } from '../helpers/interventions_parser';
import Carousel from 'react-native-reanimated-carousel';
import AppLoader from '@/app/components/shared/AppLoader';
import { Dialog, FAB, PaperProvider, Portal, Text } from 'react-native-paper';
import { APP } from '@/app/utils/app';
import { AppIconButton } from '@/app/components/shared/AppIconButton'; 

const ACACIA_BASE_URL = 'https://whe.acaciadata.com'
const ACACIA_QUERY_URL = `${ACACIA_BASE_URL}/query/?lon=38.935546875&lat=2.8113711933311403`;

const query_interventions = async (lat: number, lon: number) => {
    const url = `${ACACIA_QUERY_URL}/?lon=${lon}&lat=${lat}`;
    const res = await make_request(url, 'GET');
    const interventions = extract_interventions(res?.data); 
    return interventions;
}

type Point = {
    lon?: number,
    lat?: number
}

type AcaciaWaterType = {
    point?: Point
}

type Intervention = {
    category: string,
    interventions: []
}

const InterventionType = (props) => {
    return (
        <Carousel
            loop={false}
            width={props.width}
            height={props.height}
            data={props.interventions}
            renderItem={({ item, index }) => (
                <View key={index} 
                    style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
                >
                    <Image source={{
                           uri: `${ACACIA_BASE_URL}${item.src}`, 
                           cache: 'default'
                        }} 
                        alt={item.alt}
                        key={item.src} 
                        style={styles.image}
                    />
                </View>
            )}
        />
    )
}

const InterventionItem = (props) => { 
    const [visible, set_visible] = useState(false); 
    return (
        <View style={styles.carousel_item}>
           <InterventionType 
                interventions={props.item?.interventions}
                // style={styles.intervention_type_container}
                height={150}
                width={150}
            />
           <Text style={styles.category_label}>{ props.item.category }</Text>
           {/* <FAB
                icon="dots-horizontal-circle-outline"
                style={styles.fab}
                size='small'
                onPress={() => set_visible(true)}
            /> */}
            <AppIconButton icon='dots-horizontal-circle-outline' on_press={() => set_visible(true)} style={styles.fab} />
            <Portal>
                <Dialog style={styles.dialog_container} visible={visible} onDismiss={() => set_visible(false)}>
                    <Dialog.Title style={styles.dialog_title}>{props.item?.category}</Dialog.Title>
                    <Dialog.Content> 
                        <InterventionType interventions={props.item?.interventions} height={300} width={300} /> 
                    </Dialog.Content>
                </Dialog>
            </Portal> 
        </View>
    )
}

const AcaciaWater = (props: AcaciaWaterType) => {   
    const [interventions, set_interventions] = useState([]);
    const [is_loading, set_is_loading] = useState(true);

    useEffect(()=> { 
        if(props.point?.lat && props.point?.lon){ 
            set_is_loading(true); 
            query_interventions(props.point?.lat, props.point?.lon).then(res=> { 
                if(res){ 
                    set_interventions(res);
                    set_is_loading(false);
                }
            })
        }
    }, [props]);

  return (
        is_loading ? <View style={styles.loader}><AppLoader /></View> : (
        <ScrollView 
            contentContainerStyle={styles.interventions_container} 
        >     
            { 
                interventions.map((el, idx) => 
                    <InterventionItem 
                        key={`${el.category}${idx}`} 
                        item={el}  
                    /> 
                )
            }
        </ScrollView>
        ) 
  )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    loader: {
        display: 'flex', 
        height: 200
    },
    // intervention: {
    //     width: 300,
    //     margin: 20,
    //     backgroundColor: 'red'
    // },
    dialog_container: {
        height: 400
    },
    carousel_parent: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start', 
        flexGrow: 1, 
        height: 200,
        width: 300,
        overflow: 'visible'
    }, 
    // carousel_parent: {
    //     display: 'flex', 
    //     alignContent: 'flex-start',
    //     // flexDirection: 'row',
    //     //flexWrap: 'nowrap',
    //     // justifyContent: 'flex-start',
    //     // alignItems: 'flex-start',
    //     // alignContent: 'flex-start', 
    //     flexGrow: 1,
    //     // backgroundColor: 'red',
    //     height: 200,
    //     width: 400,
    //     overflow: 'visible'
    // },
    carousel_item: {
        borderColor: '#eee', 
        borderWidth: 3,
        width: 180,
        height: 180, 
        margin: 5,  
    },
    image: {
        height: '100%',
        width: '100%',
        padding: 10,
        borderRadius: 5
    },
    fab: {
        position: 'absolute', 
        right: 0,
        bottom: 120,
    },
    dialog_title: {
        fontSize: 16
    },
    category_label: {
        textAlign: 'center',
        fontStyle: 'italic'
    },
    interventions_container: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})

export default AcaciaWater