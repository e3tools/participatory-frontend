import React, { forwardRef } from 'react'
import UIGenerator from '../../../../ui-generator';
import { IDocFormProps } from '../../../../interfaces/ui';
import { APP } from 'common';

const DocForm = (props: IDocFormProps, ref) => { 
  const {
    doctype,
    docname,
    doc,
    isChildTable,
    showSaveButton = true,
    ...rest
  } = props;      

  // Setting key for child table causes the form to render endlessly. So do not do it
  return isChildTable ? (
    <UIGenerator
      //key={APP.generate_random_string()}
      doctype={doctype}
      docname={docname}
      doc={doc}
      isChildTable={isChildTable}
      showSaveButton={showSaveButton}
      ref={ref}
    />
  ) : (
    <UIGenerator
      key={APP.generate_random_string()}
      doctype={doctype}
      docname={docname}
      doc={doc}
      isChildTable={isChildTable}
      showSaveButton={showSaveButton}
      ref={ref}
    />
  );
}

export default forwardRef(DocForm);