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
        <div className="w-full h-screen p-8 md:p-12 flex flex-col items-center bg-board-bg">
            <span className='-mb-10 text-left text-white font-bold'>Welcome To</span>
            <img 
                src={bridge_logo} 
                alt="Bridge Logo"
                className="w-md"
            />
            <div className='flex flex-col items-center'>
                <Login></Login>
            </div>
        </div>
    )

}