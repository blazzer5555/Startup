import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Connect } from './connect/connect';
import { Home } from './home/home';

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">
                <header>
                    <h1>THE TREASURE OF MOUNT WIND</h1>
                    <nav>
                        <NavLink className='nav-link' to='home'>Home Page</NavLink>
                        <NavLink className='nav-link' to='login'>Login Page</NavLink>
                        <NavLink className='nav-link' to='connect'>Connection Page</NavLink>
                        <NavLink className='nav-link' to='play'>Play Page</NavLink>
                    </nav>
                </header>

                <Routes>
                    <Route path='/' element={<Home />} exact />
                    <Route path='/home' element={<Home />} />
                    <Route path='/play' element={<Play />} />
                    <Route path='/connect' element={<Connect />} />
                    <Route path='/login' element={<Login />} />
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