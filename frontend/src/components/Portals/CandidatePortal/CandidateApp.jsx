import { Routes, Route } from "react-router-dom";
import CandidateDashboard from "./CPortalPage/CPortalPage";

const CandidateApp = () => {
  return (
    <div className="bg-[#1E1E1E] min-h-screen text-white">
      <div className="container mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<CandidateDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default CandidateApp;
