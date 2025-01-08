import * as React from 'react';
import { View } from 'react-native';
import { Button, Menu, Divider, Provider, IconButton } from 'react-native-paper'; 
import { AppIconButton } from 'ui/components/shared/app-icon-button';
import { IMenuItemProps } from '../../constants/enums';

export interface IMenuProps {
  visible: boolean, //is menu visible
  onDismiss?: () => void,
  // anchor: React.Component<any>, //component upon which the menu is anchored
  anchor_label: string, //title of the component where menu is anchored
  anchor_icon: string, //icon to use for the anchor
  //anchor_mode: string, //icon to use for the anchor
  //menu_items: Array<IMenuItemProps>
  /**
  * Content of the `Menu`.
  */
  children: React.ReactNode,
  disabled: boolean,
  anchor_size: number
} 

const AppMenu = (props: IMenuProps) => { 
  const [visible, set_visible] = React.useState(props.visible); 
  const [disabled, set_disabled] = React.useState(props.disabled); 
  const open_menu = () => set_visible(true);
  const close_menu = () => set_visible(false);

  React.useEffect(()=>{
    set_disabled(props.disabled);
  }, [props.disabled]);
  
  return ( 
       <View
          style={{
            //paddingTop: 50,
            flexDirection: 'row',
            justifyContent: 'center',
          }}> 
          <Menu
            style={{ paddingTop: 50 }}
            visible={visible}
            onDismiss={props.onDismiss || close_menu}
          //   anchor={<Button onPress={open_menu}>{ props.anchor_label }</Button>}
          // anchor={<Button disabled={disabled} icon={props.anchor_icon} mode='text' onPress={open_menu}>{ props.anchor_label }</Button>} 
            anchor={<AppIconButton 
                        label={props.anchor_label} 
                        disabled={disabled} 
                        size={props.anchor_size}  
                        icon={props.anchor_icon} 
                        // mode={props.anchor_mode} 
                        onPress={open_menu}
                    >                        
                    </AppIconButton>} 
          >
         { props.children }        
        </Menu>
      </View> 
  ); 
};

const AppMenuItem = (props: IMenuItemProps)  => {
    const { title, onPress, is_divider } = props;
    return is_divider ? (<Divider />) : (<Menu.Item title={title} onPress={onPress} />) 
}

export { AppMenu, AppMenuItem };