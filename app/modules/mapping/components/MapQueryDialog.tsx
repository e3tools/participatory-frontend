import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, Dialog, IconButton, List, PaperProvider, Portal} from 'react-native-paper'
import { APP } from '@/app/utils/app';
import { TechnicalAnalysisService } from '@/app/services/technical_analysis';

export default function MapQueryDialog(props) {
    const [visible, set_visible] = useState(props.visible);
    const [analyses, set_analyses] = useState([]);
    const [opacity, set_opacity] = useState({});
    const [active_analysis, set_active_analysis] = useState({});

    TechnicalAnalysisService.get_analyses().then(recs => {
        set_analyses(recs);
        const opac = {};
        const actives = {};
        recs.map((el, idx) => {
            opac[el.name] = 0.5;
            actives[el.name] = false;
        })
        set_opacity(opac);
        set_active_analysis(actives);
    })

  return (
    <PaperProvider>
        <Portal>
            <Dialog visible={visible} onDismiss={() => set_visible(false)}>
                <Dialog.Title>{APP._('MAP_PAGE.SET_OPTIONS')}</Dialog.Title>
                <Dialog.Content> 
                    {
                        analyses.map((analysis, idx) => {
                            <List.Item
                                title="First Item"
                                description="Item description"
                                // left={props => <List.Icon {...props} icon="folder" />}
                                left={(props) => {
                                    <Checkbox status='unchecked' onPress={Alert.alert('Left check')} />
                                }}
                                right={(props) => {
                                    <Checkbox status='unchecked checked' onPress={Alert.alert('Right check')}/>
                                }}
                            />
                        })
                    } 
                </Dialog.Content>
            </Dialog>
        </Portal>
    </PaperProvider>
  )
}