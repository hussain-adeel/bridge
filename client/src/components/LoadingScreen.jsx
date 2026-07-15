export default function LoadingScreen({}) {
    
    return (
        <div className="w-screen h-screen bg-board-bg flex flex-col items-center p-24">
            <div className="w-10 h-10 md:w-15 md:h-15 border-4 border-gray-200 border-t-text-main rounded-full animate-spin"></div>
            <div className="text-white font-bold text-3xl md:text-6xl mt-3">Loading</div>
        </div>
    )
}