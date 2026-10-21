import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Connect } from './connect/connect';
import { Home } from './home/home';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(
        () => Boolean(localStorage.getItem('mountWindUsername'))
    );

    function handleLogin(username) {
        localStorage.setItem('mountWindUsername', username);
        setIsAuthenticated(true);
    }

    function handleLogout() {
        localStorage.removeItem('mountWindUsername');
        setIsAuthenticated(false);
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
                        element={isAuthenticated ? <Play /> : <Navigate to='/login' replace />}
                    />
                    <Route
                        path='/connect'
                        element={isAuthenticated ? <Connect /> : <Navigate to='/login' replace />}
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
    const [logoutPending, setLogoutPending] = React.useState(false);
    const footerAction = {
        '/play': { path: '/connect', label: 'Exit Game' },
        '/connect': {
            path: '/login',
            label: 'Log Out',
            onClick: () => setLogoutPending(true),
        },
        '/login': { path: '/home', label: 'Back' },
    }[pathname];

    React.useEffect(() => {
        if (pathname === '/login' && logoutPending) {
            setLogoutPending(false);
            onLogout();
        }
    }, [pathname, logoutPending, onLogout]);

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
                    onClick={footerAction.onClick}
                    className="btn btn-primary maroon-button"
                    id="exit-game"
                >
                    {footerAction.label}
                </Link>
            )}
        </footer>
    );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Address unknown.</main>;
}