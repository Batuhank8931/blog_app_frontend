import { useState, useEffect, useContext } from "react";
import './Home.css';
import { Context } from "../Context/Context";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Home() {
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [slideDirection, setSlideDirection] = useState(""); // State for slide animation direction
	const postsPerPage = 20;

	const navigate = useNavigate()

	const { token } = useContext(Context);

	const { user } = useContext(Context);

	async function getPosts() {
		const res = await fetch("/api/posts");
		const data = await res.json();

		if (res.ok) {
			setPosts(data);
		}
	}

	useEffect(() => {
		getPosts();
	}, []);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

	const totalPages = Math.ceil(posts.length / postsPerPage);
	const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setSlideDirection("left");
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setSlideDirection("right");
			setCurrentPage(currentPage - 1);
		}
	};

	const handlePageChange = (pageNumber) => {
		setSlideDirection(pageNumber > currentPage ? "left" : "right");
		setCurrentPage(pageNumber);
	};

	const handleDelete = async (postId) => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			const res = await fetch(`/api/posts/${postId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (res.ok) {
				setPosts(posts.filter(post => post.id !== postId));
			} else {
				const data = await res.json();
				console.error(data.errors);
				navigate("/");
			}
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4 text-center">Latest Posts</h1>
			<div className={`grid grid-cols-1 gap-4 slide-${slideDirection}`}>
				{currentPosts.map((post) => (
					<div key={post.id} className="border p-4 rounded shadow-md flex flex-col justify-between">
						<div>
							<h2 className="text-xl font-semibold mb-2">{post.title}</h2>
							<div className="text-sm text-gray-500 mb-2">
								<p>Created by {post.user.name} on {new Date(post.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })} at {new Date(post.created_at).toLocaleTimeString()}</p>
							</div>
							<p className="text-gray-700">{post.content}</p>
						</div>
						<div className="flex justify-end mt-4 space-x-2">
							<Link to={`/posts/${post.slug}?id=${post.id}`} state={{ id: post.id }} className="px-4 py-2 bg-blue-500 text-white rounded">Read More</Link>
							{user && user.id === post.user.id && (
								<>
									<Link to={`/posts/${post.slug}?id=${post.id}/edit`} state={{ id: post.id }}>
										<button className="px-4 py-2 bg-green-500 text-white rounded">Edit</button>
									</Link>
									<button
										className="px-4 py-2 bg-red-500 text-white rounded"
										onClick={() => handleDelete(post.id)}
									>
										Delete
									</button>
								</>
							)}
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-center mt-4 space-x-1">
				<button
					className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
					onClick={handlePrevPage}
					disabled={currentPage === 1}
				>
					Previous
				</button>
				{pageNumbers.map((number) => (
					<button
						key={number}
						className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${number === currentPage ? 'bg-gray-700 text-white' : ''}`}
						onClick={() => handlePageChange(number)}
					>
						{number}
					</button>
				))}
				<button
					className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
					onClick={handleNextPage}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		</div>
	);
}

export default Home;
