import { theme } from "@/app/core/theme";
import { StyleSheet } from "react-native";

export const SelectStyles = StyleSheet.create({
    container: { padding: 16 },
    dropdown: {
      height: 50,
      backgroundColor: 'transparent',
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
    },
    placeholderStyle: {
      fontSize: 16,
      paddingLeft: 15,
    },
    selectedTextStyle: {
      fontSize: 14,
      paddingLeft: 15,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
     height: 40,
      fontSize: 16,
      backgroundColor: theme.colors.surface
    },
    icon: {
      marginRight: 5,
    },
    selectedStyle: {
      borderRadius: 12,
    },
})