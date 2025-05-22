"use client";

import { ReactNode } from "react";
import styles from "./AuthLayout.module.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`container-fluid p-0 ${styles.authWrapper}`}>
      <div
        className={`col-12 p-0 d-block d-md-none ${styles.mobileHeaderWrapper}`}
      >
        <div className={`${styles.mobileHeader}`} />
      </div>
      <div className="row g-0">
        <div
          className={`col-md-6 d-flex flex-column justify-content-center align-items-center p-5 ${styles.authContent}`}
        >
          <div className={`${styles.authInner}`}>{children}</div>
        </div>
        <div
          className={`col-md-6 d-none d-md-block p-0 ${styles.authBackgroundDesktopWrapper}`}
        >
          <div className={`${styles.authBackgroundDesktop}`} />
        </div>
      </div>
    </div>
  );
}
