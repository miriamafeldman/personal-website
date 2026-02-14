"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeLink() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link href="/" className="home-mark clickable" aria-label="Return to weekly calendar">
      MAF
    </Link>
  );
}
