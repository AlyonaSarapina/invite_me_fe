"use client";

import { ReactNode, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "@/stores/context";
import { useRouter } from "next/navigation";

function ClientLayout({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { userStore } = useStore();
  const router = useRouter();

  const handleToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    if (!authChecked) {
      userStore.checkAuth().then(() => setAuthChecked(true));
    }
  }, [authChecked]);

  useEffect(() => {
    if (authChecked && !userStore.loading && !userStore.user) {
      router.replace("/");
    }
  }, [authChecked, userStore.loading, userStore.user]);

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
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            zIndex: 1,
          }}
        />
        <div className="container position-relative" style={{ zIndex: 2 }}>
          {authChecked && !userStore.loading && userStore.user ? (
            <main>{children}</main>
          ) : (
            <div className="text-center py-5">Loading...</div>
          )}
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
      <ToastContainer
        position="top-right"
        aria-label="Notifications"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        theme="colored"
      />
    </div>
  );
}

export default ClientLayout;
