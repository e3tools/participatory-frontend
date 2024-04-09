import * as React from 'react';
import { View } from 'react-native';
import { Button, Menu, Divider, Provider, IconButton } from 'react-native-paper';
import { IMenuProps, IMenuItemProps } from '../interfaces';

const AppMenu = (props: IMenuProps) => { 
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
          anchor={<Button icon={ props.anchor_icon } mode='text' onPress={open_menu}>{ props.anchor_label }</Button>}
          //anchor={props.anchor}
        >
         { props.children }        
        </Menu>
      </View> 
  ); 
};

const AppMenuItem = (props: IMenuItemProps)  => {
    const { title, on_press, is_divider } = props;
    return is_divider ? (<Divider />) : (<Menu.Item title={title} onPress={on_press} />) 
}

export { AppMenu, AppMenuItem };