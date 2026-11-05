import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';

async function loginUser(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: username, password }),
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.msg || 'Unable to log in.');
    }
}

async function registerUser(username, password) {
    const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: username, password }),
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.msg || 'Unable to register.');
    }
}

export function Login({ onLogin }) {
    const navigate = useNavigate();
    const [loginError, setLoginError] = React.useState('');
    const [registrationError, setRegistrationError] = React.useState('');

    async function completeLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username').trim();
        const password = formData.get('password');

        if (!username) {
            setLoginError('Enter a username.');
            return;
        }

        setLoginError('');
        try {
            await loginUser(username, password);
            onLogin(username, password);
            navigate('/connect');
        } catch (error) {
            setLoginError(error.message || 'Unable to log in. Please try again.');
        }
    }

    async function completeRegistration(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('registerUsername').trim();
        const password = formData.get('registerPassword');
        const confirmation = formData.get('confirmPassword');

        if (!username) {
            setRegistrationError('Enter a username.');
            return;
        }

        if (password !== confirmation) {
            setRegistrationError('Passwords do not match.');
            return;
        }

        setRegistrationError('');
        try {
            await registerUser(username, password);
            onLogin(username, password);
            navigate('/connect');
        } catch (error) {
            setRegistrationError(error.message || 'Unable to register. Please try again.');
        }
    }

    return (
        <main className="login-page">
            <section className="credentials">
                <h2>LOGIN</h2>
                <form onSubmit={completeLogin}>
                    <label className="form-label" htmlFor="login-username">Username</label>
                    <input
                        id="login-username"
                        name="username"
                        type="text"
                        className="form-control"
                        placeholder="username"
                        required
                    />
                    <label className="form-label" htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="password"
                        required
                    />
                    {loginError && <p role="alert">{loginError}</p>}
                    <button type="submit" className="btn btn-primary maroon-button align-self-center mt-3">
                        Login
                    </button>
                </form>
            </section>
            <section className="credentials">
                <h2>REGISTER</h2>
                <form onSubmit={completeRegistration}>
                    <label className="form-label" htmlFor="register-username">Username</label>
                    <input
                        id="register-username"
                        name="registerUsername"
                        type="text"
                        className="form-control"
                        placeholder="username"
                        required
                    />
                    <label className="form-label" htmlFor="register-password">Password</label>
                    <input
                        id="register-password"
                        name="registerPassword"
                        type="password"
                        className="form-control"
                        placeholder="password"
                        required
                    />
                    <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                    <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        className="form-control"
                        placeholder="confirm password"
                        required
                    />
                    {registrationError && <p role="alert">{registrationError}</p>}
                    <button type="submit" className="btn btn-primary maroon-button align-self-center mt-3">
                        Register
                    </button>
                </form>
            </section>
        </main>
    );
}