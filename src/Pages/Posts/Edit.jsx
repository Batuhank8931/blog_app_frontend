import { useContext, useState, useEffect } from 'react';
import { Context } from '../../Context/Context';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const EditBlogPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { token } = useContext(Context);
	const [post, setPost] = useState(null);

	const postId = location.state?.id;

	async function getPost() {
		const res = await fetch(`/api/posts/${postId}`);
		const data = await res.json();

		if (res.ok) {
			setPost(data.post);
		}
	}

	//console.log(post);

	useEffect(() => {
		if (postId) {
			getPost();
		}
	}, [postId]);

	const [formData, setFormData] = useState({
		title: '',
		content: '',
	});

	useEffect(() => {
		if (post) {
			setFormData({
				title: post.title || '',
				content: post.content || '',
			});
		}
	}, [post]);

	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch(`/api/posts/${postId}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		const data = await res.json();

		if (data.errors) {
			setErrors(data.errors);
		} else {
			localStorage.setItem('token', data.token);
			if (window.confirm('Post has been successfully edited!')) {
				navigate('/');
			}
			//console.log(data);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-6 text-center">Edit The Blog</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
					{errors?.title && (
						<motion.p
							className='text-red-500 mb-2'
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							{errors.title[0]}
						</motion.p>
					)}
					<input
						type="text"
						value={formData.title}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder='Blog Title'
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
					{errors?.content && (
						<motion.p
							className='text-red-500 mb-2'
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							{errors.content[0]}
						</motion.p>
					)}
					<textarea
						value={formData.content}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-40"
						placeholder='Blog Content'
						onChange={(e) => setFormData({ ...formData, content: e.target.value })}
					/>
				</div>
				<button
					type="submit"
					className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default EditBlogPage;
