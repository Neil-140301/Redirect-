import { useCallback, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiRefreshCw } from 'react-icons/fi';

const Failed = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

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
			setUsers(data.result);
			setLoading(false);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {
		getFailedUsers();
	}, [getFailedUsers]);

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
					<span className="text-2xl font-[Roboto] tracking-wide ">Fetching...</span>
				</div>
			) : (
				<UserTable />
			)}
		</div>
	);
};

export default Failed;
