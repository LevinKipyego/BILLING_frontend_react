import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
    value: string;
    label?: string;
    className?: string;
}

export default function CopyButton({
    value,
    label = "Copy",
    className = "",
}: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    useEffect(() => {
        if (!copied) return;

        const timer = setTimeout(() => {
            setCopied(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [copied]);

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition ${className}`}
            title={copied ? "Copied!" : label}
        >
            {copied ? (
                <>
                    <Check size={16} className="text-green-600" />
                    <span>Copied</span>
                </>
            ) : (
                <>
                    <Copy size={16} />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}