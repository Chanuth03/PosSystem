import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Store, Lock, User } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const res = await login(username, password);
    if (!res.success) {
      setError(res.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Store size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to FlowPOS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your credentials to access the terminal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center justify-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  placeholder="admin or cashier"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-lg transition-all ${
                isLoading ? 'bg-blue-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 active:scale-[0.98]'
              }`}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-500 text-center mb-3">Demo Accounts</h4>
            <div className="flex gap-4 justify-center text-xs text-gray-500">
              <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                <span className="font-bold text-gray-700">Admin:</span> admin / admin
              </div>
              <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                <span className="font-bold text-gray-700">Cashier:</span> cashier / cashier
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
