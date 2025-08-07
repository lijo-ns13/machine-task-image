import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useEffect } from "react";

function LandPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      navigate("/signin");
    }
  }, []);
  return <div></div>;
}

export default LandPage;
