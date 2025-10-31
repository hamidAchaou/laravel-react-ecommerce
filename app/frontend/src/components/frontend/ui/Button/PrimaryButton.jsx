import React from "react";
import AppButton from "./AppButton";

const PrimaryButton = (props) => <AppButton variant="primary" {...props} />;

export default React.memo(PrimaryButton);
