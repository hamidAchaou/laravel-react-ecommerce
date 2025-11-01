// app/frontend/src/components/frontend/ui/Button/SecondaryButton.jsx
import React from 'react';
import AppButton from './AppButton';

const SecondaryButton = React.forwardRef((props, ref) => (
  <AppButton ref={ref} variant="secondary" {...props} />
));

SecondaryButton.displayName = 'SecondaryButton';

export default SecondaryButton;