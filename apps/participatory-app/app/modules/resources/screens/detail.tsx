import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import AppContainer from 'ui/components/shared/app-container';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { DocTypeService } from 'data-layer/services/doctype';
import { APP } from 'common';
import { Card } from 'react-native-paper';
import HyperLink from '../../../components/shared/HyperLink';
import ViewerWeb from 'ui/components/shared/viewer-web';

const ResourceDetail = (docname: string) => {
  const params = useLocalSearchParams();
  const [doc, setDoc] = useState(undefined);
  const [downloading, set_downloading] = useState(false);
  const [download_url, setDownloadUrl] = useState('');
  const navigation = useNavigation();

  const makeUrl = (url: string) => {
    return APP.make_backend_url(url);
  };

  const get_caption = (str: string) => {
    return APP.clip_text(str, 30);
  };

  const downloadOrViewFile = (url: string) => {
    console.log('viewing or downloading');
    // new ViewerWeb('https://github.com/vinzscam/react-native-file-viewer/raw/master/docs/react-native-file-viewer-certificate.pdf');
    return (
      <View style={{ display: 'none' }}>
        <ViewerWeb url={url} />
      </View>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: APP._('HELP_RESOURCE_DETAIL_PAGE.TITLE') });
  }, [navigation]);

  useEffect(() => {
    new DocTypeService('Help Resource').get_doc(params.docname).then((rec) => {
      setDoc(rec);
    });
  }, [params.docname]);
  return (
    <AppContainer>
      <Card>
        <Card.Cover
          style={styles.image}
          source={{ uri: makeUrl(doc?.image) }}
        ></Card.Cover>
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
              <Text style={styles.footer_label}>
                {APP._('HELP_RESOURCE_DETAIL_PAGE.ATTACHED_FILE')}:{' '}
              </Text>
              <HyperLink
                style={[styles.footer_value, { marginBottom: -5 }]}
                href={makeUrl(doc?.upload_file)}
                label={get_caption(doc?.upload_file)}
                onPress={() => {
                  //APP.route_to_path("/screens/fileviewer", { url: makeUrl(doc?.upload_file) });
                  // FileUtil.download_and_open_file(makeUrl(doc?.upload_file));
                  // FileUtil.download_file(makeUrl(doc?.upload_file));
                  // downloadOrViewFile(makeUrl(doc?.upload_file))

                  // @TODO. Check why download is not working for files hosted locally. Only works for remote files
                  // Also only pdf files are downloading and not others. Could this be because of Webview component?
                  setDownloadUrl(makeUrl(doc?.upload_file)); //'https://file-examples.com/wp-content/storage/2017/02/file_example_XLS_10.xls');//makeUrl(doc?.upload_file));//'https://web.pdx.edu/~nauna/week7b-neuralnetwork.pdf')
                  set_downloading(true);
                  setTimeout(() => {
                    //reset downloading after 5 seconds
                    set_downloading(false);
                  }, 5000);
                }}
              />
            </View>
            <View style={styles.footer_container}>
              <Text style={styles.footer_label}>
                {APP._('HELP_RESOURCE_DETAIL_PAGE.RELEVANT_COUNTY')}:{' '}
              </Text>
              <Text style={styles.footer_value}>{doc?.county}</Text>
            </View>
            <View style={styles.footer_container}>
              <Text style={styles.footer_label}>
                {APP._('HELP_RESOURCE_DETAIL_PAGE.RELEVANT_SECTOR')}:{' '}
              </Text>
              <Text style={styles.footer_value}>
                {get_caption(doc?.sector)}
              </Text>
            </View>
            <View style={styles.footer_container}>
              <Text style={styles.footer_label}>
                {APP._('HELP_RESOURCE_DETAIL_PAGE.PUBLICATION_DATE')}:{' '}
              </Text>
              <Text style={styles.footer_value}>{doc?.published_on}</Text>
            </View>
          </View>
          {downloading && <ViewerWeb url={download_url} />}
        </Card.Content>
      </Card>
    </AppContainer>
  );
};

export default ResourceDetail;

const styles = StyleSheet.create({
  image: {
    padding: 20,
  },
  header_container: {
    alignItems: 'center',
    padding: 5,
  },
  author: {
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'justify',
    fontSize: 16,
  },
  content: {
    textAlign: 'justify',
  },
  footer_container: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
  footer_label: {
    flex: 1,
    fontWeight: 'bold',
  },
  footer_value: {
    flex: 2,
  },
});
