import { View, Text, Alert } from "react-native";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Stepper from "react-native-stepper-ui";
import StepIndicator from 'react-native-step-indicator';
import { EngagementStore } from "@/app/stores/engagement";
import { EngagementService } from "@/app/services/engagement";
import { DOCTYPES } from "@/app/constants/enums";
import { APP } from "@/app/utils/app";
import { DocTypeService } from "@/app/services/doctype";
import Component from "react-native-paper/lib/typescript/components/List/ListItem"; 
import { useLocalSearchParams, useNavigation } from "expo-router";
import DocForm from "../DocForm";
import useDynamicRefs from "@/app/hooks/dynamic_refs";
import { GLOBALS } from "@/app/constants/defaults";
import { UIUtil } from "@/app/utils/ui";
import { StyleSheet } from "react-native";
import { theme } from "@/app/core/theme";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/app/contexts/auth";

const MyComponent = (props: { title: string }) => {
  return (
    <View>
      <Text>{props.title}</Text>
    </View>
  );
};
export default function MultiStepForm(props) {  
  const navigation = useNavigation();
  const stepperRef = useRef(null);
  const [step, set_step] = useState(0);
  const [engagement, set_engagement] = useState(null);
  const [engagement_template, set_engagement_template] = useState({ items: [] });
  const [docs, set_docs] = useState([]);
  const [loading, set_loading] = useState(false);
  // const [form_refs, set_form_refs] = useState({});
  const form_refs = useRef();
  const [get_ref, set_ref] = useDynamicRefs();
  const [key, set_key] = useState('');
  const auth = useAuth();

  const [content, set_content] = useState([
    <MyComponent title="Component 1" />,
    <MyComponent title="Component 2" />,
    <MyComponent title="Component 3" />,
  ]); 
  const params = useLocalSearchParams();
   
  useEffect(() => {    
    new DocTypeService("Engagement").get_doc(params.engagement).then((d) => {      
      //engagement.value = d 
      set_engagement(d);
      if(d.has_data_forms){
        // If is structured survey, get the Engagement Template
        new DocTypeService('Engagement Template').get_doc(d.data_forms_template).then((t)=> { 
          //engagement_template.value = t 
          set_engagement_template(t);
        }).then(() => {
          check_draft_records(d);
        })
      } else {
        check_draft_records(d);
      }
    })
  }, []);

  useEffect(()=> {
     refresh_content();    
  }, [engagement_template, docs]);

  useLayoutEffect(() => {  
    navigation.setOptions({ title: `${engagement?.engagement_name}` }); 
  }, [engagement])
  
  const on_next_step = async () => {
    const key = `form` + (step+1); //add 1 since form.idx is 1 based index while step is 0 based indexed
    // const form = form_refs[key];
    const form = get_ref(key).current; //get .current since this is a ref
    const res = await form.validate(); 
    // const values = form.get_values();
    const errors = await form.validate();
    const valid = await form.is_valid(); 
    console.log("values: ", form)

    if (valid) {
      const doctype = await form.get_doc_type(); 
      const vals = await form.get_values(); 

      
      EngagementStore.set_survey_form_data(engagement.name, doctype, vals); 
      if (step == engagement_template?.items?.length - 1) { 
        //is the last step. submit data
        const vals = EngagementStore.get_survey_engagement_entry_data(engagement.name);
        const drafts = await EngagementService.get_draft_engagement_entries(engagement.name);
        if (drafts && drafts?.length > 0) {
          vals[`${DOCTYPES.ENGAGEMENT_ENTRY}`] = drafts[0];
        }
        //$q.loading.show({});
        vals["Engagement"] = engagement;
        const res = await EngagementService.save_engagement_entry(vals);
        //$q.loading.hide();
        if (res) {
            APP.alert(APP._("GLOBAL.SAVE_SUCCESS_MESSAGE"), false, "bottom");   
            APP.navigate_to_path(navigation, 'views/list/[doctype]', { 
              doctype: `${DOCTYPES.ENGAGEMENT_ENTRY}`,
              'engagement': engagement.name
            }
          )          
            // APP.route_to_path('views/list/[doctype]', { 
            //     doctype: `${DOCTYPES.ENGAGEMENT_ENTRY}`,
            //     'engagement': engagement.name
            //   }
            // ) 
        } else {
           APP.alert_error(APP._("GLOBAL.SAVE_ERROR_MESSAGE"));
        }
      } else {
        // continue with next step
        // stepperRef.next(); 
        set_step(p => p+1);
      }
    } else {
      let vals = Object.values(errors);
        let msg = '';
        vals.map((el, idx) => {
           msg += `${idx + 1}.${el}\n`;
        })
        msg += ''
       APP.show_error(msg, APP._("VALIDATION.VALIDATION_ERRORS"));
    }
  };

  const on_back_step = async () => {
    // stepperRef.current.previous();
    set_step(p => p-1);
  }; 

  const load_engagement_entry_data = async (engagement_name, entry) => {
    EngagementService.get_engagement_entry_record(entry).then((data) => {
      // docs.value = data
      set_docs(data);  
      EngagementStore.set_survey_engagement_entry_data(engagement_name, data)      
      set_loading(false);
    })
  }

  const check_draft_records = async (engagement_doc) => { 
    if(!engagement_doc){
      return;
    } 
    //check if its not a new selection
    if(!UIUtil.is_new_record(params.entry)){
      // load entry data
      await load_engagement_entry_data(engagement_doc.name, params.entry)
      return
    }
    // If its a new entry, check if there is another draft 
    let records = await EngagementService.get_draft_engagement_entries(engagement_doc.name)
    if(records?.length > 0){
      APP.confirm("There is a draft record. Do you want to open it?", '', () => {
          //load draft record
          set_docs(prev_state => {
            let dcs = Object.assign({}, prev_state);
            dcs[`${DOCTYPES.ENGAGEMENT_ENTRY}`] = records[0];
            return { dcs }
          })
          //docs[`${DOCTYPES.ENGAGEMENT_ENTRY}`] = records[0];
          EngagementStore.set_survey_form_data(engagement_doc.name, `${DOCTYPES.ENGAGEMENT_ENTRY}`, records[0])
          EngagementService.get_engagement_entry_record(records[0].name).then((data) => {
            //docs.value = data
            set_docs(data);
            EngagementStore.set_survey_engagement_entry_data(engagement_doc.name, data)
            //loading.value = false
            set_loading(false);
          })
        }, 
        ()=>{
          //discard draft record
          EngagementService.discard_draft_engagement_entry(records[0].name)
          // loading.value = false
          set_loading(false);
        }
      )
    } else { 
      // loading.value = false
      set_loading(false);
    }
  } 

  const refresh_content = () => {
    let contents = [];
    for(let i=0; i< engagement_template?.items?.length; i++) {
      let form = engagement_template.items[i]; 
      contents.push( 
        <DocForm
          doctype={form.doctype_item} 
          docname={docs ? (docs[form.doctype_item] ? docs[form.doctype_item].name : null) : null}
          doc={docs ? (docs[form.doctype_item] ? docs[form.doctype_item] : null) : null}
          show_save_button={false} 
          // ref={(el) => (form_refs['form'+form.idx] = el)}
          ref={set_ref(`form${form.idx}`)}
        />
      )
    }
    set_content(contents);
    return contents
  }

  useFocusEffect(
    React.useCallback(() => {  
      set_key(APP.generate_random_string());

      return () => { 
        set_key(null);
      }
    }, []) 
  );

  useEffect(()=> {
    /**Do this to ensure forms are reloaded and redrawn */
    navigation.addListener('focus', () => {
      console.log('Reloaded screen')
    })
  }, [navigation])

 
  return (
    <View key={key}> 
      <Stepper 
        active={step}
        buttonStyle={styles.buttons}
        stepStyle={styles.step}
        buttonStyle2={{ padding: 10, borderRadius: 6, alignSelf: 'center', marginRight: 10, marginLeft: 25, backgroundColor: '#a1a1a1'}} 
        stepStyle2={{backgroundColor: '#1976d2', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center', opacity: 1}}
        content={content}
        onBack={() => {
            on_back_step();
            //set_step((p) => p - 1);
          }
        }
        onNext={() => {
            on_next_step();
            //set_step((p) => p + 1);
          }
        }
        onFinish={() => {
            on_next_step();
            // APP.alert("Finish");
          }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    backgroundColor: theme.colors.tertiary,
    marginLeft: 20,
    borderRadius: 5,
    height: 40
  },
  step: {
    backgroundColor: theme.colors.secondary
  }
})
