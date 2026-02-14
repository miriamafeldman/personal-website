"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type NavGroup = {
  label: string;
  color: string;
  items: Array<{ label: string; href: string }>;
};

const navGroups: NavGroup[] = [
  {
    label: "Work",
    color: "var(--blue)",
    items: [
      { label: "Strategy", href: "/office" },
      { label: "Nonprofits", href: "/board-meeting" },
    ],
  },
  {
    label: "Make",
    color: "var(--red)",
    items: [
      { label: "Studio", href: "/studio" },
      { label: "Writing", href: "/writing" },
      { label: "Me Time", href: "/me-time" },
    ],
  },
  {
    label: "Visit",
    color: "var(--olive)",
    items: [
      { label: "Gallery", href: "/galleries" },
      { label: "Dinner", href: "/dinner" },
    ],
  },
  {
    label: "Read",
    color: "var(--gold)",
    items: [
      { label: "Books", href: "/reading" },
      { label: "Web", href: "/newspaper" },
    ],
  },
];

function getPageColor(pathname: string): string {
  if (pathname === "/" || pathname.startsWith("/office")) return "var(--blue)";
  if (pathname.startsWith("/studio") || pathname.startsWith("/me-time")) return "var(--olive)";
  if (pathname.startsWith("/writing") || pathname.startsWith("/dinner")) return "var(--red)";
  if (pathname.startsWith("/galleries") || pathname.startsWith("/gallery")) return "var(--brown)";
  if (pathname.startsWith("/reading") || pathname.startsWith("/newspaper")) return "var(--gold)";
  if (pathname.startsWith("/board-meeting")) return "var(--brown)";
  return "var(--blue)";
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!navRef.current) return;
      const target = event.target as Node;
      if (!navRef.current.contains(target)) {
        setOpenGroup(null);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const pageColor = useMemo(() => getPageColor(pathname), [pathname]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          className={`site-title-link ${pathname !== "/" ? "site-title-page-accent" : ""}`}
          style={{ "--page-color": pageColor } as CSSProperties}
          onClick={() => setOpenGroup(null)}
        >
          Miriam Ames Feldman
        </Link>

        <nav className="site-nav" aria-label="Primary" ref={navRef}>
          <Link
            href="/"
            className={`nav-pill clickable ${pathname === "/" ? "nav-pill-active" : ""}`}
            onClick={() => setOpenGroup(null)}
          >
            Calendar
          </Link>

          {navGroups.map((group) => {
            const isOpen = openGroup === group.label;
            const hasActiveChild = group.items.some((item) => {
              if (item.href === "/galleries") {
                return pathname === "/galleries" || pathname === "/gallery";
              }
              return pathname === item.href;
            });

            return (
              <div key={group.label} className="site-nav-group">
                <button
                  type="button"
                  className={`group-trigger clickable ${hasActiveChild ? "group-trigger-active" : ""}`}
                  style={{ "--group-color": group.color } as CSSProperties}
                  onClick={() => setOpenGroup((current) => (current === group.label ? null : group.label))}
                  aria-expanded={isOpen}
                >
                  {group.label}
                </button>

                <div className={`group-dropdown ${isOpen ? "open" : ""}`}>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href === "/galleries" && pathname === "/gallery");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group-link clickable ${isActive ? "group-link-active" : ""}`}
                        onClick={() => setOpenGroup(null)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
