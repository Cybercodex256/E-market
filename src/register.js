import React, { useState } from 'react';
import { auth } from './firebase'; // Import the auth instance
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = ({ onNavigate }) => { // Accept onNavigate as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully!');
      setSuccess(true);
      setEmail('');
      setPassword('');
      // Optionally, navigate to login page after a short delay
    } catch (err) {
      console.error('Error creating user:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        {success && (
          <div className="text-center">
            <p className="text-green-500 text-sm mb-4">Account created successfully! 🎉</p>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => onNavigate('login')}
            >
              Go to Login
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className={success ? 'hidden' : ''}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">Already have an account? 
            <button 
              className="text-blue-500 hover:text-blue-800 ml-1 font-bold focus:outline-none" 
              onClick={() => onNavigate('login')} // Trigger navigation to the login page
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;