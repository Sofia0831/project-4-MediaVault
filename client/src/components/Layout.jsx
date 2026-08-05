import React from "react";
import { Outlet } from "react-router-dom";
import HeaderNav from "./HeaderNav";
import Breadcrumbs from "./Breadcrumbs";
import { BreadcrumbProvider } from "../context/BreadcrumbContext";
import "./Layout.css";

const Layout = () => {
  return (
    <BreadcrumbProvider>
      <div className="app-layout">
        <HeaderNav />
        <main className="main-content">
          <div className="content-container">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </BreadcrumbProvider>
  );
};

export default Layout;