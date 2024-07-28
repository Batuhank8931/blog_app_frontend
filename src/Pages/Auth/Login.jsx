import { useContext, useState } from 'react';
import eyeIcon from '../../assets/icons/eye-off.png';  // Adjust the path as necessary
import eyeOffIcon from '../../assets/icons/eye.png';  // Adjust the path as necessary
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';


function Login() {

	// const { token, setToken } = useContext(Context)

	const { setToken } = useContext(Context)
	const navigate = useNavigate()

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const [showPassword, setShowPassword] = useState(false);

	const [errors, setErrors] = useState({});

	async function handleLogin(e) {
		e.preventDefault();

		const res = await fetch('/api/login', {
			method: 'post',
			body: JSON.stringify(formData),

		})

		const data = await res.json()

		//console.log(data);

		if (data.errors) {
			setErrors(data.errors)
		} else {
			localStorage.setItem('token', data.token);
			navigate("/");
			setToken(data.token)
			//console.log(data);
		}
	}

	return (
		<div className="flex justify-center items-start min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
				<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>
				<form onSubmit={handleLogin} className="space-y-4">
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
						{errors?.email && (
							<motion.p
								className='text-red-500 mb-2'
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								{errors.email[0]}
							</motion.p>
						)}
						<input
							type="email"
							name="email"
							id="email"
							placeholder="Email"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						/>
					</div>
					<div className="mb-4 relative">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
						{errors?.password && (
							<motion.p
								className='text-red-500 mb-2'
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								{errors.password[0]}
							</motion.p>
						)}
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							id="password"
							placeholder="Password"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						/>
						<span className="absolute inset-y-0 right-0 pr-3 flex items-end pb-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
							<img src={showPassword ? eyeOffIcon : eyeIcon} alt="Toggle Password Visibility" className="h-6 w-6" />
						</span>
					</div>
					<div>
						<button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
