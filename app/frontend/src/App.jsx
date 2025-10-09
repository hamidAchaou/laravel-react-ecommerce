import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authThunks";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();
  const { loading, user, isAuthenticated } = useSelector((state) => state.auth);

  // ✅ Only fetch if token exists and user not loaded
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token && !user && isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user, isAuthenticated]);

  // ✅ Show loading ONLY when checking auth on initial load
  if (loading && !user && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading user...</div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;