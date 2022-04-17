//@ts-nocheck
import React, { useEffect, useState, Fragment } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { FaUserPlus, FaSpinner } from 'react-icons/fa';
import { GiVote } from 'react-icons/gi';
import { HiOutlineClipboardCopy } from 'react-icons/hi';
import logo from '../Images/bg_image.jpeg';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { app } from '../firebase';
import { getFirestore } from 'firebase/firestore/lite';

const db = getFirestore(app);
const auth = getAuth();

toast.configure();

function useForceUpdate() {
	const [value, setValue] = useState(0); // integer state
	return () => setValue((value) => value + 1); // update the state to force render
}

function Dashboard(props) {
	const [user, loading, error] = useAuthState(auth);
	const userData = user?.uid;
	const navigate = useNavigate();
	const forceUpdate = useForceUpdate();

	const [image, setImages] = useState('');
	const webcamRef = React.useRef(null);
	const [loading_, setLoading] = useState(false);
	const [electionData, setElectionData] = useState(null);
	const [boothStatus, setBoothStatus] = useState({
		is_polling: false,
		is_preRegistering: false,
	});
	// const {voter, preRegistered, setPreRegistered, setVoted} = useVoterContext();
	const [voter, setVoted] = useState(false);
	const [preRegistered, setPreRegistered] = useState(false);

	const captureImages = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		setImages(imageSrc);
	};

	async function copyTextToClipboard(text) {
		if ('clipboard' in navigator) {
			toast.success('UID Copied Successfully !', {
				autoClose: 2000,
				position: toast.POSITION.TOP_RIGHT,
			});
			// toast("UID Copied", { type: "success" });
			// toast.success("Lorem ipsum dolor");
			return await navigator.clipboard.writeText(text);
		} else {
			console.info(text);
			return document.execCommand('copy', true, text);
		}
	}

	const send = () => {
		//   Send these images to the flask api endpoint and get the response
		//   If the response is success, navigate to the voting section
		//   Else, show an error message
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const obj = {
			file: image,
			id: userData,
		};

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(obj),
			redirect: 'follow',
		};

		fetch('https://voting.prometeo.in/test', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				// console.log(result);
				if (result['face_found_in_image'] && result['is_matched']) {
					// console.log("User Biometric Success");
					navigate('/voter');
				} else {
					toast('User Biometric Failed', { autoClose: 3000, type: 'error' });
					setImages('');
				}
			})
			.catch((error) => console.log('error', error));
	};

	// const getElectionData = async () => {
	//   setLoading(true);
	//   const electionCol = collection(db, "elections");
	//   const elections = await getDocs(electionCol);
	//   // console.log(elections.docs[0].data());
	//   setElectionData(elections.docs[0].data());
	//   setLoading(false);
	// };

	const voterVerify = () => {
		navigate('/voterVerify');
	};

	const getVoterStatus = () => {
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const obj = {
			voter: userData,
		};

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(obj),
			redirect: 'follow',
		};

		fetch('https://voting.prometeo.in/voter_status', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				// console.log(result);
				setPreRegistered(result['preregistered']);
				setVoted(result['voted']);
			})
			.catch((error) => console.log('error', error));
	};

	// Get Dashboard Data
	function getElectionData() {
		setLoading(true);
		console.info('getElectionData');

		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};

		fetch('https://voting.prometeo.in/booth_status', requestOptions)
			.then((res) => res.json())
			.then(
				(result) => {
					// console.log('booth Data result.is_polling  :::::::::', result);
					let tempData = {
						is_polling: true,
						is_preRegistering: true,
					};
					tempData['is_polling'] = result['status'][0]['is_polling'];
					tempData['is_preRegistering'] =
						result['status'][0]['is_preRegistering'];
					setBoothStatus(tempData);
					setLoading(false);
					forceUpdate();
				},
				(error) => {
					console.log('error', error);
				}
			);
	}

	useEffect(() => {
		getElectionData();
		if (userData) {
			getVoterStatus();
		}
	}, [userData]);

	return (
		<>
			<div className="h-screen flex flex-col justify-center items-center font-[Roboto] ">
				<img
					src={logo}
					className="w-screen h-screen absolute -z-10 object-cover "
					alt="login-bg"
				/>
				<div className="bg-white p-8 md:p-6 rounded-md shadow shadow-teal-100 md:w-11/12  ">
					<h1 className="text-[30px] md:text-3xl font-semibold text-center ">
						General Body Elections
					</h1>
					{loading ? (
						<p className=" p-2 flex justify-center mt-6 md:mt-4  ">
							<FaSpinner className="animate-spin text-2xl " />
						</p>
					) : (
						<div className="my-6 md:my-5 flex md:flex-col md:space-y-4 items-center justify-around ">
							{boothStatus?.is_preRegistering && (
								<Link
									to="/preRegister"
									className={
										preRegistered
											? 'p-4 rounded-lg text-xl disabled-link tracking-wide shadow-sm bg-slate-300 border-2 flex items-center duration-300 hover:bg-primary_dark'
											: 'p-4 rounded-lg text-xl tracking-wide shadow-sm bg-teal-300 border-2 flex items-center duration-300 hover:bg-primary_dark'
									}
								>
									<FaUserPlus className="mr-3 " />
									<span>Pre Register</span>
								</Link>
							)}
							{boothStatus?.is_polling && (
								<button
									className={
										!voter && preRegistered
											? 'p-4 rounded duration-300 hover:border-primary_dark text-xl tracking-wide shadow-sm border-2 border-teal-400 flex items-center'
											: 'p-4 rounded duration-300 hover:border-primary_dark text-xl tracking-wide shadow-sm border-2 border-slate-300 flex bg-slate-300 items-center disabled-link'
									}
									onClick={voterVerify}
								>
									<GiVote className="mr-3" />
									<span>Vote</span>
								</button>
							)}
							{boothStatus?.is_polling === false &&
								boothStatus?.is_preRegistering === false && (
									<p className="text-xl font-semibold text-gray-400 ">
										Election has not started!
									</p>
								)}
						</div>
					)}
					{userData ? (
						<div className="flex p-4 md:p-2 items-center justify-center space-x-4 ">
							<p className="text-lg md:text-base font-semibold ">
								UID: {userData}
							</p>
							<button
								className="p-2 border-2 border-black rounded-lg"
								onClick={() => copyTextToClipboard(userData)}
							>
								<HiOutlineClipboardCopy className="text-[20px] md:text-lg " />
							</button>
						</div>
					) : (
						<p className="text-center text-2xl md:text-xl  ">Loading...</p>
					)}
				</div>
			</div>
			<ToastContainer />
		</>
	);
}
export default Dashboard;
