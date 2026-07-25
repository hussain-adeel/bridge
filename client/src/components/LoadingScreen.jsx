export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-neutral-900 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-neutral-600 border-t-white rounded-full animate-spin"></div>
            <div className="text-white font-bold text-2xl mt-4">Loading...</div>
        </div>
    );
}