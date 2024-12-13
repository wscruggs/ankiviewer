import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const login = async () => {
        navigate('/deck');
    }

    return (
        <div className='box'>
            <span className='text-center'>Log In</span>
            <div className='input-container'>
                <input
                    type="text"
                    value={email}
                    onChange= {e => setEmail(e.target.value)}
                />
                <label>Email</label>
            </div>
            <div className='input-container'>
                <input 
                    type='password'
                    value={password}
                    onChange= {e => setPassword(e.target.value)}
                />
                <label>Password</label>
            </div>
            <button onClick={login} type='button' className='btn'>Log In</button>
        </div>
    )
}