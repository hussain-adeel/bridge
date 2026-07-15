import bridge_logo from '../assets/bridge_logo.svg'

export default function LandingPage({}) {
    return (
        <div className="w-full h-screen p-3 flex flex-col items-center bg-board-bg">
            <span className='-mb-10 text-left text-white font-bold'>Welcome To</span>
            <img 
                src={bridge_logo} 
                alt="Bridge Logo"
                className="w-md"
            />
            <div className='flex flex-col items-center'>
                <button>Log In</button>
                <button>Game Rules</button>
            </div>
        </div>
    )

}