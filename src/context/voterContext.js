import { createContext, useContext, useState } from 'react';

const VoterContext = createContext();

export const useVoterContext = () => {
	return useContext(VoterContext);
};

export const VoterProvider = ({ children }) => {
	const [voted, setVoted] = useState(false);
	const [preRegistered, setPreRegistered] = useState(false);

	return (
		<VoterContext.Provider
			value={{ voted, preRegistered, setPreRegistered, setVoted }}
		>
			{children}
		</VoterContext.Provider>
	);
};
