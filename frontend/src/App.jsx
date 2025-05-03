import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/Login/Login";
import EmployerApp from "./components/Portals/EmployerPortal/EmployerApp";
import CandidateApp from "./components/Portals/CandidatePortal/CandidateApp";
import SignUp from "./components/SignUp/SignUp";
import Footer from "./components/Footer/Footer";
import HowToUse from "./components/HowToUse/HowToUse";
import CvScanner from "./components/ScanCV/CvScanner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cv-scanner" element={<CvScanner />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/Employer-Portal/*" element={<EmployerApp />} />
        <Route path="/Candidate-Portal/*" element={<CandidateApp />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
