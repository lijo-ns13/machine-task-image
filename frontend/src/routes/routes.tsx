import { Routes, Route } from "react-router-dom";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import Protected from "./Protected";
import HomePage from "../pages/HomePage";

const UserRoutes = () => {
  return (
    <Routes>
      {/* user auth pages */}

      <Route path="signin" element={<SignInPage />} />
      <Route path="signup" element={<SignUpPage />} />

      <Route
        path="home"
        element={
          <Protected>
            <HomePage />
          </Protected>
        }
      />

      {/* <Route path="*" element={<NotFoundPage />} /> */}
      {/* if same user hten his profile page if others username then there profile page just viewable not editable and also admin,company,users can view that rightnow i protexted with one orle */}
    </Routes>
  );
};
export default UserRoutes;
