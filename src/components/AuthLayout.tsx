"use client";

import { ReactNode } from "react";
import { colors } from "@/styles/theme";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="container-fluid p-0"
      style={{ minHeight: "100vh", overflowX: "hidden" }}
    >
      <div className="col-12 p-0 d-block d-md-none" style={{ height: "100px" }}>
        <div
          style={{
            backgroundImage: "url('/login-background.png')",
            backgroundSize: "50%",
            backgroundPosition: "90% 60%",
            height: "100%",
            width: "100%",
          }}
        />
      </div>
      <div className="row g-0">
        <div
          className="col-md-6 d-flex flex-column justify-content-center align-items-center p-5"
          style={{
            backgroundColor: colors.paleBackground,
            minHeight: "calc(100vh - 100px)",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>{children}</div>
        </div>
        <div
          className="col-md-6 d-none d-md-block p-0"
          style={{ height: "100vh" }}
        >
          <div
            style={{
              backgroundImage: "url('/login-background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
