"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type CSSProperties } from "react";

type MenuGroup = {
  label: string;
  colorVar: string;
  items: Array<{ label: string; href: string }>;
};

const menuGroups: MenuGroup[] = [
  {
    label: "WORK",
    colorVar: "var(--blue)",
    items: [
      { label: "Strategy", href: "/office" },
      { label: "Nonprofits", href: "/board-meeting" },
    ],
  },
  {
    label: "MAKE",
    colorVar: "var(--olive)",
    items: [
      { label: "Studio", href: "/studio" },
      { label: "Writing", href: "/writing" },
    ],
  },
  {
    label: "VISIT",
    colorVar: "var(--brown)",
    items: [{ label: "Gallery", href: "/gallery" }],
  },
  {
    label: "READ",
    colorVar: "var(--gold)",
    items: [
      { label: "Tube", href: "/reading" },
      { label: "Newspaper", href: "/newspaper" },
    ],
  },
];

export default function BottomMenu() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hideMenu = pathname === "/";

  const activeHref = useMemo(() => {
    const allItems = menuGroups.flatMap((group) => group.items);
    const exactMatch = allItems.find((item) => item.href === pathname);
    if (exactMatch) {
      return exactMatch.href;
    }
    if (pathname.startsWith("/galleries")) {
      return "/gallery";
    }
    return "";
  }, [pathname]);

  if (hideMenu) {
    return null;
  }

  return (
    <>
      <nav className="bottom-menu desktop-menu" aria-label="Section navigation">
        <div className="bottom-menu-inner">
          {menuGroups.map((group) => (
            <div className="menu-group" key={group.label}>
              <span
                className="menu-group-label"
                style={{ "--group-color": group.colorVar } as CSSProperties}
              >
                {group.label}
              </span>
              <div className="menu-subitems">
                {group.items.map((item) => {
                  const isActive = activeHref === item.href;
                  return (
                    <Link
                      href={item.href}
                      key={item.href}
                      className={`menu-subitem ${isActive ? "menu-subitem-active" : ""}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <nav className="bottom-menu mobile-menu" aria-label="Section navigation">
        <div className="mobile-menu-shell">
          <button
            type="button"
            className="mobile-menu-trigger clickable"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
          <div className={`mobile-menu-panel ${mobileOpen ? "open" : ""}`}>
            {menuGroups.map((group) => (
              <div className="mobile-menu-group" key={group.label}>
                <span className="mobile-menu-label">{group.label}</span>
                <div className="mobile-menu-links">
                  {group.items.map((item) => {
                    const isActive = activeHref === item.href;
                    return (
                      <Link
                        href={item.href}
                        key={item.href}
                        className={`mobile-menu-link ${isActive ? "mobile-menu-link-active" : ""}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
