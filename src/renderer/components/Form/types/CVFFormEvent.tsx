import React from 'react';

export type CVFFormEvent =
  | React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  | React.SyntheticEvent<any>;
