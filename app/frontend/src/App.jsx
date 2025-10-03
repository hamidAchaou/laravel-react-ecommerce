// frontend/src/App.jsx
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      {/* Global SEO metadata */}
      <title>My E-commerce App</title>
      <meta
        name="description"
        content="Best E-commerce App with React, TailwindCSS, and Clean Architecture."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Centralized Routes */}
      <AppRoutes />
    </>
  );
}

export default App;
