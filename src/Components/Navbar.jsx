import { getAuth } from 'firebase/auth';
import React from 'react';
import { useUserContext } from '../context/userContext';
import logo from '../Images/logo_.png';
import { AiOutlineLogout } from 'react-icons/ai';

const auth = getAuth();

export default function Navbar() {
	const { userLoggedOut, user } = useUserContext();

	return (
		<div className="flex z-[1000] flex-wrap py-2 px-7 md:px-5 flex-col md:flex-row items-center shadow w-full bg-white">
			<div className="inline-flex items-center justify-between w-full">
				<div className=" flex items-center cursor-pointer ">
					<img src={logo} className="h-14 md:h-12 " alt="logo" />
					<p className="text-black text-xl md:text-base md:text-center ml-5 font-bold">
						Indian Institute Of Technology Jodhpur Voting Portal
					</p>
				</div>
				<div className="flex justify-self-end items-center">
					<p className="mx-1 text-base duration-300 hover:underline font-bold text-black ">
						{user?.email}
					</p>
					{user && (
						<button
							onClick={() => {
								userLoggedOut();
								auth?.logout();
							}}
							className=" mx-2 md:mr-0 px-2 py-2 rounded-lg bg-primary duration-300 shadow-lg hover:bg-primary_dark text-base font-bold text-white"
						>
							<span className="md:hidden ">Logout</span>
              <AiOutlineLogout className="hidden md:block text-xl font-bold " />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
