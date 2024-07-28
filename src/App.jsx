import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import Register from './Pages/Auth/Register';
import Login from './Pages/Auth/Login';
import CreateBlogPage from './Pages/Posts/Create';

import { useContext } from 'react';
import { Context } from './Context/Context';
import Show from './Pages/Posts/Show';
import EditBlogPage from './Pages/Posts/Edit';

function App() {
  const { user } = useContext(Context);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/register' element={user ? <Home /> : <Register />} />
          <Route path='/login' element={user ? <Home /> : <Login />} />
          <Route path='/create' element={user ? <CreateBlogPage /> : <Login />} />
          <Route path='/posts/:slug' element={<Show />} />
          <Route path='/posts/:slug/edit' element={user ? <EditBlogPage /> :<Home /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
