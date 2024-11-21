import * as FileSystem from 'expo-file-system';
import FileViewer from "react-native-file-viewer";
import { Platform } from "react-native";
import { APP } from "./app"; 

export class FileUtil {
    static store_path = `${FileSystem.documentDirectory}`;

    static download_and_open_file = async (url: string) => {
        // const extension = this.get_extension(url);
        const uri = await this.download_file(url);
        if(uri){
            this.open_file(uri);
            console.log("Opened file: ", uri)
        } else {
            console.log("File was not downloaded");
        }
    }

    /**
     * *IMPORTANT*: The correct file extension is always required.
     * You might encounter issues if the file's extension isn't included
     * or if it doesn't match the mime type of the file.
     * https://stackoverflow.com/a/47767860
     * @param url 
     */
    static get_extension = (url: string) => {
        const ext = url.split(/[#?]/)[0].split(".").pop().trim();
        console.log("Extension:", ext, url)
        return ext;
    }

    /**
     * Get file name to save downloaded file as
     * @param url 
     * @returns 
     */
    static get_file_name = (url: string) => {
        const ext = this.get_extension(url);
        let name = url.substring(url.lastIndexOf('/')+1); // url.replace(`.${ext}`, '');
        if(!name){
            name = APP.generate_random_string(10);
        } 
        return name.replace(`.${ext}`, "");
    }

    /**
     * Download file allowing for resumption
     * @param url 
     * @returns 
     */
    static download_file = async (url: string) => { 
        const file_name = this.get_file_name(url);

        const ext = this.get_extension(url);
        const dest_file_path = `${this.store_path}/${file_name}.${ext}`

        const download_resumable = FileSystem.createDownloadResumable(
            url,
            dest_file_path,
            {},
            (progress) => {
               console.log('Download progress:', progress); 
            }
        );

        try {
            const { uri } = await download_resumable.downloadAsync();
            console.log('Finished downloading to ', uri);
            return uri;            
        } catch (e) {
            console.error(e);
        } 
    }

    /**
     * Open supported files
     * @param uri 
     */
    static open_file = (uri: string) => {
        try {
            FileViewer.open(uri);
        } catch (error) {
            console.error(error);   
        }        
    }
} 

// import RNFS from "react-native-fs";
// import FileViewer from "react-native-file-viewer";
// import { Platform } from "react-native";
// import { APP } from "./app"; 

// export class FileUtil {
//     static store_path = `${RNFS.DocumentDirectoryPath}`;

//     static download_and_open_file = (url: string) => {
//         const extension = this.get_extension(url);
//     }

//     /**
//      * *IMPORTANT*: The correct file extension is always required.
//      * You might encounter issues if the file's extension isn't included
//      * or if it doesn't match the mime type of the file.
//      * https://stackoverflow.com/a/47767860
//      * @param url 
//      */
//     static get_extension = (url: string) => {
//         return url.split(/[#?]/)[0].split(".").pop().trim();
//     }

//     static get_file_name = (url: string) => {
//         const ext = this.get_extension(url);
//         let name = url.replace(`.${ext}`, '');
//         if(!name){
//             name = APP.generate_random_string(10);
//         }
//         return name;
//     }

//     static download_file = (url: string) => {
//         const file_name = this.get_file_name(url);
//         const ext = this.get_extension(url);
//         const file = `${this.store_path}/${file_name}.${ext}`
//         const options = {
//             fromUrl: url,
//             toFile: `${file}`,
//             progressCallback: (progress) => {
//                 console.log('Download progress:', progress);
//             },
//           };
        
//         RNFS.downloadFile(options)
//           .promise.then((response) => FileViewer.open(response.filePath))
//           .then(() => {
//             // success
//           })
//           .catch((error) => {
//             // error
//             console.warn(error);
//           });
//     }
// } 