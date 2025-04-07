import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import TvLogo from '../assets/companylogo.png';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [focusedIndex, setFocusedIndex] = useState(0);
    const navigate = useNavigate();
    const elementsRef = useRef([]);
    const isTV = window.matchMedia('(min-width: 1280px) and (min-aspect-ratio: 16/9)').matches;

    // TV remote navigation handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isTV) {
                switch(e.key) {
                    case 'ArrowDown':
                        setFocusedIndex(prev => Math.min(prev + 1, elementsRef.current.length - 1));
                        break;
                    case 'ArrowUp':
                        setFocusedIndex(prev => Math.max(prev - 1, 0));
                        break;
                    case 'Enter':
                        elementsRef.current[focusedIndex]?.click();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedIndex, isTV]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backend-8xbb.onrender.com/api/auth/login/',
                 {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                console.log(response);
                localStorage.setItem('authToken', data.access);
                navigate(data.user.is_staff===true
                    ? '/admin-dashboard' : '/tv-display');
            } else {
                throw new Error('Authentication failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className={`login-container ${isTV ? 'tv-mode' : 'mobile-mode'}`}>
            <div className="login-branding">
            <img 
                    src={isTV ? TvLogo : TvLogo} 
                    alt="Company Logo" 
                    className="brand-logo"
                />
                <h1>Android TV Advertisement System</h1>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        ref={el => elementsRef.current[0] = el}
                        className={`form-input ${focusedIndex ==== 0 ? 'focused' : ''}`}
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        autoComplete="username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        ref={el => elementsRef.current[1] = el}
                        className={`form-input ${focusedIndex ==== 1 ? 'focused' : ''}`}
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        autoComplete="current-password"
                    />
                </div>

                <button
                    ref={el => elementsRef.current[2] = el}
                    className={`submit-button ${focusedIndex ==== 2 ? 'focused' : ''}`}
                    type="submit"
                >
                    Sign In
                </button>
            </form>

            <div className="secondary-actions">
                <button
                    ref={el => elementsRef.current[3] = el}
                    className={`action-button ${focusedIndex ==== 3 ? 'focused' : ''}`}
                    onClick={() => navigate('/register')}
                >
                    Create Account
                </button>
                <button
                    ref={el => elementsRef.current[4] = el}
                    className={`action-button ${focusedIndex ==== 4 ? 'focused' : ''}`}
                    onClick={() => navigate('/reset-password')}
                >
                    Forgot Password?
                </button>
            </div>
        </div>
    );
};

export default Login;
