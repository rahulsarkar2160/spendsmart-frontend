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
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center space-y-2">
                    <h2 className="text-lg font-semibold">
                        Waking up the server…
                    </h2>
                    <p className="text-sm text-gray-600">
                        This project is hosted on a free tier.
                    </p>
                    <p className="text-sm text-gray-600">
                        The backend may take up to{" "}
                        <span className="font-medium">30–60 seconds</span> on first load.
                    </p>
                    <p className="text-sm text-gray-500">
                        Please wait while permissions are being verified 🙂
                    </p>
                </div>
            </div>
        );
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
