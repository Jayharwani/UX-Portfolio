import { useEffect, useRef, useState } from "react";
import { contact, site } from "../../content/home";
import { announce } from "../../lib/announce";

/* --------------------------------------------------------------------------
   CONTACT.

   The address is a mailto link at title size, because the one thing this page
   is for is someone deciding to write. The Copy button beside it is for the
   other half of people, who want the string rather than their mail client.

   THE CLIPBOARD CAN SAY NO. It is unavailable over plain http, blocked by
   permissions policy, and refused when the document is not focused. So the
   failure path is not a shrug: the address gets selected, and the reader is
   told which keys to press (§6.7).
   -------------------------------------------------------------------------- */

type Status = "idle" | "copied" | "manual";

const Arrow = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path
      d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Contact() {
  const address = useRef<HTMLAnchorElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = window.setTimeout(() => setStatus("idle"), status === "copied" ? 1600 : 3000);
    return () => window.clearTimeout(t);
  }, [status]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setStatus("copied");
      announce(contact.copiedAnnouncement);
    } catch {
      /* select it, so the keys the message names actually do something */
      const el = address.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setStatus("manual");
      announce(contact.clipboardFallback);
    }
  };

  const links = [
    { label: "LinkedIn", href: site.linkedin },
    { label: "Resume", href: site.resumeHref },
    ...(site.showGitHub ? [{ label: "GitHub", href: site.githubHref }] : []),
  ];

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">{contact.heading}</h2>

      <div className="contact-row">
        <a className="contact-email" href={`mailto:${site.email}`} ref={address}>
          {site.email}
        </a>
        <button type="button" className="btn btn--secondary contact-copy" onClick={onCopy}>
          {status === "copied" ? (
            <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <path
                d="M2.5 6.5 5 9l4.5-5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 2.5H2.5a1 1 0 0 0-1 1V8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          )}
          {status === "copied" ? contact.copiedLabel : contact.copyLabel}
        </button>
      </div>

      {status === "manual" ? <p className="contact-manual">{contact.clipboardFallback}</p> : null}

      <p className="contact-links">
        {links.map((l) => (
          <a key={l.label} className="link-ext" href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label}
            <Arrow />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        ))}
      </p>

      <p className="status">
        <span className="status-open">
          <i className="dot" aria-hidden="true" />
          {site.status}
        </span>
        <span className="status-where">{site.location}</span>
      </p>
    </section>
  );
}
