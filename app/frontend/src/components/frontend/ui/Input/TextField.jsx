import React from "react";
import AppInput from "./AppInput";

const TextField = (props) => <AppInput type="text" {...props} />;

export default React.memo(TextField);
