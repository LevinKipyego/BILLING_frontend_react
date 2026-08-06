import { useMemo, useState } from "react";
import {
    CodeBracketIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/outline";

import ExportToolbar from "../ExportToolBar";
import CodeCard from "../CodeCard";

import {
    exportHTML,
    exportJSON,
    exportRSC,
    exportTXT,
} from "../utils/download";

import type { Plan } from "../types/plan";
import CodeEditor from "../monaco/CodeEditor";

interface Props {
    plans: Plan[];

    fullHtmlSnippet: string;

    jsDataObject: string;

    generateHotspotButtonHtml: (plan: Plan) => string;

    copiedId: string | number | null;

    onCopy: (key: string, text: string) => void;
}

export default function HotspotHtmlView({
    plans,
    fullHtmlSnippet,
    jsDataObject,
    generateHotspotButtonHtml,
    copiedId,
    onCopy,
}: Props) {
    const [search, setSearch] = useState("");

    const [showCombined, setShowCombined] =
        useState(false);

    const filteredPlans = useMemo(() => {
        return plans.filter((p) =>
            p.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [plans, search]);

    // ----------------------------------------

    // Build RouterOS Export

    // ----------------------------------------

    const rscExport = useMemo(() => {
        return filteredPlans
            .map(
                (plan) => `
/ip hotspot user profile
add \
name="${plan.name}" \
rate-limit="${plan.rate_limit || ""}"
`
            )
            .join("\n");
    }, [filteredPlans]);

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">

                <h1 className="text-2xl font-bold">

                    Hotspot HTML Generator

                </h1>

                <p className="mt-2 text-blue-100">

                    Generate hotspot buttons, preview HTML,
                    copy snippets or export RouterOS scripts.

                </p>

            </div>

            {/* Toolbar */}

            <ExportToolbar

                search={search}

                onSearch={setSearch}

                copied={copiedId === "all"}

                onCopyAll={() =>
                    onCopy("all", fullHtmlSnippet)
                }

                onExportHtml={() =>
                    exportHTML(fullHtmlSnippet)
                }

                onExportTxt={() =>
                    exportTXT(fullHtmlSnippet)
                }

                onExportJson={() =>
                    exportJSON(jsDataObject)
                }

                onExportRsc={() =>
                    exportRSC(rscExport)
                }

            />

            {/* Combined HTML */}

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

                <button

                    onClick={() =>
                        setShowCombined(!showCombined)
                    }

                    className="w-full flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-5 py-4"

                >

                    <div className="flex items-center gap-2">

                        <CodeBracketIcon className="w-5 h-5" />

                        <span className="font-semibold">

                            Combined HTML

                        </span>

                    </div>

                    {showCombined ? (
                        <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                    )}

                </button>

                {showCombined && (

                    <div className="bg-slate-950 p-4">

                        <CodeEditor
                            language="html"
                            title="Generated HTML"
                            value={fullHtmlSnippet}
                            copied={copiedId === "all"}
                            onCopy={() => onCopy("all", fullHtmlSnippet)}
                        />

                    </div>

                )}

            </div>

            {/* Cards */}

            <div className="grid gap-5">

                {filteredPlans.map((plan) => (

                    <CodeCard

                        key={plan.id}

                        plan={plan}

                        html={generateHotspotButtonHtml(plan)}

                        copied={
                            copiedId === `btn_${plan.id}`
                        }

                        onCopy={() =>
                            onCopy(
                                `btn_${plan.id}`,
                                generateHotspotButtonHtml(
                                    plan
                                )
                            )
                        }

                    />

                ))}

                {filteredPlans.length === 0 && (

                    <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">

                        <p className="text-slate-500">

                            No plans found.

                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}