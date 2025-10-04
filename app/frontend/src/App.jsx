// frontend/src/App.jsx
import { useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center">Loading user...</div>;
  }

  return (
    <>
      <title>My E-commerce App</title>
      <AppRoutes />
    </>
  );
}

export default App;
