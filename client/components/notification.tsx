'use client'

import { useEffect, useState } from "react";

let timeout: NodeJS.Timeout | null = null;

export function Notification({ message }: { message: string | null }) {
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');

    useEffect(() => {
        if (message) {
            setText(message);
            setVisible(true);
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => setVisible(false), 3000);
        }
    }, [message]);

    if (!visible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
            {text}
        </div>
    );
}