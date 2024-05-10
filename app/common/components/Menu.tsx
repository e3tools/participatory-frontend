import * as React from 'react';
import { View } from 'react-native';
import { Button, Menu, Divider, Provider, IconButton } from 'react-native-paper';
import { IMenuProps, IMenuItemProps } from '../interfaces';
import { AppIconButton } from '@/app/components/shared/AppIconButton';

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
            onDismiss={props.on_dismiss || close_menu}
          //   anchor={<Button onPress={open_menu}>{ props.anchor_label }</Button>}
          // anchor={<Button disabled={disabled} icon={props.anchor_icon} mode='text' onPress={open_menu}>{ props.anchor_label }</Button>} 
            anchor={<AppIconButton 
                        label={props.anchor_label} 
                        disabled={disabled} 
                        size={props.anchor_size}  
                        icon={props.anchor_icon} 
                        mode='contained-tonal' 
                        on_press={open_menu}
                    >                        
                    </AppIconButton>} 
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