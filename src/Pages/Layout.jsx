import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Context } from "../Context/Context";

function Layout() {
    const { user, token, setUser, setToken } = useContext(Context);
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();

        const res = await fetch('/api/logout', {
			method:"post",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        //console.log(data);

        if (res.ok) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            navigate('/');
        }
    }

    const buttonClass = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4";

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-800 text-white py-4">
                <nav className="container mx-auto flex justify-between items-center px-4">
                    <Link to="/" className="text-xl font-bold hover:text-gray-400 transition-colors">Home</Link>
                    {user ? (
                        <div className="flex items-center">
                            <span className="mr-4">Welcome {user.name}</span>
                            <button 
                                onClick={() => navigate('/create')} 
                                className={buttonClass}
                            >
                                New Post
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button 
                                onClick={() => navigate('/register')} 
                                className={buttonClass}
                            >
                                Register
                            </button>
                            <button 
                                onClick={() => navigate('/login')} 
                                className={buttonClass}
                            >
                                Login
                            </button>
                        </div>
                    )}
                </nav>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white py-4 mt-8">
                <div className="container mx-auto text-center">
                    &copy; 2024 Your Website. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default Layout;
