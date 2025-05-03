import { Routes, Route } from 'react-router-dom';
import CNavbar from './CNavbar/CNavbar';
import YourActivity from './YourActivity/YourActivity';
import CPortalPage from './CPortalPage/CPortalPage';
import ProfilePage from './ProfilePage/ProfilePage';

function CandidateApp() {
  return (
    <div>
      <CNavbar /> 
      <Routes>
        <Route path="/" element={<CPortalPage />} />
        <Route path="/activity" element={<YourActivity />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default CandidateApp;
