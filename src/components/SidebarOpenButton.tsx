'use client'

import { useSidebar } from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";

const SidebarOpenButton = () => {
  const { state, setOpen } = useSidebar();

  return (
    <button
      aria-label={state === "collapsed" ? "Open sidebar" : "Close sidebar"}
      onClick={() => setOpen(state === "collapsed")}
      className="fixed top-4 left-4 z-50 bg-signlang-primary text-white p-2 rounded-full shadow-lg hover:bg-signlang-accent transition"
    >
      {state === "collapsed" ? (
        <Menu className="h-6 w-6" />
      ) : (
        <X className="h-6 w-6" />
      )}
    </button>
  );
};

export default SidebarOpenButton; 