import React, { useState } from 'react';
import { Car, Lock, Mail, ArrowRight, Shield } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@taximanager.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        id: 'admin-1',
        name: 'Alex Thompson',
        email: email,
        role: 'Corporate Manager',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Version Badge */}
      <div className="absolute top-6 right-6 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40 font-mono tracking-widest uppercase">
        Build v1.1-Stable
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/30 mb-4 transform rotate-12">
            <Car className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TaxiManager Pro</h1>
          <p className="text-slate-400 mt-2">Manage your corporate fleet with AI</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all group disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <div className="flex items-center space-x-1">
              <Shield size={10} className="text-emerald-500" />
              <span>Secure Login</span>
            </div>
            <button className="hover:text-blue-400 transition-colors">Forgot Password?</button>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-[0.2em] font-medium">
          Powered by Gemini AI Engine
        </p>
      </div>
    </div>
  );
};

export default Login;