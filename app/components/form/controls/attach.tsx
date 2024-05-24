import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import MediaHandler, { MediaAsset } from '../../media/media_handler'
import * as FileSystem from "expo-file-system";
import { upload_audio, upload_image } from '../../../utils/media'; 
import { Button, Icon, IconButton } from 'react-native-paper';
import { IDataProps } from '@/app/interfaces/inputs';
import FieldLabel from './field_label';
import { GlobalStyles } from '@/app/styles/global';
import { theme } from '@/app/core/theme';
import { APP } from '@/app/utils/app';
import { prop } from 'cheerio/lib/api/attributes';

interface IAttachProps extends IDataProps {
    type?: [],
    multiple?: boolean 
}
const Attach = (props: IAttachProps) => {
    const [popup_visible, set_popup_visible] = useState(false); 
    const [assets, set_assets] = useState<Array<MediaAsset>>([]);
    const error_message = props.form_state?.errors?.[props.field?.fieldname || props.field_name];
    const text_color = error_message ? theme.colors.error : theme.colors.surface; 
 
    const render_item = (item: MediaAsset) => { 
        const file_name = pop_file_name(item.file_name || item.uri);
        return (
            <View style={[styles.image_list_container]} key={Math.random()}>
                <Image source={{ uri: item.uri }} style={styles.image_preview} />
                <Text style={styles.image_title}>{file_name}</Text>
                {/* <Ionicons.Button name="trash" onPress={()=> delete_asset(item)} /> */}
                <IconButton disabled={props.readonly} icon={'delete-outline'} onPress={() => delete_asset(item)}></IconButton>
            </View>
        )
    }

    const pop_file_name = (uri: string) => { 
        if(!uri) return '';
        let file_name = uri.split("/").pop();
        let parts = file_name?.split(".");
        let clipped_name = APP.clip_text(parts?.[0], 20);
        return `${clipped_name}.${parts?.[1]}`;
    } 

    const delete_asset = async (asset: MediaAsset) => {
        await FileSystem.deleteAsync(asset?.uri);
        set_assets(assets.filter((itm) => itm !== asset));
    }

    const add_asset = async (asset: MediaAsset) => {
        set_assets([...assets, asset]);
        set_popup_visible(false);
    }

    const styles = useMemo(
        () =>
          StyleSheet.create({
            text_input_style: {
              color: text_color,
            },
            image_preview: {
                width: 30, 
                height: 30
            },
            image_title: {
                flex: 1
            },
            image_list_container: {
                flexDirection: 'row',
                marginLeft: 1,
                alignItems: 'center', 
                gap: 5, 
            }, 
          }),
        [text_color],
      );

    useEffect(()=>{
        props.on_change(assets);
    }, [assets]);

    useEffect(() => {
        let asst = {} as MediaAsset;
        asst.file_name = props.value;
        asst.uri = props.value;
        props.on_change(props.value); //set value as a string and not as a MediaAsset to differentiate new and existing updates
    }, [props.value])

    // useEffect(() => {
    //     let asst = {} as MediaAsset;
    //     asst.file_name = props.value;
    //     asst.uri = props.value;
    //     set_assets([asst])
    // }, [props.value])

  return ( 
    <View>
        <FieldLabel label={props.label} reqd={props.reqd} hidden={props.hidden} />
        <View style={[/*GlobalStyles.form_field, */styles.text_input_style, {flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}]}>
            <IconButton icon='attachment' size={30} onPress={() => set_popup_visible(!popup_visible)} /> 
            <Text>
                {  
                   assets?.length > 0 ? assets?.map((el) => render_item(el)) : props.value
                }
            </Text>
        </View>         
        <MediaHandler 
            send_image_handler={upload_image}  
            send_audio_handler={upload_audio}
            visible={popup_visible}
            on_dismiss={()=>{
                set_popup_visible(false)
            }}
            on_ok={(asset) => add_asset(asset)}
        /> 
    </View>
  )
} 
export default Attach 