import bridge_logo from '../assets/bridge_logo.svg'
import Login from './Login'

export default function LandingPage({}) {
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