import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="w-full p-[15px] gap-[15px] h-screen flex flex-col overflow-hidden bg-[rgba(0,0,0,0.5)] backdrop-blur-[10px]">

      {/* Navigation Bar Top (80px) */}
      <div className="w-full h-[70px]">
        {children.navbar}
      </div>

      {/* Page Content scrollable */}
      <div className="flex-1 rounded-[10px] overflow-y-auto scrollbar-hide">
        {children.page}
      </div>

    </div>
  );
};

export default Layout;
