import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { useSelector } from 'react-redux';
import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense, lazy } from 'react';
import Loading from './components/loader/Loading';

const Navbar = lazy(() => import('./components/Navbar'));

const HomePage = lazy(() => import('./components/HomePage/HomePage'))
const LoginPage = lazy(() => import('./components/LoginPage/LoginPage'))
const Profile = lazy(() => import('./components/ProfilePage/Profile'))
function App() {
  const isAuth = Boolean(useSelector((state) => state.token));

  const queryClient = new QueryClient();


  return (
    <div className="App">
      <Suspense fallback={<Loading />}>

        <Router >
          {isAuth && (<Navbar />)}

          <QueryClientProvider client={queryClient}>
            <Routes>

              <Route path='/' element={<LoginPage />} />
              <Route exact path='/home' element={isAuth ? <HomePage /> : <Navigate to="/" />} />
              <Route path='/profile/:userId' element={isAuth ? <Profile /> : <Navigate to="/" />} />

            </Routes><ReactQueryDevtools />
          </QueryClientProvider>


        </Router>
      </Suspense>

    </div>
  );
}

export default App;
