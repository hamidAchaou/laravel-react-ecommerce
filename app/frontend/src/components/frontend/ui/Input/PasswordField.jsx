import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AppInput from "./AppInput";

const PasswordField = ({ label = "Password", ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <AppInput label={label} type={show ? "text" : "password"} {...props} />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default React.memo(PasswordField);
