import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminLayout from "layouts/Admin.js";
import Operator from "layouts/Operator";
import AuthLayout from "layouts/Auth.js";
import Moderator from "layouts/Moderator";
import MainLogin from "views/examples/MainLogin";
import IpModal from "ui/IpChange";
const useTokenRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // useEffect(() => {
  //     console.log(location.pathname)
  //     if (location.pathname !== "/admin/design-template") {
  //         sessionStorage.clear();
  //     }
  // }, [location])
  // useEffect(() => {
  //   const backendIP = localStorage.getItem("backendIP");
  //   if (backendIP) {

  //   }
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.Role === "Operator") {
          if (location.pathname.includes("operator")) {
            navigate(location.pathname);
          } else {
            navigate("/operator/index", { replace: true });
          }
        } else if (decoded.Role === "Admin") {
          if (location.pathname.includes("admin")) {
            navigate(location.pathname);
          } else {
            navigate("/admin/index", { replace: true });
          }
        } else if (decoded.Role === "Moderator") {
          if (location.pathname.includes("moderator")) {
            navigate(location.pathname);
          } else {
            navigate("/moderator/index", { replace: true });
          }
        }
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/auth/login", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
      // navigate("/auth/login", { replace: true });
    }
  }, []);
};
const App = () => {
  const [showIpModal, setShowIpModal] = useState(false);

  useEffect(() => {
    const backendIP = sessionStorage.getItem("backendIP");
    if (!backendIP) {
      setShowIpModal(true); // Show the modal if no backend IP is set
    }
  }, []);

  const handleSaveIp = (ip) => {
    sessionStorage.setItem("backendIP", ip); // Save the IP to localStorage
    setTimeout(() => {
      window.location.reload(); // Reload the page
  }, 400);
  };
  useTokenRedirect();
  return (<>

    <IpModal
      show={showIpModal}
      onHide={() => setShowIpModal(false)}
      onSave={handleSaveIp}
    />
    <Routes>
      <Route path="/" element={<MainLogin />} />
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/operator/*" element={<Operator />} />
      <Route path="/moderator/*" element={<Moderator />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  </>

  );
};

export default App;
