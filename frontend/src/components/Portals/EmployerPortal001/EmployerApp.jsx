import { Routes, Route } from "react-router-dom";
import EmployerNavbar from "./ENavbar/ENavbar";
import EmployerDashboard from "./EPortalPage/EPortalPage";
// import SettingsPage from "./Settings/SettingsPage";

const EmployerApp = () => {
  return (
    <div className="bg-[#1E1E1E] min-h-screen text-white">
      <EmployerNavbar />
      <div className="container mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<EmployerDashboard />} />
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default EmployerApp;
