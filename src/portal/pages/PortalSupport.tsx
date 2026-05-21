import React, { useState } from "react";

export default function PortalSupport(): React.JSX.Element {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    // Simulate sending ticket data to Django backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSuccessMessage("Support ticket opened successfully. A technician will review your link shortly.");
    setTicketSubject("");
    setTicketMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="font-['Figtree',sans-serif] space-y-6 transition-colors duration-200">
      
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          Help & Support Center
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Experiencing drops or slow speeds? Open a technical support ticket or contact our network operations center.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        
        {/* LEFT TWO COLUMNS: TICKET CREATION FORM */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
              Submit a Trouble Ticket
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              This automatically appends your current PPPoE session state variables for our NOC teams.
            </p>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Issue Category / Subject
              </label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g., Frequent disconnections, Slow speeds at night"
                className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Detailed Description
              </label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                rows={5}
                placeholder="Please describe what your router lights look like or any error messages you see..."
                className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition resize-none"
                required
              />
            </div>

            {successMessage && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-400 text-xs font-medium rounded-xl p-4 transition-all">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl shadow-md shadow-emerald-600/10 dark:shadow-none transition duration-150 disabled:opacity-50 active:scale-[0.99] text-xs uppercase tracking-wider"
            >
              {isSubmitting ? "Routing to Helpdesk..." : "File Ticket"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: HOTLINES & DIAGNOSTICS METADATA */}
        <div className="space-y-6">
          
          {/* Urgent Hotlines */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Direct Support Lines</h4>
            
            <div className="pt-1 space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-emerald-600 dark:text-emerald-500 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h32a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Phone Hotline</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">+254 700 000 000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-emerald-600 dark:text-emerald-500 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8m-2 11H4a2 2 0 01-2-2V8a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email NOC Desk</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">support@kayonet.co.ke</p>
                </div>
              </div>
            </div>
          </div>

          {/* Network Parameters Info Box */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm text-xs space-y-2 text-zinc-500 dark:text-zinc-400 font-medium">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm mb-2">Network Looking Glass</h4>
            <div className="flex justify-between">
              <span>Primary DNS</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300 font-bold">8.8.8.8</span>
            </div>
            <div className="flex justify-between">
              <span>Secondary DNS</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300 font-bold">1.1.1.1</span>
            </div>
            <div className="flex justify-between">
              <span>Core Gateway MTU</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300 font-bold">1492 (PPPoE Standard)</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}