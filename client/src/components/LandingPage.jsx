import bridge_logo from '../assets/bridge_logo.svg'
import Login from './Login'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function LandingPage({}) {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 md:p-12 bg-board-bg bg-cover bg-center overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/90 pointer-events-none" />
            
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <div className="relative z-10 flex flex-col items-center w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <span className="text-emerald-400 font-extrabold tracking-[0.3em] uppercase text-xs md:text-sm mb-2 drop-shadow-md">
                    Welcome To
                </span>
                
                <img 
                    src={bridge_logo} 
                    alt="Bridge Logo"
                    className="w-56 md:w-72 mb-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                <div className="w-full bg-neutral-900/70 backdrop-blur-2xl border border-white/10 rounded-4xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 md:p-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <Login />
                </div>
            </div>
        </div>
    )
}