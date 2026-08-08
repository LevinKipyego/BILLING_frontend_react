

import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Facebook,
  Twitter,
  ExternalLink,
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface AppFooterProps {
  /**
   * Application/company name
   */
  appName?: string;

  /**
   * Short description shown beside the application name
   */
  description?: string;

  /**
   * Copyright year
   */
  year?: number;

  /**
   * Contact information
   */
  email?: string;
  phone?: string;
  location?: string;

  /**
   * Website
   */
  website?: string;

  /**
   * Optional navigation links
   */
  links?: FooterLink[];

  /**
   * Optional social links
   */
  social?: {
    github?: string;
    facebook?: string;
    twitter?: string;
  };

  /**
   * Optional version
   */
  version?: string;

  /**
   * Hide the contact section
   */
  showContacts?: boolean;

  /**
   * Hide the social section
   */
  showSocial?: boolean;

  /**
   * Compact footer for small pages such as Login/Signup
   */
  compact?: boolean;

  /**
   * Optional custom class
   */
  className?: string;
}

export default function AppFooter({
  appName = "ISP Management",
  description = "ISP billing and network management platform.",
  year = new Date().getFullYear(),

  email,
  phone,
  location,

  website,

  links = [],

  social,

  version,

  showContacts = true,
  showSocial = true,

  compact = false,

  className = "",
}: AppFooterProps) {
  const hasContacts =
    showContacts && (email || phone || location || website);

  const hasSocial =
    showSocial &&
    (social?.github || social?.facebook || social?.twitter);

  return (
    <footer
      className={`
        w-full
        border-t
        border-slate-200
        bg-white
        text-slate-600
        dark:border-slate-800
        dark:bg-[#0d1117]
        dark:text-slate-400
        ${className}
      `}
    >
      <div
        className={`
          mx-auto
          w-full
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
          ${compact ? "py-5" : "py-8"}
        `}
      >
        {/* ==========================================
            COMPACT FOOTER
        ========================================== */}

        {compact ? (
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                © {year} {appName}
              </p>

              <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="
                    text-[10px]
                    font-medium
                    text-slate-500
                    transition-colors
                    hover:text-blue-600
                    dark:text-slate-400
                    dark:hover:text-blue-400
                  "
                >
                  {link.label}
                </a>
              ))}

              {version && (
                <span className="text-[10px] text-slate-400 dark:text-slate-600">
                  v{version}
                </span>
              )}
            </div>
          </div>
        ) : (
          /* ==========================================
             FULL FOOTER
          ========================================== */

          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

              {/* ======================================
                  BRAND
              ====================================== */}

              <div className="lg:col-span-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {appName}
                </h3>

                <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {description}
                </p>

                {version && (
                  <p className="mt-3 text-[10px] text-slate-400 dark:text-slate-600">
                    Version {version}
                  </p>
                )}
              </div>

              {/* ======================================
                  CONTACTS
              ====================================== */}

              {hasContacts && (
                <div>
                  <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Contact
                  </h4>

                  <div className="space-y-3">

                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="
                          flex
                          items-center
                          gap-2.5
                          text-xs
                          transition-colors
                          hover:text-blue-600
                          dark:hover:text-blue-400
                        "
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="break-all">{email}</span>
                      </a>
                    )}

                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="
                          flex
                          items-center
                          gap-2.5
                          text-xs
                          transition-colors
                          hover:text-blue-600
                          dark:hover:text-blue-400
                        "
                      >
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{phone}</span>
                      </a>
                    )}

                    {location && (
                      <div className="flex items-start gap-2.5 text-xs">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{location}</span>
                      </div>
                    )}

                    {website && (
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex
                          items-center
                          gap-2.5
                          text-xs
                          transition-colors
                          hover:text-blue-600
                          dark:hover:text-blue-400
                        "
                      >
                        <Globe className="h-3.5 w-3.5 shrink-0" />
                        <span>Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================
                  LINKS
              ====================================== */}

              {links.length > 0 && (
                <div>
                  <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Resources
                  </h4>

                  <div className="space-y-2.5">
                    {links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={
                          link.external
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-xs
                          transition-colors
                          hover:text-blue-600
                          dark:hover:text-blue-400
                        "
                      >
                        {link.label}

                        {link.external && (
                          <ExternalLink className="h-3 w-3" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================
                  SOCIAL
              ====================================== */}

              {hasSocial && (
                <div>
                  <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Connect
                  </h4>

                  <div className="flex items-center gap-2">

                    {social?.github && (
                      <a
                        href={social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-slate-200
                          text-slate-500
                          transition-colors
                          hover:border-slate-400
                          hover:text-slate-900
                          dark:border-slate-700
                          dark:hover:border-slate-500
                          dark:hover:text-white
                        "
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}

                    {social?.facebook && (
                      <a
                        href={social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-slate-200
                          text-slate-500
                          transition-colors
                          hover:border-blue-400
                          hover:text-blue-600
                          dark:border-slate-700
                          dark:hover:border-blue-500
                          dark:hover:text-blue-400
                        "
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}

                    {social?.twitter && (
                      <a
                        href={social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter / X"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-slate-200
                          text-slate-500
                          transition-colors
                          hover:border-slate-400
                          hover:text-slate-900
                          dark:border-slate-700
                          dark:hover:border-slate-500
                          dark:hover:text-white
                        "
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ========================================
                BOTTOM BAR
            ======================================== */}

            <div
              className="
                mt-8
                flex
                flex-col
                gap-3
                border-t
                border-slate-100
                pt-5
                text-[10px]
                text-slate-400
                dark:border-slate-800
                dark:text-slate-500
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <p>
                © {year} {appName}. All rights reserved.
              </p>

              <div className="flex flex-wrap gap-4">
                <span>Secure platform</span>
                <span>Built for ISPs</span>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}

