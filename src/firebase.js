import { getAnalytics } from 'firebase/analytics';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
	apiKey: 'AIzaSyAHmCQusbtvEke_Z6F5NeSc8awk8Rd6A6Q',
	authDomain: 'iitj-vote.firebaseapp.com',
	projectId: 'iitj-vote',
	storageBucket: 'iitj-vote.appspot.com',
	messagingSenderId: '147315380328',
	appId: '1:147315380328:web:ee3b76d1a747e26859abdd',
	measurementId: 'G-GM65QQL6H0',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
