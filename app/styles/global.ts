import { StyleSheet } from "react-native";
import { theme } from "../core/theme";

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
        // padding: 10,
        // fontSize: 18,
        borderRadius: 6,
        margin: 5
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
        marginTop: 10 
    },
    modal_container: {
        padding: 10
    },
    name_column: {
        width: 10,
        overflow: 'hidden',
    },
    select: {
        borderColor: 'gray',
        padding: 0,
        borderWidth: 1,
        margin: 5,
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