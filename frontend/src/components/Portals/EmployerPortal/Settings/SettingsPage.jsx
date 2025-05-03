import { useState } from "react";
import { 
  Settings, 
  User, 
  LogOut, 
  Briefcase, 
  FileText, 
  PlusCircle, 
  HelpCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import PostJobForm from "./PostJobForm";
import ATSReports from "./ATSReports";
import JobListings from "./JobListing"; 

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    navigate("/employer-portal");
  };

  // Handle job edit
  const handleEditJob = (job) => {
    setJobToEdit(job);
    setActiveSection("post-job"); 
  };

  const handleJobSaved = () => {
    setJobToEdit(null); 
    setActiveSection("jobs"); 
  };

  const renderContent = () => {
    switch (activeSection) {
      case "applications":
        return <div className="content">📂 Applications Section</div>;
      case "chat":
        return <div className="content">💬 Chat Interface</div>;
      case "jobs":
        return <JobListings onEditJob={handleEditJob} />;
      case "reports":
        return <ATSReports />; 
      case "post-job":
        return <PostJobForm jobToEdit={jobToEdit} onJobSaved={handleJobSaved} />;
      default:
        return <div className="content empty">Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="settings-container">
      <aside className="sidebar">
        <div className="sidebar-top">
          {activeSection === "settings" ? (
            <div className="profile-container">
              <User 
                className="icon profile-icon" 
                onClick={() => setShowProfileMenu(!showProfileMenu)} 
              />
              {showProfileMenu && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Settings Icon
            <Settings 
              className={`icon ${activeSection === "settings" ? "active" : ""}`} 
              onClick={() => setActiveSection("settings")} 
            />
          )}
        </div>

        <div className="sidebar-nav">          
          <button 
            className={`nav-button ${activeSection === "jobs" ? "active" : ""}`} 
            onClick={() => {
              setJobToEdit(null); 
              setActiveSection("jobs");
            }}
          >
            <Briefcase className="icon" />
            <span className="nav-label">Jobs</span>
          </button>          
          <button 
            className={`nav-button ${activeSection === "reports" ? "active" : ""}`} 
            onClick={() => setActiveSection("reports")}
          >
            <FileText className="icon" />
            <span className="nav-label">ATS Reports</span>
          </button>
          
          <button 
            className={`nav-button ${activeSection === "post-job" ? "active" : ""}`} 
            onClick={() => {
              setJobToEdit(null); 
              setActiveSection("post-job");
            }}
          >
            <PlusCircle className="icon" />
            <span className="nav-label">Post Job</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}

        {/* Floating Help Icon */}
        <button className="help-button">
          <HelpCircle size={28} />
        </button>
      </main>
    </div>
  );
};

export default SettingsPage;