import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authThunks";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // if (loading) return <div className="p-6 text-center">Loading user...</div>;

  return <AppRoutes />;
}

export default App;
