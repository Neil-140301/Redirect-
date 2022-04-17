import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const userLoggedIn = (user) => {
		setUser(user);
		localStorage.setItem('iitj-voter', JSON.stringify(user));
	};

	const userLoggedOut = () => {
		setUser(null);
		localStorage.removeItem('iitj-voter');
	};

	useEffect(() => {
		const prevUser = localStorage.getItem('iitj-voter');

		if (prevUser) {
			setUser(JSON.parse(prevUser));
		}
	}, []);

	return (
		<UserContext.Provider value={{ user, userLoggedIn, userLoggedOut }}>
			{children}
		</UserContext.Provider>
	);
};
