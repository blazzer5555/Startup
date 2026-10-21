import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

                <footer>
                    <div>
                        <p>This was made by David Bassett</p>
                        <a href="https://github.com/blazzer5555/Startup"
                            className="github-link">link to my github</a>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Address unknown.</main>;
}