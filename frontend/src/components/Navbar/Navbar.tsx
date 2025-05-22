"use client";

import Link from "next/link";
import styles from "@/Navbar.module.css";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import { useStore } from "@/stores/context";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";

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
  const { loginStore, userStore, bookingStore } = useStore();
  const navbarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  useEffect(() => {
    if (userStore.user && bookingStore.bookings.length === 0) {
      bookingStore.fetchBookings();
    }
  }, [userStore.user]);

  const confirmedBookings = useMemo(() => {
    return bookingStore.bookings.filter((b) => b.status === "confirmed").length;
  }, [bookingStore.bookings.length]);

  const handleLogoClick = async () => {
    await userStore.checkAuth();

    setTimeout(() => {
      if (!userStore.user) {
        router.push("/");
      } else {
        router.push("/user/restaurants");
      }
    }, 10);
  };

  return (
    <header className="shadow-sm text-center z-3">
      <nav
        ref={navbarRef}
        className="bg-light navbar navbar-expand-lg navbar-light bg-light px-3 align-items-center fixed-top border-bottom"
      >
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={handleLogoClick}
          className="navbar-brand fw-bold fs-4 d-flex align-items-center m-0"
        >
          <img src="/logo.png" alt="Invite Me" style={{ height: "40px" }} />
        </div>
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
          <ul
            className="navbar-nav mb-2 mb-lg-0 d-flex align-items-lg-center align-items-end gap-lg-4 fw-bold z-100"
            style={{ zIndex: 10 }}
          >
            <li className="nav-item">
              <Link
                href="/user/restaurants"
                onClick={() => setIsNavOpen(false)}
                className="nav-link"
              >
                Restaurants
              </Link>
            </li>
            <li className="nav-item position-relative">
              <Link
                href="/user/bookings"
                onClick={() => setIsNavOpen(false)}
                className="nav-link"
              >
                Bookings
                {confirmedBookings && (
                  <span
                    className="position-absolute top-0 end-0 badge rounded-pill bg-primary"
                    style={{
                      fontSize: "0.7rem",
                      transform: "translateX(10px)",
                    }}
                  >
                    {confirmedBookings}
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/user/profile"
                onClick={() => setIsNavOpen(false)}
                className="nav-link"
              >
                <img
                  src={
                    userStore.user?.profile_pic_url
                      ? userStore.user.profile_pic_url
                      : "/user.png"
                  }
                  alt="Profile"
                  className="img-fluid rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </li>
            <li className="nav-item">
              <button
                onClick={() => {
                  loginStore.logout();
                  userStore.removeUser();
                  setIsNavOpen(false);
                  router.push("/");
                }}
                className="nav-link text-secondary p-lg-0"
              >
                <i
                  className="fa fa-sign-out"
                  style={{
                    fontSize: "20px",
                  }}
                ></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default observer(Navbar);
