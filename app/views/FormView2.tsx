import { View, Text,  Button } from 'react-native'

import { TextInput } from 'react-native-paper';
import React from 'react'
import { Formik } from "formik";  
import FileUploader from '../components/shared/FileUploader';
import { GlobalStyles } from '../styles/global';
// import * as yup from 'yup';

// const schema = yup.object({
//   title: yup.string()
//     .required()
//     .min(4),
//   body: yup.string()
//     .required()
//     .min(8),
//   rating: yup.string()
//     .required()
//     .test('is-num-1-5', 'Rating must be a number 1 - 5', (val) => {
//       return parseInt(val) < 6&& parseInt(val) > 0;
//     })
// })

export default function FormView({ add_review }) {
  console.log("Formview 2")
  return (
    <View>
      <Formik
        initialValues={{ title: '', body: '', rating: ''}}
        onSubmit={(values, actions) => {
            console.log(values);
            add_review(values);
            actions.resetForm();
        }}
        // validationSchema={schema}
      >
        {(formik_props) => (
            <View>
                <TextInput 
                    style={GlobalStyles.Data}
                    placeholder='Title'
                    label='Field one'
                    // onChangeText={formik_props.handleChange('title')}
                    //value={formik_props.values.title}
                />

                <TextInput 
                    multiline
                    style={GlobalStyles.Data}
                    placeholder='Body'
                    label='Field two'
                    // onChangeText={formik_props.handleChange('body')}
                    //value={formik_props.values.body}
                />

                <TextInput 
                    style={GlobalStyles.Data}
                    placeholder='Rating (1-5)'
                    label='Field three'
                    // onChangeText={formik_props.handleChange('rating')}
                    //value={formik_props.values.rating}
                    keyboardType='numeric'
                />

                <FileUploader multiple={false} type={['*/*']} />
                <Button title="Submit" color='maroon' onPress={formik_props.handleSubmit} />
            </View>
        )}
      </Formik>
    </View>
  )
}