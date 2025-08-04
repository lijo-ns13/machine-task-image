import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  redirectPath?: string;
}

const Protected = ({
  children,
  redirectPath = "/signin",
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default Protected;
