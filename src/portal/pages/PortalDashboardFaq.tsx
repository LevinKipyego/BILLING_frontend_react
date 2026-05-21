
import React, { useState } from "react";

export default function PortalDashboardFaq(): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const entries = [
        {q: (
        <>
            My account is paid for but the router states{" "}
            <span className="text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded border border-red-200/40 dark:border-red-900/40 text-xs sm:text-sm">
            'Authentication Failed  ?'
            </span>
            
        </>
        ),
        a: "This happens when a duplicate active session lock hangs inside the FreeRADIUS authentication server cache..."
    },
    {
      q: "How long does it take for an internet package upgrade to apply?",
      a: "Upgrades processed inside the client billing portal apply instantly! After authorizing your automated payment via the M-PESA pop-up PIN screen, we recommend waiting 60 seconds and then power-cycling your home router to clear local hardware rate limits."
    },
    {
      q: "What should I do if my automatic M-PESA Express STK Push fails to pop up?",
      a: "If the automatic on-screen PIN request doesn't show up on your smartphone, navigate over to your manual SIM Toolkit or M-PESA app interface. Select Lipa Na M-PESA Paybill, use business number provided by your vendor{____}, and place your exact PPPoE username (e.g., john_wifi) as the Account number to ensure instant network credit."
    },
    {
      q: "My internet link is connected but speeds feel sluggish over Wi-Fi?",
      a: "Wireless interference can significantly impact throughput. Make sure your home router isn't placed inside a closed cabinet, behind large appliances, or right next to home electronics. For heavy usage like gaming, smart TVs, or working from home, running a physical ethernet LAN link cable directly to the router will provide a much cleaner path than standard 2.4Ghz signals."
    },
    {
      q: "Can I use my PPPoE account subscription credentials on a different router?",
      a: "To preserve subscriber line safety, our core MikroTik NAS gateway enforces an automatic hardware MAC lock on the first network hook lease it recognizes. If you buy a replacement Wi-Fi router or an upgraded ONT terminal, simply drop an explicit request inside our portal's 'Support Ticket' section so an engineer can flush your account's old MAC string lock."
    },

    {
    q: (
        <>
        Why do I have active internet access, but my phone won't connect to my router until I completely{" "}
        <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-200/40 dark:border-emerald-800/20 text-xs sm:text-sm">
            remove the password
        </span>
        ?
        </>
    ),
    a: "This behavior points to either an IP address lease conflict or a wireless security protocol\
     mismatch on your home router. When you remove the password, the router strips away its encryption\
     layer, allowing your phone to bypass standard hardware handshakes. \n\nTo fix this without leaving\
     your Wi-Fi completely open to the public:\n\b1. Log into your Tenda/ONT admin gateway and look for 'Wi\
     reless Security Settings'.\n2. Change your Network Encryption Type to WPA2-PSK (AES). Avoid using m\
     xed 'WPA/WPA3' modes, as older smartphones frequently crash trying to negotiate those handshakes.\n3. \
     Head to the 'DHCP Server' menu and change the 'Lease Time' parameter to 1440 minutes (24 hours). \n4. \
     Finally, open your smartphone's Wi-Fi menu, click 'Forget Network' on your home Wi-Fi string, reboot the \
     phone, and try connecting with your password fresh. \n\nIf you still have trouble, please submit a support \
     ticket with your router model and firmware version so we can provide more specific guidance."
    },

    {
  q: (
    <>
      Why does my phone say{" "}
      <span className="text-amber-600 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-200/40 dark:border-amber-900/40 text-xs sm:text-sm">
        'IP Configuration Failure'
      </span>{" "}
      while my computer is connected and browsing perfectly?
    </>
  ),
  a: "This happens because your computer already secured a working local network lease, but your router's internal DHCP server (the system responsible for handing out local IP addresses) has frozen up or run out of available numbers for new devices.\n\nTo resolve this immediately:\n1. Unplug your home Tenda or ONT router from its power source for 15 seconds, then plug it back in. This reboots the internal routing tables and clears stuck IP leases.\n2. If the issue keeps happening, your router's IP pool might be too small. Log into your router admin panel, navigate to 'LAN / DHCP Server Settings', and ensure your IP Address Pool range is wide enough (e.g., 192.168.1.100 to 192.168.1.250) to accommodate all the smartphones and smart TVs in your house.\n3. On your phone, you can also turn Wi-Fi off and back on, or toggle Airplane Mode for 5 seconds to force a clean IP request handshake."
},
    {
      q: "I paid via Paybill but my link is still offline. How long is the reconciliation?",
      a: "Paybill transactions generally match dynamically via API webhooks within 2 minutes. If your account string was misspelled or typed with a space character during payment entry, the funds may drop into a temporary unassigned holding vault. Please share your official M-PESA transaction ID string code inside our support portal line to trigger manual matching."
    }
  ];

  return (
    <div className="font-['Figtree',sans-serif] space-y-6 max-w-4xl transition-colors duration-200 leading-relaxed">
      
      {/* SECTION HEADER BLOCK */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
          Quick technical troubleshooting workflows to restore your link connectivity metrics instantly without waiting on call queues.
        </p>
      </div>

      {/* ACCORDION LOOP CONTAINER */}
      <div className="space-y-4">
        {entries.map((faq, index) => {
          const isCurrentOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm transition-all duration-200"
            >
              {/* ACCORDION ACTUATOR TRIGGER BUTTON */}
              <button
                onClick={() => setOpenIndex(isCurrentOpen ? null : index)}
                className={`w-full text-left px-5 sm:px-6 py-5 flex items-center justify-between font-semibold text-base sm:text-lg text-zinc-800 dark:text-zinc-100 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all duration-150 select-none ${
                  isCurrentOpen ? "bg-emerald-50/30 dark:bg-emerald-950/15 text-emerald-700 dark:text-emerald-400" : ""
                }`}
              >
                <span className="pr-6 tracking-normal leading-normal">{faq.q}</span>
                <svg 
                  className={`w-5 h-5 transform text-zinc-400 dark:text-zinc-500 flex-shrink-0 transition-transform duration-200 ${
                    isCurrentOpen ? "rotate-180 text-emerald-600 dark:text-emerald-500" : ""
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* DYNAMIC COLLAPSIBLE INSIGHT SLAT */}
              {isCurrentOpen && (
                <div className="px-5 sm:px-6 pb-5 text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/60 pt-4 bg-zinc-50/40 dark:bg-zinc-950/10">
                  <p className="whitespace-pre-line antialiased">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
