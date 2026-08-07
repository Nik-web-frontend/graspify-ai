import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import './dashboard.css'

function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <Sidebar />
        <MainContent />
      </div>
    </>
  );
}

export default Dashboard;