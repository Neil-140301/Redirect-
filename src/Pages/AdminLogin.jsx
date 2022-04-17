import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import logo from '../Images/bg_image.jpeg';
import { FaUserGraduate, FaUserLock } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';
import { useUserContext } from '../context/userContext';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const AdminLogin = () => {
	const { userLoggedIn } = useUserContext();
	const provider = new GoogleAuthProvider();
	const auth = getAuth();
	provider.addScope('https://www.googleapis.com/auth/userinfo.profile ');
	provider.setCustomParameters({
		hd: 'iitj.ac.in',
	});

	const getAdminStatus = async (user) => {
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify({ id: user?.uid }),
			redirect: 'follow',
		};

		try {
			const { is_admin } = await fetch(
				'https://voting.prometeo.in/is_admin',
				requestOptions
			).then((response) => response.json());

			return is_admin;
		} catch (error) {
			console.log(error);
		}
	};

	const login = () => {
		signInWithPopup(auth, provider)
			.then(async (result) => {
				const is_admin = await getAdminStatus(result.user);

				userLoggedIn({ ...result.user, is_admin });
			})
			.catch((error) => {
				console.error(error);
				alert(error.message);
			});
	};

	return (
		<div className="h-screen flex flex-col justify-center items-center font-[Roboto] ">
			{
				// eslint-disable-next-line jsx-a11y/img-redundant-alt
				<img
					src={logo}
					className="w-screen h-screen absolute -z-10 object-cover "
					alt="login-bg-image"
				/>
			}
			<div className="bg-white p-8 rounded-md shadow shadow-teal-100 w-[45%] max-w-[480px]  ">
				<h1 className="text-[30px] font-semibold mb-4 text-center ">
					General Body Elections
				</h1>
				{/* <h1 className="text-2xl font-semibold ">Login</h1> */}
				<div className="my-6 flex items-center justify-around ">
					<button
						onClick={login}
						className="p-4 rounded text-xl tracking-wide shadow-sm bg-teal-500 text-white  flex items-center hover:bg-[#2B8DBF] "
					>
						<RiAdminFill className="mr-3 " />
						<span>Admin Login</span>
					</button>
					{/* <button className="p-4 rounded text-xl tracking-wide shadow-sm border-2 border-teal-400 flex items-center hover:bg-gray-100 ">
						<FaUserLock className="mr-3 " />
						<span>Admin</span>
					</button> */}
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
