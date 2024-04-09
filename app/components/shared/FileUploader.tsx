import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { GLOBALS } from '@/app/constants/defaults';
import { Button, IconButton } from 'react-native-paper';
import { APP } from '@/app/utils/app';
import { make_request } from '@/app/utils/api';

/**
 * 
 * @param param0 
 * @param type. The MIME type(s) of the documents that are available to be picked
 * @returns 
 * 
 */
//The MIME type(s) of the documents that are available to be picked e.g 'image/*' or ['*/*'] to include all files`
const FileUploader = ({ type=['*/*'], multiple=false, ...rest}) => { 
    // https://medium.com/@alihasan92646/document-picker-react-native-expo-1dfcac0b485e
    const [selected_files, set_selected_files] = useState([]);

    /**
     * Select a document
     */
    const pick_document = async () => {
        let result = null;
        try {
            result = await DocumentPicker.getDocumentAsync({
                type: type,
                copyToCacheDirectory: true, //to allow expo-file-system to read the file
                multiple: multiple
            });

            let files = [];
            let errors = [];
            if(result?.assets) {
                files = result.assets.filter(el => el);
            }
            if(files) {
                console.log("Selected: ", selected_files)
                for(const file of files) {
                    const file_size = await FileSystem.getInfoAsync(file.uri);
                    if(file_size.size > GLOBALS.MAX_UPLOAD_SIZE){
                        errors.push(file.name);
                    }
                }
                if(errors.length > 0) {
                    APP.alert_error(APP._('GLOBAL.FILE_SIZE_EXCEEDED_ERROR') + GLOBALS.MAX_UPLOAD_SIZE / (1024 * 1024) + ' MB');
                } else {
                    set_selected_files(files);
                }
            }
            // console.log(result.uri);
            // //check if selected file is within the size limit
            // const file_size = await FileSystem.getInfoAsync(result?.assets?.uri);
            // if(file_size.size > GLOBALS.MAX_UPLOAD_SIZE){
            //     Alert.alert("File size limit exceeded", "Please select a file up to 5 MB");
            // } else {
            //     set_selected_file(result);
            // }
        } catch (error) {
            // console.log('Result: ', result);
            if(result?.canceled){
                //User cancelled the document picker
            } else {
                throw error;
            }
        }
    }

    /**
     * Upload file to server
     */
    const upload_file = async () => {
        //Implement file upload logic
        if(selected_files) {
            const data = new FormData();           
            for(const file of selected_files) {
                //use selected_file.uri to get the file path for upload
                data.append("doc[]", {
                    url: file.uri,
                    type: file.mimeType,
                    name: file.name,
                    size: file.size
                });
                Alert.alert('File upload', `File ${file.name} has been uploaded successfully`);
            }
            //var object = {};
            //data.forEach((value, key) => object[key] = value);
            //var json = JSON.stringify(object);
            const res = await make_request(
                APP.make_frappe_api_endpoint('do_upload'),
                'POST',
                data,
                { 
                    //"Content-Type": 'multipart/form-data'
                },
                'data'
            )
            return res

        } else {
            Alert.alert('No file selected', 'Please select a file to upload')
        }
    }
  return (
    <View>
      <Button onPress={pick_document}>Pick document</Button>
      <Text>{selected_files.toString()}</Text>
      {
        selected_files.map((itm, idx) => {
            <Text key={idx}>
                { 
                    // itm.name + (itm.size / (1024 * 1024)) + ' MB'
                    itm.name
                } 
            </Text>
        })
        //selected_files && <Text>Selected Files: {selected_files.toString()}</Text>
      }
      <Button onPress={upload_file}>Upload file</Button>
    </View>
  )
}

export default FileUploader

const styles = StyleSheet.create({})