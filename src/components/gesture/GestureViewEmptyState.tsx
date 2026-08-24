"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HandHeart, Plus } from "lucide-react";
import Link from "next/link";

interface GestureViewEmptyStateProps {
  userRole?: string;
  isMySubmissions?: boolean; // New prop
}

export default function GestureViewEmptyState({
  userRole,
  isMySubmissions = false,
}: GestureViewEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <HandHeart className="size-6" />
      </span>
      <h3 className="font-display mt-5 text-lg font-bold">
        {isMySubmissions
          ? "You haven't submitted any gestures yet"
          : "No Gesture Contributions Found"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {isMySubmissions
          ? "Contribute your first gesture to see it here."
          : userRole === "admin"
          ? "There are no pending contributions to review at the moment."
          : "No contributions match the current filters."}
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link href="/gesture/submit">
          <Plus className="mr-2 h-4 w-4" />
          Contribute a Gesture
        </Link>
      </Button>
    </div>
  );
}
