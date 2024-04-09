import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Menu, Divider, Provider, IconButton, Text, List, Checkbox } from 'react-native-paper';
import { IMappingOptionMenuItemProps } from '../interfaces';
import { IMenuProps } from '@/app/common/interfaces';
import AppSlider from '@/app/common/components/Slider';

/**
 * A drop down that drop downs from an anchor such as a button
 * Set as a child of common/components/Menu.tsx
 * @param props 
 * @returns 
 */
export const AppMenu = (props: IMenuProps) => { 
  const [visible, set_visible] = React.useState(props.visible);
  
  const open_menu = () => set_visible(true);
  const close_menu = () => set_visible(false);
  return ( 
      <View
        style={{
        //   paddingTop: 50,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Menu
          style={{ paddingTop: 50 }}
          visible={visible}
          onDismiss={props.on_dismiss || close_menu}
        //   anchor={<Button onPress={open_menu}>{ props.anchor_label }</Button>}
        anchor={<Button icon="cog" mode='text' onPress={open_menu}>{ props.anchor_label }</Button>}
          //anchor={props.anchor}
        >
         { props.children }
        </Menu>
      </View> 
  ); 
};

/**
 * Options to be displayed when user clicks the Settings/options button on the mapping page
 * @param props 
 * @returns 
 */
export const TechnicalAnalysisMenuItem = (props: IMappingOptionMenuItemProps)  => {
    const { title, on_checkbox_value_change, is_divider, on_slider_value_change } = props; 
    const [checked, set_checked] = React.useState(false);
    return (
        <View style={styles.parent}>
            <Text variant="bodySmall">{props.title}</Text>
            <List.Item 
                // title="First Item"
                // description="Item description"
                left={chk_props => {
                  return (
                    <View style={styles.container}>
                      <View style={styles.checkbox}>
                        <Checkbox status={checked ? 'checked' : 'unchecked'}
                          onPress={()=>{
                              set_checked(!checked);
                              if(on_checkbox_value_change){
                                on_checkbox_value_change(checked);
                              }
                          }}
                        />
                      </View>
                        <AppSlider 
                            style={styles.slider}
                            minimum_value={0} 
                            maximum_value={1} 
                            value={0.5}
                            step={0.1}
                            on_value_change={(val) => { 
                                if(on_slider_value_change){ 
                                  on_slider_value_change(val);
                                }
                              }
                            }
                        />
                    </View>
                    
                    )
                  }
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
  parent: {
    marginBottom: -20,
    padding: 2
  },
  container: {
    flex: 1, 
    flexDirection: 'row', 
    alignContent: 'center',
    alignItems: 'center',
    // marginTop: -30,
    // marginBottom: -30,
    padding: 5
  },
  checkbox: {
    flex: 1,
    flexBasis: '25%',
    marginTop: -20,
    padding: 0,
  },
  slider: {
    flex: 1,
    flexBasis: '75%',
    marginTop: -20,
    padding: 0,
  }
}) 