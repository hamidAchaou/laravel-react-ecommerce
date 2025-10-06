// frontend/src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* <AuthProvider> */}
        <Provider store={store}>
          <App />
        </Provider>
      {/* </AuthProvider> */}
    </BrowserRouter>
  </StrictMode>
);
