"use client";

import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { useEffect, useRef } from "react";

interface NavbarProps {
  isNavOpen: boolean;
  handleToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isNavOpen, handleToggle }) => {
  return (
    <header className="shadow-sm text-center z-3">
      <nav className="bg-white navbar navbar-expand-lg navbar-light bg-light px-3 align-items-center fixed-top border-bottom">
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
                href="/client/restaurants"
                className="nav-link text-primary"
              >
                Restaurants
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/client/bookings" className="nav-link text-primary">
                Bookings
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/client/profile" className="nav-link text-primary">
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
