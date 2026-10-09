import React from 'react';
import { Link } from 'react-router-dom';
import '../app.css';

export function Login() {
    return (
        <main className="login-page">
            <section className="credentials">
                <h2>LOGIN</h2>
                <div>
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="your@email.com"></input>
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="password"></input>
                </div>
                <Link to="/connect" className="btn btn-primary maroon-button align-self-center mt-3">
                    Login
                </Link>
            </section>
            <section className="credentials">
                <h2>REGISTER</h2>
                <div>
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="your@email.com"></input>
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="password"></input>
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="confirm password"></input>
                </div>
                <Link to="/connect" className="btn btn-primary maroon-button align-self-center mt-3">
                    Register
                </Link>
            </section>
        </main>
    );
}