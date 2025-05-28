"use client";

import { ReactNode, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useStore } from "@/stores/context";
import { observer } from "mobx-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function UserLayout({ children }: { children: ReactNode }) {
  const { userStore } = useStore();
  const { authReady } = useRequireAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <Navbar
        isNavOpen={isNavOpen}
        handleToggle={handleToggle}
        setIsNavOpen={setIsNavOpen}
      />

      <div
        className="flex-grow-1 py-5 position-relative"
        style={{
          backgroundImage: "url('/login-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.3)", zIndex: 1 }}
        />
        <div className="container position-relative" style={{ zIndex: 2 }}>
          {authReady && userStore.user && <main>{children}</main>}
        </div>
      </div>

      <footer className="text-center py-4 border-top">
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

export default observer(UserLayout);
