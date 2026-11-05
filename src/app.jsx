import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Connect } from './connect/connect';
import { Home } from './home/home';

export default function App() {
    const [username, setUsername] = React.useState(
        () => localStorage.getItem('mountWindUsername') || ''
    );
    const [password, setPassword] = React.useState('');

    function handleLogin(enteredUsername, enteredPassword) {
        setUsername(enteredUsername);
        setPassword(enteredPassword);
        localStorage.setItem('mountWindUsername', enteredUsername);
    }

    async function handleLogout() {
        const response = await fetch('/api/auth/logout', {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.msg || `Logout failed (${response.status}).`);
        }

        localStorage.removeItem('mountWindUsername');
        setUsername('');
        setPassword('');
    }

    return (
        <BrowserRouter>
            <div className="app-layout">
                <header>
                    <h1>THE TREASURE OF MOUNT WIND</h1>
                    <nav></nav>
                </header>

                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route
                        path='/play'
                        element={username !== '' ? <Play /> : <Navigate to='/login' replace />}
                    />
                    <Route
                        path='/connect'
                        element={username !== '' ? <Connect username={username} /> : <Navigate to='/login' replace />}
                    />
                    <Route path='/login' element={<Login onLogin={handleLogin} />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <AppFooter onLogout={handleLogout} />
            </div>
        </BrowserRouter>
    );
}

function AppFooter({ onLogout }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = React.useState('');
    const footerAction = {
        '/play': { path: '/connect', label: 'Exit Game' },
        '/connect': { path: '/login', label: 'Log Out' },
        '/login': { path: '/home', label: 'Back' },
    }[pathname];

    async function handleLogoutClick(event) {
        event.preventDefault();
        setLogoutError('');
        try {
            await onLogout();
            navigate('/login');
        } catch (error) {
            setLogoutError(error.message || 'Unable to log out. Please try again.');
        }
    }

    return (
        <footer>
            <div>
                <p>This was made by David Bassett</p>
                <a href="https://github.com/blazzer5555/Startup"
                    className="github-link">link to my github</a>
            </div>
            {footerAction && (
                <Link
                    to={footerAction.path}
                    onClick={pathname === '/connect' ? handleLogoutClick : undefined}
                    className="btn btn-primary maroon-button"
                    id="exit-game"
                >
                    {footerAction.label}
                </Link>
            )}
            {logoutError && <p role="alert">{logoutError}</p>}
        </footer>
    );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Address unknown.</main>;
}