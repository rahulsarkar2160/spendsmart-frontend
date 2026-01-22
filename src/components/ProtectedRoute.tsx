import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

type ProtectedRouteProps = {
    children: React.ReactNode;
    role?: "ADMIN" | "USER";
};

export default function ProtectedRoute({
    children,
    role,
}: ProtectedRouteProps) {
    const { token, user, loading } = useAppSelector(
        (state) => state.auth
    );

    // ⏳ WAIT until auth state is resolved
    if (loading) {
        return <div className="p-6">Checking permissions...</div>;
    }

    // ❌ Not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // ❌ Logged in but wrong role
    if (role && user?.role !== role) {
        return <Navigate to="/dashboard" replace />;
    }

    // ✅ Allowed
    return <>{children}</>;
}
