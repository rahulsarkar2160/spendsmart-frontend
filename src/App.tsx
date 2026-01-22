import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setCredentials, setAuthReady } from "./features/auth/authSlice";


import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./api/axiosInstance";



function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      dispatch(setAuthReady());
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");

        dispatch(
          setCredentials({
            token,
            user: res.data, // axios response data
          })
        );
      } catch (err) {
        console.error("Auth hydration failed:", err);
        dispatch(setAuthReady());
      }
    };

    fetchMe();
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
