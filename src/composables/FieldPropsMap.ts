import { defineAsyncComponent } from 'vue';
export const useFieldPropsMap = () => {
  const propsMap = {
    hidden: true,
    Select: defineAsyncComponent(
      () => import('components/base/form/Select.vue')
    ),
  };
  return {
    propsMap,
  };
};
