import { useComponentMap } from './ComponentMap';

export const useFormGenerator = (doctype_def: Array) => {
  const fields = doctype_def.fields;

  const { componentMap } = useComponentMap();

  const generateForm = () => {
    return {};
  };
  return { generateForm };
};
