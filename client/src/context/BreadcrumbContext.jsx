import React, { createContext, useContext, useState } from "react";

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbTitle, setBreadcrumbTitle] = useState("");

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbTitle, setBreadcrumbTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);