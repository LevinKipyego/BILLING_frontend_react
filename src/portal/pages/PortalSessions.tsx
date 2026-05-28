import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseUrl";

interface SessionType {
  id: number;
  ip: string;
  mac_address: string;
  nas: string;
  start_time: string;
  uptime: string;
  download_used: string;
  upload_used: string;
  status: "Online" | "Expired";
}

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  `${BaseUrl}/api`;

export default function PortalSessions(): React.JSX.Element {

  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [disconnectingId, setDisconnectingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // FETCH ACTIVE SESSIONS
  // ========================================

  const fetchSessions = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("portal_access");

      const response = await fetch(
        `${API_BASE}/portal/sessions/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch active sessions");
      }

      const data = await response.json();

      setSessions(data);

    } catch (err: any) {

      console.error(err);

      setError(
        err.message || "Unable to load active sessions"
      );

    } finally {

      setLoading(false);

    }
  };

  // ========================================
  // KICK SESSION
  // ========================================

  const handleDisconnect = async (id: number) => {

    try {

      setDisconnectingId(id);

      const token = localStorage.getItem("portal_access");

      const response = await fetch(
        `${API_BASE}/portal/sessions/${id}/disconnect/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        const err = await response.json().catch(() => ({}));

        throw new Error(
          err.message || "Failed to disconnect session"
        );
      }

      // Remove disconnected session instantly
      setSessions((prev) =>
        prev.filter((session) => session.id !== id)
      );

    } catch (err) {

      console.error(
        "Session disconnect failure:",
        err
      );

    } finally {

      setDisconnectingId(null);

    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    fetchSessions();

  }, []);

  return (

    <div className="font-['Figtree',sans-serif] space-y-6 transition-colors duration-200">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          Active Network Sessions
        </h2>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor authenticated PPPoE sessions connected to the network infrastructure.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-10 flex flex-col items-center justify-center">

          <svg
            className="animate-spin h-8 w-8 text-zinc-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />

            <path
              className="opacity-80"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
            />
          </svg>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading active sessions...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-5">

          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {error}
          </p>

        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && sessions.length === 0 && (

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-8 text-center">

          <svg
            className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>

          <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            No active sessions detected
          </h3>

          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Your PPPoE account is currently offline.
          </p>

        </div>
      )}

      {/* ACTIVE SESSIONS */}
      {!loading && !error && sessions.length > 0 && (

        <div className="space-y-4">

          {sessions.map((session) => (

            <div
              key={session.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm transition hover:shadow-md"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* LEFT */}
                <div className="space-y-3 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100 tracking-tight text-base">
                      {session.nas}
                    </h3>

                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      NAS Gateway
                    </span>

                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">

                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        Framed IP
                      </p>

                      <p className="text-sm font-mono font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
                        {session.ip}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        MAC Address
                      </p>

                      <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400 mt-0.5">
                        {session.mac_address}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        Uptime
                      </p>

                      <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
                        {session.uptime}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        Session Started
                      </p>

                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                        {session.start_time}
                      </p>
                    </div>

                  </div>

                  {/* TRAFFIC */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center gap-4 text-xs">

                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">

                      <svg
                        className="w-3.5 h-3.5 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>

                      <span>
                        Downloaded:
                        {" "}
                        <strong className="font-semibold text-zinc-700 dark:text-zinc-300">
                          {session.download_used}
                        </strong>
                      </span>

                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">

                      <svg
                        className="w-3.5 h-3.5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>

                      <span>
                        Uploaded:
                        {" "}
                        <strong className="font-semibold text-zinc-700 dark:text-zinc-300">
                          {session.upload_used}
                        </strong>
                      </span>

                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center sm:justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-800/60">

                  <div className="flex items-center gap-1.5">

                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                      {session.status}
                    </span>

                  </div>

                  <button
                    onClick={() =>
                      handleDisconnect(session.id)
                    }

                    disabled={
                      disconnectingId === session.id
                    }

                    className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 border border-red-200 dark:border-red-950/40 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 active:scale-[0.98]"
                  >

                    {disconnectingId === session.id ? (
                      <>

                        <svg
                          className="animate-spin h-4 w-4 text-red-600 dark:text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                        >

                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.93l3-2.64z"
                          />

                        </svg>

                        Clearing...

                      </>
                    ) : (
                      "Kick Session"
                    )}

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}