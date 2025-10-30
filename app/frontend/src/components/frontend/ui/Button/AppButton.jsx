import React from 'react';
import AppButton from './AppButton';

const SecondaryButton = (props) => {
  return <AppButton variant="secondary" {...props} />;
};

export default React.memo(SecondaryButton);