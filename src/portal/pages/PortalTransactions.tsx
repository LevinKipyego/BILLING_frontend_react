import React from "react";

interface TransactionType {
  id: number;
  code: string; // M-PESA Receipt String Reference
  package_name: string; // Target PPPoE Tier
  amount: number; // Raw float for easy summation blocks
  status: "Completed" | "Pending" | "Failed";
  date: string;
}

const transactions: TransactionType[] = [
  {
    id: 1,
    code: "QE54T89X2C",
    package_name: "Home Premium",
    amount: 2000,
    status: "Completed",
    date: "12 May 2026",
  },
  {
    id: 2,
    code: "QE12M45K9A",
    package_name: "Home Standard",
    amount: 1000,
    status: "Completed",
    date: "01 May 2026",
  },
  {
    id: 3,
    code: "QE09B12Z7F",
    package_name: "Home Premium",
    amount: 2000,
    status: "Failed",
    date: "15 Apr 2026",
  },
];

export default function PortalTransactions(): React.JSX.Element {
  
  // Calculate total expenditure dynamically from successful records
  const completedTotal = transactions
    .filter((tx) => tx.status === "Completed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const completedCount = transactions.filter((tx) => tx.status === "Completed").length;

  return (
    <div className="font-['Figtree',sans-serif] space-y-6 transition-colors duration-200">
      
      {/* HEADER BLOCK */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          Payment History
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Review your Safariom M-PESA STK statement history and ledger metadata.
        </p>
      </div>

      {/* METRIC SUMMATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total Completed Spend</p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            KES {completedTotal.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Successful Cycles</p>
          <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mt-1">
            {completedCount} Invoice{completedCount !== 1 ? "s" : ""}
          </h3>
        </div>

      </div>

      {/* TRANSACTION TABLE FRAME */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-4">Receipt Code</th>
                <th className="px-5 py-4">Allocated Package</th>
                <th className="px-5 py-4">Execution Date</th>
                <th className="px-5 py-4">Status Flag</th>
                <th className="px-5 py-4 text-right">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300 font-medium">
              {transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors duration-100"
                >
                  {/* M-Pesa Receipt Code */}
                  <td className="px-5 py-3.5 font-mono text-xs tracking-wider text-zinc-900 dark:text-zinc-100 font-bold">
                    {tx.code}
                  </td>
                  
                  {/* Package Descriptor */}
                  <td className="px-5 py-3.5 text-sm">
                    {tx.package_name}
                  </td>

                  {/* Date Flag */}
                  <td className="px-5 py-3.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {tx.date}
                  </td>

                  {/* Status Render Engine */}
                  <td className="px-5 py-3.5">
                    <span 
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        tx.status === "Completed" 
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" 
                          : tx.status === "Failed"
                          ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                          : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  {/* Numerical Price Value */}
                  <td className="px-5 py-3.5 text-right font-bold text-zinc-900 dark:text-zinc-50">
                    KES {tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}