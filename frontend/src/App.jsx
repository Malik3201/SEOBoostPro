import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AuditResult from './pages/AuditResult';
import SeoServices from './pages/SeoServices';
import SeoProgress from './pages/SeoProgress';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminList from './pages/admin/AdminList';
import AdminContracts from './pages/admin/AdminContracts';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/audit/:id" element={<AuditResult />} />
            <Route path="/services/boost" element={<SeoServices />} />
            <Route path="/services/progress" element={<SeoProgress />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/list" element={<AdminList />} />
            <Route path="/admin/contracts" element={<AdminContracts />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
