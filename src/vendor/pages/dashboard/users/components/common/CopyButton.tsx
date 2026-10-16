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
            className={`inline-flex items-center gap-1.5 rounded-md sm:rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shrink-0 ${className}`}
            title={copied ? "Copied!" : label}
        >
            {copied ? (
                <>
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs text-green-600 dark:text-green-400">Copied</span>
                </>
            ) : (
                <>
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                    {label && <span className="text-[11px] sm:text-xs">{label}</span>}
                </>
            )}
        </button>
    );
}