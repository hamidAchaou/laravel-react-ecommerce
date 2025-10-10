// src/App.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authThunks";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/common/Loader";

export default function App() {
  const dispatch = useDispatch();
  const { loading, user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  if (loading && !user && isAuthenticated) {
    return <Loader text="Loading your session..." fullscreen />;
  }

  return <AppRoutes />;
}
