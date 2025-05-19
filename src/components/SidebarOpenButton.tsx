'use client'

import { useSidebar } from "@/context/SidebarContext";
import { Menu, X } from "lucide-react";

const SidebarOpenButton = () => {
  const { state, toggleSidebar } = useSidebar();

  return (
    <button
      aria-label={state.isOpen ? "Close sidebar" : "Open sidebar"}
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 bg-signlang-primary text-white p-2 rounded-full shadow-lg hover:bg-signlang-accent transition"
    >
      {state.isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </button>
  );
};

export default SidebarOpenButton; 