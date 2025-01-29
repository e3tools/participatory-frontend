import { View, Text } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Stepper from 'react-native-stepper-ui';
import { EngagementStore } from '@/app/stores/engagement';
import { EngagementService } from '@/app/services/engagement';
import { APP } from 'common';
import { router, useNavigation } from 'expo-router';
import DocForm from 'ui/components/form/views/base/doc-form';
import useDynamicRefs from '../../hooks/dynamicRefs';
import { UIUtil } from 'ui/utils/ui';
import { StyleSheet } from 'react-native';
import { theme } from '@/app/core/theme';
import { useFocusEffect } from '@react-navigation/native';
import * as CONFIG from '../../../config';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { getEngagement } from '../../state/engagement/actions/engagement.action';
import {
  addCapturedData,
  CapturedEntry,
  clearCapturedData,
} from '../../state/capturedData/capturedDataSlice';
import { ENGAGEMENT_TYPES } from '@/app/constants/enums';
import { saveCapturedData } from '@/app/state/capturedData/actions/capturedData.action';
import {
  DraftEngagementProps,
  getDraftEngagementEntriesByUser,
} from '@/app/state/engagementEntry/actions/engagementEntry.action';
import { DocTypeService } from 'data-layer/services/doctype';
import { EngagementFormService } from '@/app/services/engagement-form';
import ProtectedRoute from '@/app/components/protected-route';
import { setEngagementEntryLoading } from '@/app/state/engagementEntry/engagementEntrySlice';
import { EngagementForm } from '@/app/types';

const DOCTYPES = CONFIG.DOCTYPES;

const MyComponent = (props: { title: string }) => {
  return (
    <View>
      <Text>{props.title}</Text>
    </View>
  );
};

interface Props {
  engagement: string;
  engagementEntry: string;
}

export default function MultiStepForm(props: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const engagement = useAppSelector(
    (state) => state.engagement?.selectedEngagement,
  );
  // const [engagement, setEngagement] = useState(null);
  // const [engagementTemplate, setEngagementTemplate] = useState({
  //   items: [],
  // });

  const [isSaving, setIsSaving] = useState(false);
  const user = useAppSelector((state) => state.user.loggedInUser);
  const isOnline = useAppSelector((state) => state.backend.isBackendConnected);
  const capturedRecords = useAppSelector((state) => state.capturedData.records);
  const [docs, setDocs] = useState([]);
  const drafts = useAppSelector((state) => state.engagementEntry.draftEntries);
  // const docs = useAppSelector(
  //   (state) => state.engagementEntry.selectedEntryData,
  // );

  const isLoading = useAppSelector((state) => state.engagementEntry.loading);
  const [loading, setLoading] = useState(false);
  // const [form_refs, set_form_refs] = useState({});
  const [getRef, setRef] = useDynamicRefs();
  const [key, setKey] = useState('');

  const [content, setContent] = useState([
    <MyComponent title="Component 1" />,
    <MyComponent title="Component 2" />,
    <MyComponent title="Component 3" />,
  ]);
  // const params = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({ title: `${engagement?.engagement_name}` });
  }, [engagement, navigation]);

  const onNextStep = async () => {
    if (isSaving || !engagement) {
      return;
    }

    const key = `form` + (step + 1); //add 1 since form.idx is 1 based index while step is 0 based indexed
    // const form = form_refs[key];
    const form = getRef(key)?.current; //get .current since this is a ref
    // const values = form.get_values();
    const errors = await form.validate();
    const valid = await form.is_valid();

    if (valid) {
      const doctype = await form.get_doc_type();
      const formValues = await form.get_values();

      const surveyData: CapturedEntry = {
        engagement: engagement.name,
        engagementType: ENGAGEMENT_TYPES.SURVEY,
        doctype,
        data: formValues,
      };

      // save this record into capturedDataSlice
      dispatch(addCapturedData(surveyData));

      // EngagementStore.set_survey_form_data(engagement.name, doctype, formValues);

      // if (step === engagementTemplate?.items?.length - 1) {
      if (step === 0) {
        //If is the last step. submit data

        // const vals = EngagementStore.getSurveyEngagementEntryData(
        //   engagement.name,
        // );

        // await new Promise((r) => setTimeout(r, 1000)); //sleep for 1 sec

        // const vals = {
        //   ...capturedRecords[ENGAGEMENT_TYPES.SURVEY]?.[engagement.name],
        // };

        const vals = { [doctype]: formValues };

        // const drafts = await EngagementService.getDraftEngagementEntries(
        //   engagement.name,
        // );

        const data: DraftEngagementProps = {
          engagement: engagement.name || '',
          user: user?.name || '',
        };

        await dispatch(getDraftEngagementEntriesByUser(data));

        if (drafts && drafts?.length > 0) {
          vals[`${DOCTYPES.ENGAGEMENT_ENTRY}`] = drafts[0];
        }

        vals['Engagement'] = engagement;

        if (isOnline) {
          // const res = await EngagementService.save_engagement_entry(vals);
          const res = await dispatch(saveCapturedData(vals));
          if (res) {
            // clear the records from slice
            dispatch(clearCapturedData());
            router.push('/modules/engage/screens/SuccessScreen');
          } else {
            APP.alert_error(APP._('GLOBAL.SAVE_ERROR_MESSAGE'));
          }
        } else {
          // If not online, proceed to success page, sync to backend will happen when backend is available
          router.push('/modules/engage/screens/SuccessScreen');
        }
      } else {
        // continue with next step
        // stepperRef.next();
        setStep((p) => p + 1);
      }
    } else {
      let vals = Object.values(errors);
      let msg = '';
      vals.map((el, idx) => {
        msg += `${idx + 1}.${el}\n`;
      });
      msg += '';
      APP.show_error(msg, APP._('VALIDATION.VALIDATION_ERRORS'));
    }

    setIsSaving(false);
  };

  const onNextStep_OLD = async () => {
    const key = `form` + (step + 1); //add 1 since form.idx is 1 based index while step is 0 based indexed
    // const form = form_refs[key];
    const form = getRef(key)?.current; //get .current since this is a ref
    // const values = form.get_values();
    const errors = await form.validate();
    const valid = await form.is_valid();
    console.log('values: ', form);

    if (valid) {
      const doctype = await form.get_doc_type();
      const vals = await form.get_values();
      EngagementStore.set_survey_form_data(engagement.name, doctype, vals);

      // if (step === engagementTemplate?.items?.length - 1) {
      if (step === 0) {
        //If is the last step. submit data
        const vals = EngagementStore.getSurveyEngagementEntryData(
          engagement.name,
        );
        const drafts = await EngagementService.getDraftEngagementEntries(
          engagement.name,
        );
        if (drafts && drafts?.length > 0) {
          vals[`${DOCTYPES.ENGAGEMENT_ENTRY}`] = drafts[0];
        }
        vals['Engagement'] = engagement;
        // const res = await EngagementService.save_engagement_entry(vals);
        const res = await dispatch(saveCapturedData(vals));
        if (res) {
          router.push('/modules/engage/screens/SuccessScreen');
          /*
          APP.alert(APP._('GLOBAL.SAVE_SUCCESS_MESSAGE'), false, 'bottom');
          APP.navigateToPath(navigation, 'views/list/[doctype]', {
            doctype: `${DOCTYPES.ENGAGEMENT_ENTRY}`,
            engagement: engagement.name,
          });
          */
          // APP.route_to_path('views/list/[doctype]', {
          //     doctype: `${DOCTYPES.ENGAGEMENT_ENTRY}`,
          //     'engagement': engagement.name
          //   }
          // )
        } else {
          APP.alert_error(APP._('GLOBAL.SAVE_ERROR_MESSAGE'));
        }
      } else {
        // continue with next step
        setStep((p) => p + 1);
      }
    } else {
      let vals = Object.values(errors);
      let msg = '';
      vals.map((el, idx) => {
        msg += `${idx + 1}.${el}\n`;
      });
      msg += '';
      APP.show_error(msg, APP._('VALIDATION.VALIDATION_ERRORS'));
    }
  };

  const onBackStep = async () => {
    // stepperRef.current.previous();
    setStep((p) => p - 1);
  };

  const loadEngagementEntryData = async (
    engagement_name: string,
    entry: string,
  ) => {
    EngagementService.get_engagement_entry_record(entry).then((data) => {
      // docs.value = data
      setDocs(data);
      EngagementStore.set_survey_engagement_entry_data(engagement_name, data);
      setLoading(false);
    });
  };

  // useEffect(() => {

  //   dispatch(addSurveyData(docs));
  // }, [docs]);

  const refreshContentForTemplate = () => {
    let contents = [];
    for (let i = 0; i < engagementTemplate?.items?.length; i++) {
      let form = engagementTemplate.items[i];
      contents.push(
        <DocForm
          doctype={form.doctype_item}
          docname={
            docs
              ? docs[form.doctype_item]
                ? docs[form.doctype_item].name
                : null
              : null
          }
          doc={
            docs
              ? docs[form.doctype_item]
                ? docs[form.doctype_item]
                : null
              : null
          }
          showSaveButton={false}
          // ref={(el) => (form_refs['form'+form.idx] = el)}
          ref={setRef(`form${form.idx}`)}
        />,
      );
    }
    setContent(contents);
    return contents;
  };

  useEffect(() => {
    const refresh_content = async () => {
      let contents = [];
      // for (let i = 0; i < engagementTemplate?.items?.length; i++) {
      let form: string | undefined = engagement?.engagement_form; // engagementTemplate.items[i];

      if (form) {
        const engagement_form =
          (await EngagementFormService.get_engagement_form(
            form,
          )) as EngagementForm;

        if (!engagement_form.anonymous) {
          contents.push(
            <ProtectedRoute>
              <DocForm
                doctype={form}
                docname={
                  docs ? (docs[form] ? docs[form].name : undefined) : undefined
                }
                doc={docs ? (docs[form] ? docs[form] : undefined) : undefined}
                showSaveButton={false}
                // ref={(el) => (form_refs['form'+form.idx] = el)}
                ref={setRef(`form${1}`)}
                extraData={{
                  fields: engagement_form.form_fields,
                }}
              />
            </ProtectedRoute>,
          );
        } else {
          contents.push(
            <DocForm
              doctype={form}
              docname={
                docs ? (docs[form] ? docs[form].name : undefined) : undefined
              }
              doc={docs ? (docs[form] ? docs[form] : undefined) : undefined}
              showSaveButton={false}
              // ref={(el) => (form_refs['form'+form.idx] = el)}
              ref={setRef(`form${1}`)}
              extraData={{
                fields: engagement_form.form_fields,
              }}
            />,
          );
        }
      }
      // }
      setContent(contents);
      return contents;
    };
    refresh_content();
  }, [docs, engagement, setRef]);

  useEffect(() => {
    const load = async () => {
      await dispatch(getEngagement(props.engagement));
    };
    load();
    /*
    new DocTypeService('Engagement').get_doc(props.engagement).then((d) => {
      //engagement.value = d
      setEngagement(d);
      if (d.has_data_forms) {
        // If is structured survey, get the Engagement Template
        new DocTypeService('Engagement Template')
          .get_doc(d.data_forms_template)
          .then((t) => {
            //engagementTemplate.value = t
            setEngagementTemplate(t);
          })
          .then(() => {
            check_draft_records(d);
          });
      } else {
        check_draft_records(d);
      }
    });*/
  }, [dispatch, props.engagement, props.engagementEntry]);

  useEffect(() => {
    const check_draft_records = async () => {
      if (!engagement) {
        return;
      }
      //check if its not a new selection
      if (!UIUtil.isNewRecord(props.engagementEntry)) {
        // load entry data
        await loadEngagementEntryData(engagement.name, props.engagementEntry);
        return;
      }
      // If its a new entry, check if there is another draft
      let records = await EngagementService.getDraftEngagementEntries(
        engagement.name,
      );

      if (records?.length > 0) {
        APP.confirm(
          'There is a draft record. Do you want to open it?',
          '',
          () => {
            //load draft record
            setDocs((prev_state) => {
              let dcs = Object.assign({}, prev_state);
              dcs[`${DOCTYPES.ENGAGEMENT_ENTRY}`] = records[0];
              return { dcs };
            });
            //docs[`${DOCTYPES.ENGAGEMENT_ENTRY}`] = records[0];
            EngagementStore.set_survey_form_data(
              engagement.name,
              `${DOCTYPES.ENGAGEMENT_ENTRY}`,
              records[0],
            );
            EngagementService.get_engagement_entry_record(records[0].name).then(
              (data) => {
                //docs.value = data
                setDocs(data);
                EngagementStore.set_survey_engagement_entry_data(
                  engagement.name,
                  data,
                );
                //loading.value = false
                setLoading(false);
              },
            );
          },
          () => {
            //discard draft record
            EngagementService.discard_draft_engagement_entry(records[0].name);
            // loading.value = false
            setLoading(false);
          },
        );
      } else {
        // loading.value = false
        setLoading(false);
      }
    };

    check_draft_records();
  }, [engagement, props.engagement, props.engagementEntry]);

  useFocusEffect(
    React.useCallback(() => {
      setKey(APP.generate_random_string());

      return () => {
        setKey(null);
      };
    }, []),
  );

  useEffect(() => {
    /**Do this to ensure forms are reloaded and redrawn */
    navigation.addListener('focus', () => {
      console.log('Reloaded screen');
    });
  }, [navigation]);

  useEffect(() => {
    dispatch(setEngagementEntryLoading(false));
  }, [dispatch]);

  return (
    <View key={key}>
      <Stepper
        active={step}
        buttonStyle={styles.buttons}
        stepStyle={styles.step}
        content={content}
        onBack={() => {
          onBackStep();
          //setStep((p) => p - 1);
        }}
        onNext={() => {
          onNextStep();
          //setStep((p) => p + 1);
        }}
        onFinish={() => {
          if (!isLoading) {
            setIsSaving(true);
            onNextStep();
            setIsSaving(false);
          }
          // APP.alert("Finish");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    backgroundColor: theme.colors.tertiary,
    marginLeft: 20,
    borderRadius: 5,
    height: 40,
  },
  step: {
    backgroundColor: theme.colors.secondary,
  },
});
