export function Notification({
    message,
    onClose,
}: {
    message: string | null;
    onClose: () => void;
}) {
    if (!message) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-emerald-600 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
            {message}
            <button
                className="px-1.5 cursor-pointer bg-white pt-px rounded-full text-sm text-black"
                onClick={onClose}
            >
                ×
            </button>
        </div>
    );
}
