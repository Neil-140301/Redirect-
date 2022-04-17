// @ts-nocheck
import './index.css';
import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from 'react-router-dom';

import { useEffect } from 'react';

// * Pages
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import PreRegister from './Pages/PreRegister';
import VoterVerify from './Pages/VoterVerify';
import Voter from './Pages/Voter';
import AdminDashboard from './Pages/Admin/Dashboard';

// * Components
import Navbar from './Components/Navbar';

import { useUserContext } from './context/userContext';
import { useVoterContext } from './context/voterContext';
import AdminLogin from './Pages/AdminLogin';
import Failed from './Pages/Admin/Failed';

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

	useEffect(() => {
		window.location = 'https://iitj-voting.vercel.app/';
	}, []);

	return <div>Hi</div>;
}
export default App;
