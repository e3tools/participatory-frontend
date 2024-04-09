import { View, Text, Button, TextInput } from 'react-native'
import React from 'react'
import UIGenerator from '../ui/UIGenerator'
import { Formik } from "formik";  

// export default FormView = props => (
//     <Formik
//       initialValues={{ email: '' }}
//       onSubmit={values => console.log(values)}
//     >
//       {({ handleChange, handleBlur, handleSubmit, values }) => (
//         <View>
//           <TextInput
//             onChangeText={handleChange('email')}
//             onBlur={handleBlur('email')}
//             value={values.email}            
//           />
//           <Button onPress={handleSubmit} title="Submit" />
//         </View>
//       )}
//     </Formik>
//   );

export default function FormView({ doctype, docname, doc}) {
  return (
    <View>
      <Formik
        initialValues={{ title: '', body: '', rating: ''}}
        onSubmit={(values, actions) => {
            console.log(values);
            //add_review(values);
            actions.resetForm();
        }}
        // validationSchema={schema}
      >
        {(formik_props) => (
            <View>
                 {/* <TextInput 
                    style={GlobalStyles.Data}
                    placeholder='Title'
                    // onChangeText={formik_props.handleChange('title')}
                    //value={formik_props.values.title}
                /> */}
                <UIGenerator doctype={doctype} docname={docname} doc={doc} />
                <Button title="Submit" color='maroon' onPress={formik_props.handleSubmit} />
            </View>
        )}
      </Formik>
    </View>
  )
}