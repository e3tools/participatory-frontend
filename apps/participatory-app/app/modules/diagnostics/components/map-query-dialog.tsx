import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import {
  Checkbox,
  Dialog,
  List,
  PaperProvider,
  Portal,
} from 'react-native-paper';
import { APP } from 'common';
import { TechnicalAnalysisService } from '@/app/services/technical-analysis';

export default function MapQueryDialog(props) {
  const [visible, setVisible] = useState(props.visible);
  const [analyses, setAnalyses] = useState([]);
  const [opacity, set_opacity] = useState({});
  const [activeAnalyses, setActiveAnalyses] = useState({});

  TechnicalAnalysisService.get_analyses().then((recs) => {
    setAnalyses(recs);
    const opac = {};
    const actives = {};
    recs.map((el, idx) => {
      opac[el.name] = 0.5;
      actives[el.name] = false;
    });
    set_opacity(opac);
    setActiveAnalyses(actives);
  });

  return (
    <PaperProvider>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{APP._('MAP_PAGE.SET_OPTIONS')}</Dialog.Title>
          <Dialog.Content>
            {analyses.map((analysis, idx) => (
              <List.Item
                title="First Item"
                description="Item description"
                // left={props => <List.Icon {...props} icon="folder" />}
                left={(props) => (
                  <Checkbox
                    status="unchecked"
                    onPress={() => Alert.alert('Left check')}
                  />
                )}
                right={(props) => (
                  <Checkbox
                    status="unchecked"
                    onPress={() => Alert.alert('Right check')}
                  />
                )}
              />
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}
