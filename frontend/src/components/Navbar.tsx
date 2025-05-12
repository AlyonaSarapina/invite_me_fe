"use client";

import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface NavbarProps {
  isNavOpen: boolean;
  setIsNavOpen: Dispatch<SetStateAction<boolean>>;
  handleToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isNavOpen,
  setIsNavOpen,
  handleToggle,
}) => {
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="shadow-sm text-center z-3">
      <nav
        ref={navbarRef}
        className="bg-white navbar navbar-expand-lg navbar-light bg-light px-3 align-items-center fixed-top border-bottom"
      >
        <Link
          href="/"
          className="navbar-brand fw-bold fs-4 d-flex align-items-center m-0"
        >
          <img src="/logo.png" alt="Invite Me" style={{ height: "40px" }} />
        </Link>
        <button
          className={`${styles.customToggler} navbar-toggler`}
          type="button"
          onClick={handleToggle}
          aria-controls="navbarNav"
          aria-expanded={isNavOpen ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`navbar-collapse ${styles.customCollapse} ${
            isNavOpen ? styles.open : ""
          } justify-content-end`}
          id="navbarNav"
        >
          <ul className="navbar-nav mb-2 mb-lg-0 d-flex align-items-end fw-bold">
            <li className="nav-item">
              <Link
                href="/user/restaurants"
                onClick={() => setIsNavOpen(false)}
                className="nav-link text-primary"
              >
                Restaurants
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/user/bookings"
                onClick={() => setIsNavOpen(false)}
                className="nav-link text-primary"
              >
                Bookings
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/user/profile"
                onClick={() => setIsNavOpen(false)}
                className="nav-link text-primary"
              >
                My profile
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/" className="nav-link text-dark">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
