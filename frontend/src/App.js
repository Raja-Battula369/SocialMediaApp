import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { useSelector } from 'react-redux';
import './App.css';

import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import Profile from './components/ProfilePage/Profile';

function App() {
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="App">
      <Router ex>

        <Routes >
          <Route path='/' element={<LoginPage />} />
          <Route exact path='/home' element={isAuth ? <HomePage /> : <Navigate to="/" />} />
          <Route path='/profile/:userId' element={isAuth ? <Profile /> : <Navigate to="/" />} />

        </Routes>

      </Router>
    </div>
  );
}

export default App;
