import { StyleSheet } from "react-native";

import {
    MD3LightTheme as DefaultTheme,
    PaperProvider,
  } from 'react-native-paper';
  
  const GLOBALS = class {
    static MAX_GRID_COLUMNS = 2;
    static LISTVIEW_PAGE_SIZES = [5, 10, 20];
    static LISTVIEW_SORT_FIELD = "Modified DESC"
    static MAX_DATA_ROWS = 5000;
    static MAX_UPLOAD_SIZE = 5 * 1024 * 1024; //5 MB
    static NEW_RECORD_ID = 'New'
    static BACKEND_TIMEOUT = 120000 //backend api calls will timeout in 2 minutes
    static FORM_FIELD = {
        HEIGHT: 35,
        PADDING: {
            ALL: 5, // ALL will represent top, right, left and bottom
            TOP: 5,
            RIGHT: 5,
            LEFT: 5,
            BOTTOM: 5
        }, 
        MARGIN: {
            ALL: 5, // ALL will represent top, right, left and bottom
            TOP: 5,
            RIGHT: 5,
            LEFT: 5,
            BOTTOM: 5
        } 
    }
};

const light_theme = {
    "colors": {
      "primary": "rgb(120, 69, 172)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(240, 219, 255)",
      "onPrimaryContainer": "rgb(44, 0, 81)",
      "secondary": "rgb(102, 90, 111)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(237, 221, 246)",
      "onSecondaryContainer": "rgb(33, 24, 42)",
      "tertiary": "rgb(128, 81, 88)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(255, 217, 221)",
      "onTertiaryContainer": "rgb(50, 16, 23)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(255, 251, 255)",
      "onBackground": "rgb(29, 27, 30)",
      "surface": "rgb(255, 251, 255)",
      "onSurface": "rgb(29, 27, 30)",
      "surfaceVariant": "rgb(233, 223, 235)",
      "onSurfaceVariant": "rgb(74, 69, 78)",
      "outline": "rgb(124, 117, 126)",
      "outlineVariant": "rgb(204, 196, 206)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(50, 47, 51)",
      "inverseOnSurface": "rgb(245, 239, 244)",
      "inversePrimary": "rgb(220, 184, 255)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(248, 242, 251)",
        "level2": "rgb(244, 236, 248)",
        "level3": "rgb(240, 231, 246)",
        "level4": "rgb(239, 229, 245)",
        "level5": "rgb(236, 226, 243)"
      },
      "surfaceDisabled": "rgba(29, 27, 30, 0.12)",
      "onSurfaceDisabled": "rgba(29, 27, 30, 0.38)",
      "backdrop": "rgba(51, 47, 55, 0.4)"
    }
  }
  
  const theme = {
    ...DefaultTheme,
    colors: light_theme.colors, // Copy it from the color codes scheme and then use it here
  };

  const GlobalStyles = StyleSheet.create({
    container: {
        padding: 10
    },
    chart_container: {
        flex: 1,
        flexWrap: 'wrap',
        padding: 20,
        flexDirection: 'row',
        alignContent: 'flex-start',
    },    
    chart_title: {
        fontWeight: '700'
    },
    chart: {
        flexBasis: 90,
        height: 200,
        padding: 10,
        margin: 10,
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: 2
    },
    form_field: {
        borderWidth: 1,
        borderColor: '#ddd', 
        borderRadius: 6,
        margin: GLOBALS.FORM_FIELD.MARGIN.ALL,
        height: GLOBALS.FORM_FIELD.HEIGHT, 
    },
    field_label: {
        fontSize: 20
    },
    data: {
        // borderWidth: 1,
        // borderColor: '#ddd',
        padding: 10,
        // fontSize: 18,
        // borderRadius: 6,
        // margin: 5
    },
    date_picker: {
        // marginTop: 10, 
        // marginRight: 50,
        paddingRight: 0,
        marginLeft: 2,
        height: GLOBALS.FORM_FIELD.HEIGHT,
        borderWidth: 1
        // width: 200
    },
    modal_container: {
        padding: 10
    },
    name_column: {
        width: 10,
        overflow: 'hidden',
    },
    select: {
        borderColor: theme.colors.primary, //'gray',
        backgroundColor: theme.colors.surface, //secondary, // 'white',
        padding: 0,
        borderWidth: 1,
        margin: 5,
        marginBottom: 0,
        height: GLOBALS.FORM_FIELD.HEIGHT
    },
    header: {
        fontSize: 26,
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 14
    }
});

const BaseConfig = {
    GLOBALS,
    URLS: { 
        BACKEND: process.env.EXPO_PUBLIC_BACKEND, 
    },
    DOCTYPES: {
        ENGAGEMENT_ENTRY: process.env.EXPO_PUBLIC_ENGAGEMENT_ENTRY_DOCTYPE,// 'Engagement Entry'
    },
    APPS: {
        FRAPPE_CUSTOM_APP: process.env.EXPO_PUBLIC_FRAPPE_CUSTOM_APP,// 'participatory_backend'
    },
    KENYA_BOUNDING_BOX: [33.89, -4.68, 41.86, 5.51],
    theme
}

module.exports = BaseConfig;