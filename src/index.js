import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './context/userContext';
import { VerifiedProvider } from './context/verifiedContext';
import { VoterProvider } from './context/voterContext';

ReactDOM.render(
	<React.StrictMode>
		<UserProvider>
			<VerifiedProvider>
				<VoterProvider>
					<App />
				</VoterProvider>
			</VerifiedProvider>
		</UserProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
