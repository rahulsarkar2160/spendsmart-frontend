import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">SpendSmart</h1>

            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-sm text-gray-600">
                        {user.name} ({user.email})
                    </span>
                )}

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
