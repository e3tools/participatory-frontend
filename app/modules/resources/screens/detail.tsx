import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppContainer from '@/app/components/base/AppContainer'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { DocTypeService } from '@/app/services/doctype'
import { APP } from '@/app/utils/app'
import { Card } from 'react-native-paper'
import HyperLink from '@/app/components/shared/HyperLink'
import { FileUtil } from '@/app/utils/file'
import ViewerWeb from '@/app/components/shared/ViewerWeb'

const ResourceDetail = (docname: string) => {
    const params = useLocalSearchParams();
    const [doc, set_doc] = useState(undefined);
    const [downloading, set_downloading] = useState(false);
    const [download_url, set_download_url] = useState('');
    const navigation = useNavigation();
    

    const make_url = (url) => {
        return APP.make_backend_url(url);
    }

    const get_caption = (str: string) => {
        return APP.clip_text(str, 30);
    }

    const download_or_view_file = (url: string) => {
        console.log("viewing or downloading")
        // new ViewerWeb('https://github.com/vinzscam/react-native-file-viewer/raw/master/docs/react-native-file-viewer-certificate.pdf');
        return <View style={{ display: 'none' }}><ViewerWeb url={url} /></View>
    }

    useEffect(() => {
        navigation.setOptions({ title: APP._('HELP_RESOURCE_DETAIL_PAGE.TITLE') });
    }, []);

    useEffect(() => {
        new DocTypeService('Help Resource').get_doc(params.docname).then((rec) => { 
            set_doc(rec)
          })
    }, [])
  return (
    <AppContainer>
        <Card>
            <Card.Cover style={styles.image} source={{ uri: make_url(doc?.image)}}></Card.Cover>
            <Card.Content>
                <View style={styles.header_container}>
                    <Text style={styles.header}>By {doc?.author}</Text> 
                </View>
                <View style={styles.header_container}> 
                    <Text style={styles.title}>By {doc?.title}</Text>
                </View>
                <View style={styles.content}> 
                    <Text style={styles.content}>By {doc?.content}</Text>
                </View>
                <View>
                    <View style={styles.footer_container}>
                        <Text style={styles.footer_label}>{APP._('HELP_RESOURCE_DETAIL_PAGE.ATTACHED_FILE')}: </Text>
                        <HyperLink style={[styles.footer_value, {marginBottom: -5}]} href={make_url(doc?.upload_file)} label={get_caption(doc?.upload_file)} on_press={() => {
                            //APP.route_to_path("/screens/fileviewer", { url: make_url(doc?.upload_file) });
                            // FileUtil.download_and_open_file(make_url(doc?.upload_file));
                            // FileUtil.download_file(make_url(doc?.upload_file));
                            // download_or_view_file(make_url(doc?.upload_file)) 

                            // @TODO. Check why download is not working for files hosted locally. Only works for remote files
                            // Also only pdf files are downloading and not others. Could this be because of Webview component?
                            set_download_url(make_url(doc?.upload_file))//'https://file-examples.com/wp-content/storage/2017/02/file_example_XLS_10.xls');//make_url(doc?.upload_file));//'https://web.pdx.edu/~nauna/week7b-neuralnetwork.pdf')
                            set_downloading(true);
                            setTimeout(()=>{
                                //reset downloading after 5 seconds
                                set_downloading(false);
                              }, 5000);
                        }} />
                    </View>
                    <View style={styles.footer_container}>
                        <Text style={styles.footer_label}>{APP._('HELP_RESOURCE_DETAIL_PAGE.RELEVANT_COUNTY')}: </Text>
                        <Text style={styles.footer_value}>{doc?.county}</Text>
                    </View>
                    <View style={styles.footer_container}>
                        <Text style={styles.footer_label}>{APP._('HELP_RESOURCE_DETAIL_PAGE.RELEVANT_SECTOR')}: </Text>
                        <Text style={styles.footer_value}>{get_caption(doc?.sector)}</Text>
                    </View>
                    <View style={styles.footer_container}>
                        <Text style={styles.footer_label}>{APP._('HELP_RESOURCE_DETAIL_PAGE.PUBLICATION_DATE')}: </Text>
                        <Text style={styles.footer_value}>{doc?.published_on}</Text>
                    </View>
                </View>
                {
                    downloading && <ViewerWeb url={download_url} />
                }
            </Card.Content>
        </Card>
    </AppContainer>
  )
}

export default ResourceDetail

const styles = StyleSheet.create({
    image: {
        padding: 20, 
    },    
    header_container: { 
        alignItems: 'center',
        padding: 5
    },
    author: {
        textAlign: 'center'
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'justify',
        fontSize: 16,
    },
    content: {
        textAlign: 'justify'
    },
    footer_container: { 
        display: 'flex', 
        flexDirection: 'row', 
        alignContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5
    },
    footer_label: {
        flex: 1,
        fontWeight: 'bold',
    },
    footer_value: {
        flex: 2,
    }
})