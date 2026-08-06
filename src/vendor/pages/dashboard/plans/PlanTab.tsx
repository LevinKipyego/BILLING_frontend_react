import {
  CodeBracketIcon,
  ListBulletIcon,
  CommandLineIcon,
  Square2StackIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import type { TabType } from "./types/plan";

interface PlanTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onCopyAllHtml: () => void;
  copiedId: string | number | null;
}

export default function PlanTabs({
  activeTab,
  setActiveTab,
  onCopyAllHtml,
  copiedId,
}: PlanTabsProps) {
  const tabs = [
    {
      id: "hotspot_html" as TabType,
      label: "HTML",
      fullLabel: "Hotspot HTML",
      icon: CodeBracketIcon,
    },
    {
      id: "directory" as TabType,
      label: "Directory",
      fullLabel: "Plan Directory",
      icon: ListBulletIcon,
    },
    {
      id: "configs" as TabType,
      label: "RouterOS",
      fullLabel: "RouterOS Export",
      icon: CommandLineIcon,
    },
  ];

  return (
    <div className="border-b border-slate-200 dark:border-gray-800 pb-4 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col lg:flex-row
                  items-center justify-center
                  gap-2
                  rounded-xl
                  px-3 py-3
                  lg:px-5 lg:py-3
                  transition-all duration-200
                  border
                  min-h-[72px]
                  lg:min-h-0
                  text-center
                  ${
                    active
                      ? "bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 shadow-lg"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md"
                  }
                `}
              >
                <Icon className="w-6 h-6 lg:w-5 lg:h-5 stroke-[2.2]" />

                <span className="text-[11px] lg:text-xs font-bold uppercase tracking-wide leading-tight">
                  <span className="block lg:hidden">{tab.label}</span>
                  <span className="hidden lg:block">{tab.fullLabel}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Copy Button */}
        {activeTab === "hotspot_html" && (
          <button
            onClick={onCopyAllHtml}
            className="
              w-full
              lg:w-auto
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-emerald-600
              hover:bg-emerald-700
              text-white
              px-5
              py-3
              font-bold
              text-sm
              shadow-lg
              transition-all
              active:scale-[0.98]
            "
          >
            {copiedId === "full_html" ? (
              <>
                <CheckIcon className="w-5 h-5 stroke-[2.8]" />
                <span>Copied Successfully</span>
              </>
            ) : (
              <>
                <Square2StackIcon className="w-5 h-5 stroke-[2.4]" />
                <span>Copy All HTML</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}