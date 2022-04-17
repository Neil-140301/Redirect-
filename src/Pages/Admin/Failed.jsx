// @ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiRefreshCw } from 'react-icons/fi';
import { BsSearch } from 'react-icons/bs';

const Failed = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchUid, setSearchUid] = useState('');

	const getFailedUsers = useCallback(async () => {
		setLoading(true);
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};

		try {
			const data = await fetch(
				'https://voting.prometeo.in/fails',
				requestOptions
			).then((r) => r.json());

			const users = data.result.filter((i) => !i.bypass);

			setUsers(users);
			setLoading(false);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	function bypassUser(uid) {
		console.log('Bypass User: ', uid);

		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const obj = {
			voter: uid,
			id: '1234',
		};

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(obj),
			redirect: 'follow',
		};

		fetch('https://voting.prometeo.in/add_bypass', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success', result);
				if (result.status) {
					// getCandidates();
					// closeBypassModal();
					getFailedUsers();
				}
			})
			.catch((error) => console.log('error', error));
	}

	const searchUser = () => {
		const filteredUsers = users.filter((i) => i.id == searchUid);
		setUsers(filteredUsers);
		setSearchUid('');
	};

	useEffect(() => {
		getFailedUsers();
	}, [getFailedUsers]);

	const SearchBar = () => {
		return (
			<div className="flex items-center space-x-4">
				<div className="flex item-center space-x-4 bg-white px-4 py-2 rounded ">
					<BsSearch />
					<input
						className="bg-transparent p-2 outline-none  "
						value={searchUid}
						type="text"
						onChange={(e) => setSearchUid(e.target.value)}
						placeholder="Search a UID"
					/>
				</div>
				<button
					onClick={searchUser}
					className="shadow flex items-center p-2 rounded bg-teal-400 text-white font-bold tracking-wide "
				>
					Search
				</button>
				<button
					onClick={() => getFailedUsers()}
					className="shadow flex items-center p-2 rounded bg-teal-400 text-white font-bold tracking-wide "
				>
					Reset
				</button>
			</div>
		);
	};

	const UserTable = useCallback(() => {
		return (
			<TableContainer className="my-6 " sx={{ width: '90%' }} component={Paper}>
				<Table sx={{ width: 1 }}>
					<TableHead>
						<TableRow>
							<TableCell>User UID</TableCell>
							<TableCell sx={{ flexGrow: 1 }}>Images</TableCell>
							<TableCell />
							<TableCell />
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((i) => (
							<TableRow
								key={i?._id['$oid']}
								// sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									<span className="text-lg font-semibold text-center ">
										{i?.id}
									</span>
								</TableCell>
								{i?.file2 && (
									<TableCell>
										<img
											src={i?.file2}
											alt=""
											className="w-[100px] h-[100px] rounded shadow "
										/>
									</TableCell>
								)}
								{i?.file1 ? (
									<TableCell>
										<img
											src={i?.file1}
											alt=""
											className="w-[100px] h-[100px] rounded shadow "
										/>
									</TableCell>
								) : (
									<TableCell />
								)}
								{i?.file3 ? (
									<TableCell>
										<img
											src={i?.file3}
											alt=""
											className="w-[100px] h-[100px] rounded shadow "
										/>
									</TableCell>
								) : (
									<TableCell />
								)}
								<TableCell>
									<button
										onClick={() => bypassUser(i?.id)}
										className="shadow flex items-center p-2 rounded bg-teal-400 text-white font-bold tracking-wide "
									>
										Bypass
									</button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	}, [users]);

	return (
		<div className="flex flex-col items-center bg-bg h-screen font-[Roboto] p-10  ">
			<p className="text-3xl font-semibold tracking-wide self-start ">
				Users - Failed in Voting
			</p>
			{loading ? (
				<div className="h-1/2 w-full my-8 flex flex-col justify-center items-center space-y-8 ">
					<FiRefreshCw className="animate-spin  " size={60} />
					<span className="text-2xl font-[Roboto] tracking-wide ">
						Fetching...
					</span>
				</div>
			) : (
				<>
					<SearchBar />
					<UserTable />
				</>
			)}
		</div>
	);
};

export default Failed;
