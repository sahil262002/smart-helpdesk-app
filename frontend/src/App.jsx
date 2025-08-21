import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TicketListPage from './pages/TicketListPage.jsx';
import TicketDetailPage from './pages/TicketDetailPage.jsx';
import NewTicketPage from './pages/NewTicketPage.jsx';
import KbAdminPage from './pages/KbAdminPage.jsx';
import SettingsAdminPage from './pages/SettingsAdminPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Notifier from './components/Notifier.jsx';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <Notifier />
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<TicketListPage />} />
              <Route path="/tickets/new" element={<NewTicketPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin/kb" element={<KbAdminPage />} />
              <Route path="/admin/settings" element={<SettingsAdminPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;