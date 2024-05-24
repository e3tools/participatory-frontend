import { StyleSheet } from "react-native";
import { theme } from "../core/theme";
import { GLOBALS } from "../constants/defaults";

export const GlobalStyles = StyleSheet.create({
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

// {
//     views: StyleSheet.create({
//         container: {
//             padding: 10
//         }
//     }),
//     dashboard: StyleSheet.create({
//         container: {
//             flex: 1,
//             flexWrap: 'wrap',
//             padding: 20,
//             flexDirection: 'row',
//             alignContent: 'flex-start',
//         },
//         chart: {
//             flexBasis: 90,
//             height: 200,
//             padding: 10,
//             margin: 10,
//             borderColor: 'red',
//             borderStyle: 'solid',
//             borderWidth: 2
//         },
//         chart_title: {
//             fontWeight: '700'
//         }
//     }), 
//     form: StyleSheet.create({
//         Data: {
//             borderWidth: 1,
//             borderColor: '#ddd',
//             padding: 10,
//             fontSize: 18,
//             borderRadius: 6
//         }
//     })
// } 