// CURRENTLY NOT USED

import React from 'react';

/*
  <FormErrors forField="title" errors={errors} />
*/

function FormErrors (props) {
  const { forField, errors = [] } = props;

  let filteredErrors;
  if (forField) {
    filteredErrors = errors.filter(
      e => e.field.toLowerCase() === forField.toLowerCase()
    )
  } else {
    filteredErrors = errors;
  }

  if (filteredErrors.length > 0) {
    return (
      <ul className="FormErrors">
        {
          filteredErrors.map(
            (e, i) => <li key={i}>{e.message}</li>
          )
        }
      </ul>
    )
  } else {
    return null;
  }
}

export default FormErrors;
