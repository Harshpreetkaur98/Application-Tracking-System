import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import ScanCvPage from "./components/ScanCV/ScanCvPage";
import Login from "./components/Login/Login";
// import AdminLogin from "./components/Portals/AdminPortal/APortalPage/APortalPage";
// import CandidateLogin from "./components/Portals/CandidatePortal/CPortalPage/CPortalPage";
import EmployerApp from "./components/Portals/EmployerPortal/EmployerApp";
import CandidateApp from "./components/Portals/CandidatePortal/CandidateApp";
import SignUp from "./components/SignUp/SignUp";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ScanCV" element={<ScanCvPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Employer-Portal/*" element={<EmployerApp />} />
        <Route path="/Candidate-Portal/*" element={<CandidateApp />} />
        {/* <Route path="/Candidate-Portal" element={<CandidateLogin />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
