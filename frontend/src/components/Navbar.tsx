import { useAppDispatch } from "../hooks/useAppDispatch";

import { useNavigate } from "react-router-dom";
import { logout } from "../store/slice/authSlice";
import { Logout } from "../services/authService";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Logout();
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Image App</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
