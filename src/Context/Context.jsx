import { createContext, useEffect, useState } from "react";

export const Context = createContext()

export default function Provider({ children }) {

	const [token, setToken] = useState(localStorage.getItem('token'))

	const [user, setUser] = useState(null);

	async function getUser() {
		const res = await fetch('/api/user', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await res.json();

		if (res.ok) {
			setUser(data);
		}

		//console.log(data);
	}


	useEffect(() => {
		if (token) {
			getUser();
		}
	}, [token]);



	return (
		<Context.Provider value={{ token, setToken, user, setUser }}>
			{children}
		</Context.Provider>
	);
}

