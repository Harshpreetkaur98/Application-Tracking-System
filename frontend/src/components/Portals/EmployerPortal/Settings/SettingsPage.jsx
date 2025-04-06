import { useState } from "react";
import { Settings, User, LogOut, MessageSquare, Briefcase, LayoutDashboard, FileText, PlusCircle, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // For redirection
import "./SettingsPage.css"; // Import CSS
import PostJobForm from "./PostJobForm";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Handle logout
  const handleLogout = () => {
    navigate("/employer-portal"); // Redirect to employer portal page
  };

  // Function to render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "applications":
        return <div className="content">📂 Applications Section</div>;
      case "chat":
        return <div className="content">💬 Chat Interface</div>;
      case "jobs":
        return <div className="content">🔍 Job Listings</div>;
      case "dashboard":
        return <div className="content">📊 Dashboard Analytics</div>;
      case "reports":
        return <div className="content">📑 ATS Reports</div>;
      case "post-job":
        return <PostJobForm />;
      default:
        return <div className="content empty">Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {activeSection === "settings" ? (
          // Profile Icon with Dropdown
          <div className="profile-container">
            <User className="icon profile-icon" onClick={() => setShowProfileMenu(!showProfileMenu)} />
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
          <Settings className="icon" onClick={() => setActiveSection("settings")} />
        )}

        {/* Sidebar Navigation */}
        <MessageSquare className="icon" onClick={() => setActiveSection("chat")} />
        <Briefcase className="icon" onClick={() => setActiveSection("jobs")} />
        <LayoutDashboard className="icon" onClick={() => setActiveSection("dashboard")} />
        <FileText className="icon" onClick={() => setActiveSection("reports")} />
        <PlusCircle className="icon" onClick={() => setActiveSection("post-job")} />
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
