'use client'

import { TextareaHTMLAttributes, useRef } from "react";

interface CodeEditorProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
}

export function CodeEditor({
    value,
    onChange,
    readOnly,
    ...rest
}: CodeEditorProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (readOnly) return;

        // TAB support
        if (e.key === 'Tab') {
            e.preventDefault();

            const textarea = ref.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const indent = '  '; // 2 spaces
            const newValue =
                value.substring(0, start) +
                indent +
                value.substring(end);

            onChange?.(newValue);

            // Restore cursor position
            requestAnimationFrame(() => {
                textarea.selectionStart = textarea.selectionEnd =
                    start + indent.length;
            });
        }
    };

    return (
        <textarea
            ref={ref}
            {...rest}
            value={value}
            readOnly={readOnly}
            spellCheck={false}
            onKeyDown={handleKeyDown}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full h-full min-h-75 font-mono text-sm bg-neutral-900 text-neutral-100 p-3 rounded-md outline-none resize-y ${readOnly
                ? 'cursor-not-allowed opacity-75'
                : 'cursor-text'
                }`}
        />
    );
}
