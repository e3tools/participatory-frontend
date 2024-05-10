import { Alert } from "react-native";
import { APP } from "./app";
import { make_request } from "./api";
import { ImagePickerAsset, ImagePickerResult } from "expo-image-picker";
import { Audio } from "expo-av";
import { StringOrNumberOrCallback } from "victory-core";
import { contains } from "cheerio/lib/static";

type ImagePicker = {
    uri: string,
    mime_type: string,
    name?: string,
    size: number
}

export type UploadFileProps = {
    file_name: string,
    file_obj: object,
    file_url?: string,
    uri: string
}

/**
 * Upload files to the server
 * @param assets 
 * @returns 
 */
export const upload_image = async (assets: Array<ImagePickerAsset>, doctype?: string, docname?: string, fieldname?: string) => { 
    for(const asset of assets) {
        //use selected_file.uri to get the file path for upload
        /*data.append("doc[]", {
            url: asset.uri,
            type: asset.mimeType ? asset.mimeType : '',
            name: asset.fileName ? asset.fileName : APP.generate_random_string(10),
            size: asset.fileSize ? asset.fileSize : undefined 
        });*/

        const file = {} as UploadFileProps;
        file.file_name = asset.fileName
        file.file_obj = null
        file.file_url = null
        file.uri = asset.uri
    
        await _upload_file(file, doctype, docname, fieldname);
        console.log('File upload', `File ${asset.fileName} has been uploaded successfully`);
    } 
}

export const upload_audio = (props: Audio.Recording) => {
    console.log("Uploading audion upload")
    const uri = props.getURI()
    if(uri){
        console.log(`Audio file path ${uri}`)
    }
}

const _upload_file = async (file: UploadFileProps, doctype?: string, docname?: string, fieldname?: string) => {
    const form_data = new FormData();           
    const file_name = file.file_name ? file.file_name : APP.generate_random_string(10); 

    if (file.file_obj) {
        form_data.append("file", file.file_obj, file_name);
    }
    form_data.append("is_private", "0");
    // form_data.append("folder", props.folder);

    if (file.file_url) {
        form_data.append("file_url", file.file_url);
    }

    if (file_name) {
        form_data.append("file_name", file_name);
    }
    // if (file.library_file_name) {
    // 	form_data.append("library_file_name", file.library_file_name);
    // }

    if (doctype && docname) {
        form_data.append("doctype", doctype);
        form_data.append("docname", docname);
    }

    if (fieldname) {
        form_data.append("fieldname", fieldname);
    }

    // if (props.method) {
    // 	form_data.append("method", props.method);
    // }

    // if (file.optimize) {
    // 	form_data.append("optimize", true);
    // }

    // if (props.attach_doc_image) {
    // 	form_data.append("max_width", 200);
    // 	form_data.append("max_height", 200);
    // }

    console.log("File uri: ", file.uri)
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
            resolve(xhr.response)
        }
        xhr.onerror = function () {
            reject(new TypeError('Network request failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', file.uri, true)
        xhr.send(null)
    })
    .then((blob) => {
        console.log("Blob file: ", blob, file_name);
        form_data.append('file_obj', blob, blob.name);

        console.log("JOSM", form_data)

         //open the request
         var xhr = new XMLHttpRequest();
         xhr.open('POST', APP.make_frappe_api_endpoint('do_upload'))
        //  xhr.setRequestHeader("Content-Type", "application/json");
         xhr.setRequestHeader("Accept", "application/json");
 
         //send the form data
        //  xhr.send(JSON.stringify(Object.fromEntries(form_data)));
        xhr.send(form_data);
 
         xhr.onreadystatechange = function() {
             if (xhr.readyState == XMLHttpRequest.DONE) { 
                //reset form after AJAX success or do something else
                console.log("Upload completed")
             }
         }

        // make_request(
        //     APP.make_frappe_api_endpoint('do_upload'),
        //         'POST',
        //         form_data,
        //         { 
        //             "Accept": "application/json",
        //             "Content-Type": 'application/json'
        //             //"Content-Type": 'multipart/form-data'
        //         },
        //         'data',
        //         false
        //     )
        // .then((res) => {}) 
    })
    .catch((error) => {
        console.log(error)
    }) 

    // const res = await make_request(
    //     APP.make_frappe_api_endpoint('do_upload'),
    //     'POST',
    //     form_data,
    //     { 
    //         //"Content-Type": 'multipart/form-data'
    //     },
    //     'data'
    // )
    // return res 
}