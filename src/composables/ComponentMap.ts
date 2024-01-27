import { defineAsyncComponent } from 'vue';

export const useComponentMap = () => {
  const componentMap = {
    //Images
    Attach: defineAsyncComponent(() => import('components/base/controls/AttachFileField.vue')),
    'Attach Image': defineAsyncComponent(() => import('components/base/controls/AttachImageField.vue')),
    //Image: defineAsyncComponent(() => import('components/base/controls/ImageViewer.vue')),
    
    // general
    Button: defineAsyncComponent(() => import('components/base/Button.vue')),
    Check: defineAsyncComponent(() => import('components/base/controls/CheckBox.vue')),

    //date
    Date: defineAsyncComponent(() => import('components/base/controls/DateField.vue')),
    Datetime: defineAsyncComponent(() => import('components/base/controls/DateTimeField.vue')),
    Time: defineAsyncComponent(() => import('components/base/controls/Time.vue')),      

    //numeric
    Currency: defineAsyncComponent(() => import('components/base/controls/Currency.vue')),
    Float: defineAsyncComponent(() => import('components/base/controls/Float.vue')),
    Int: defineAsyncComponent(() => import('components/base/controls/Int.vue')),
    Password: defineAsyncComponent(() => import('components/base/controls/Password.vue')),   
    Phone: defineAsyncComponent(() => import('components/base/controls/Phone.vue')),   

    //drop downs
    Link: defineAsyncComponent(() => import('components/base/controls/Link.vue')),
    Select: defineAsyncComponent(
      () => import('components/base/controls/Select.vue')
    ), 

    //text
    Data: defineAsyncComponent(() => import('components/base/controls/Data.vue')),
    'HTML Editor': defineAsyncComponent(() => import('components/base/controls/TextEditorField.vue')),
    'Small Text': defineAsyncComponent(
      () => import('components/base/controls/SmallText.vue')
    ), 
    'Long Text': defineAsyncComponent(
      () => import('components/base/controls/LongText.vue')
    ), 
    Text: defineAsyncComponent(() => import('components/base/controls/Text.vue')),
    'Text Editor': defineAsyncComponent(() => import('components/base/controls/TextEditorField.vue')),
     //text
    Table: defineAsyncComponent(() => import('components/base/controls/ChildTable.vue')),
  };
  return { componentMap };
};
