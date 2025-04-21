import { useState } from "react";
import { 
  Settings, 
  User, 
  LogOut, 
  // MessageSquare, 
  Briefcase, 
  // LayoutDashboard, 
  FileText, 
  PlusCircle, 
  HelpCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import PostJobForm from "./PostJobForm";
import ATSReports from "./ATSReports"; // Import the ATS Reports component
import JobListings from "./JobListing"; // Import the JobListings component

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
    setActiveSection("post-job"); // Switch to post job form for editing
  };

  // Handle job saved (both new and edit)
  const handleJobSaved = () => {
    setJobToEdit(null); // Clear the job being edited
    setActiveSection("jobs"); // Go back to job listings after saving
  };

  // Function to render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "applications":
        return <div className="content">📂 Applications Section</div>;
      case "chat":
        return <div className="content">💬 Chat Interface</div>;
      case "jobs":
        return <JobListings onEditJob={handleEditJob} />;
      case "reports":
        return <ATSReports />; // Render our ATS Reports component
      case "post-job":
        return <PostJobForm jobToEdit={jobToEdit} onJobSaved={handleJobSaved} />;
      default:
        return <div className="content empty">Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          {activeSection === "settings" ? (
            // Profile Icon with Dropdown
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
          {/* Sidebar Navigation */}
          {/* <button 
            className={`nav-button ${activeSection === "chat" ? "active" : ""}`} 
            onClick={() => setActiveSection("chat")}
          >
            <MessageSquare className="icon" />
            <span className="nav-label">Messages</span>
          </button> */}
          
          <button 
            className={`nav-button ${activeSection === "jobs" ? "active" : ""}`} 
            onClick={() => {
              setJobToEdit(null); // Clear any job being edited
              setActiveSection("jobs");
            }}
          >
            <Briefcase className="icon" />
            <span className="nav-label">Jobs</span>
          </button>
          
          {/* <button 
            className={`nav-button ${activeSection === "dashboard" ? "active" : ""}`} 
            onClick={() => setActiveSection("dashboard")}
          >
            <LayoutDashboard className="icon" />
            <span className="nav-label">Dashboard</span>
          </button> */}
          
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
              setJobToEdit(null); // Clear any job being edited when posting a new job
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