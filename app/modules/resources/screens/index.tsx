import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DocTypeService } from '@/app/services/doctype';
import { Card, Searchbar, Text } from 'react-native-paper'; 
import { APP } from '@/app/utils/app';
import { IDBReadParam } from '@/app/interfaces/database';
import { AppButton } from '@/app/components/shared/AppButton';
import { useNavigation } from 'expo-router';

const ResourcesDefault = () => {
    const navigation = useNavigation();  
    const [data, set_data] = useState();
    const [matching, set_matching] = useState();
    const [search_query, set_search_query] = useState(undefined);

    const db = new DocTypeService('Help Resource');

    const get_caption = (text: string) => { 
       return APP.clip_text(text, 100);
    }
    const get_image_url = (url: string) => { 
       return APP.make_backend_url(url);
    }

    useEffect(() => {
        navigation.setOptions({ title: APP._('HELP_RESOURCE_LIST_PAGE.TITLE') });
    }, []);

    useEffect(() => {
        const load = async() => {
            let cfg = {} as IDBReadParam
            cfg.fields = ["*"]
            cfg.filters = [["is_published", "=", "1"]]
            db.get_list(cfg).then((res) => { 
              set_data(res);
              set_search_query("")
            })
        }
        load();
    }, []);

    useEffect(() => {
        let matching = [];
        if(search_query === '') {
            matching = data;
        }
        matching = data?.filter((el) => el?.title?.toLocaleLowerCase().indexOf(search_query?.toLocaleLowerCase()) > -1);
        set_matching(matching);
    }, [search_query]);
  return (
    <View>
        <Searchbar
            placeholder={APP._('GLOBAL.SEARCH_PLACEHOLDER')}
            onChangeText={set_search_query}
            value={search_query}
        />
      {
        matching?.map((el, idx) => {
            return (
                <Card key={idx} style={styles.card}>
                    {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }}></Card.Cover> */}
                    <Card.Cover source={{ uri: get_image_url(el.image)}}></Card.Cover>
                    <Card.Content>
                        <View>
                            <Text style={styles.card_title}>{el.title}</Text> 
                        </View>
                        <View>
                            <Text style={styles.card_content}>{get_caption(el.caption)}</Text>  
                        </View>
                        <View style={{ marginTop: 5, display: 'flex', flexDirection: 'row', alignContent:'flex-end' }}>
                            {/* <Text>{el.published_on}</Text> */}
                            <AppButton style={{ flex: 1 }} mode='outlined' label={APP._('BUTTON.SEE_DETAILS')} on_press={()=> {
                                APP.navigate_to_path(navigation, '/screens/resources/detail', {
                                    docname: el.name
                                });
                                // APP.route_to_path('/screens/resources/detail', {
                                //     docname: el.name
                                // })
                            }} />
                        </View>
                    </Card.Content>
                </Card>
              )
            }
        )
      }
    </View>
  )
}

export default ResourcesDefault

const styles = StyleSheet.create({
    card: {
        margin: 5,
        borderColor: 'gray',
        borderWidth: 2
    },
    card_title: {
        fontWeight: 'bold'
    },
    card_content: {
        
    }
})