// @ts-nocheck
import "./index.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// * Pages
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import PreRegister from "./Pages/PreRegister";
import VoterVerify from "./Pages/VoterVerify";
import Voter from "./Pages/Voter";
import AdminDashboard from "./Pages/Admin/Dashboard";

// * Components
import Navbar from "./Components/Navbar";

import { useUserContext } from "./context/userContext";
import { useVoterContext } from "./context/voterContext";
import AdminLogin from "./Pages/AdminLogin";
import Failed from "./Pages/Admin/Failed";

function App() {
  const { voted, preRegistered } = useVoterContext();
  const { user } = useUserContext();

  const ProtectedRoute = ({ children, login, verify, register }) => {
    if (!user && !login) {
      return <Navigate to="/" />;
    }

    if ((voted && verify) || (preRegistered && register) || (login && user)) {
      return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
  };

  const AdminProtectedRoute = ({ children, login }) => {
    if (user) {
      if (login) {
        return user?.is_admin ? (
          <Navigate to="/admin-dashboard" />
        ) : (
          <Navigate to="/dashboard" />
        );
      }
      return user?.is_admin ? <>{children}</> : <Navigate to="/dashboard" />;
    } else {
      if (login) {
        return <>{children}</>;
      }
      return <Navigate to="/admin" />;
    }
  };

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            exact
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/preRegister"
            element={
              <ProtectedRoute register>
                <PreRegister />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/voterVerify"
            element={
              <ProtectedRoute verify>
              <VoterVerify />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/voter"
            element={
              <ProtectedRoute>
              <Voter />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin"
            element={
              // <AdminProtectedRoute login>
              <AdminLogin />
              // </AdminProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin-dashboard"
            element={
              // <AdminProtectedRoute>
              <AdminDashboard />
              // </AdminProtectedRoute>
            }
          />
          <Route
            exact
            path="/failed"
            element={
              // <AdminProtectedRoute>
                <Failed />
              // </AdminProtectedRoute>
            }
          />
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute login>
                <Login />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
export default App;
