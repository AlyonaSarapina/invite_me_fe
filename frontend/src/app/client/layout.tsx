"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar isNavOpen={isNavOpen} handleToggle={handleToggle} />
      <div className="container flex-grow-1 py-5">
        <main>{children}</main>
      </div>
      <footer className="text-center py-4 bg-white border-top">
        <div>© {new Date().getFullYear()} Invite Me. All rights reserved.</div>
        <div>
          Contact us at{" "}
          <a
            href="mailto:support@inviteme.com"
            className="text-decoration-underline"
          >
            support@inviteme.com
          </a>
        </div>
      </footer>
    </div>
  );
}
