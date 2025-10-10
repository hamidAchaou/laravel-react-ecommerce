// src/components/forms/FormGroup.jsx
import React from "react";
import { Box } from "@mui/material";

const FormGroup = ({ children, gap = 2, direction = "column" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        gap,
        mb: 2,
      }}
    >
      {children}
    </Box>
  );
};

export default React.memo(FormGroup);
