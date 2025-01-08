import { StyleSheet, Text, View } from 'react-native'
import React from 'react' 
import FileViewer from 'react-native-file-viewer';
import { Platform } from 'react-native';

const FileDownloadAndViewer = () => {
  const url =
  "https://github.com/vinzscam/react-native-file-viewer/raw/master/docs/react-native-file-viewer-certificate.pdf";

  // *IMPORTANT*: The correct file extension is always required.
  // You might encounter issues if the file's extension isn't included
  // or if it doesn't match the mime type of the file.
  // https://stackoverflow.com/a/47767860
  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  const extension = getUrlExtension(url);

  // Feel free to change main path according to your requirements.
  const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${extension}`;

  const options = {
    fromUrl: url,
    toFile: localFile,
  };

  RNFS.downloadFile(options)
    .promise.then(() => FileViewer.open(localFile))
    .then(() => {
      // success
    })
    .catch((error) => {
      // error
    });

  return (
    <View>
      <Text>FileDownloadAndViewer</Text>
    </View>
  )
}

export default FileDownloadAndViewer

const styles = StyleSheet.create({})