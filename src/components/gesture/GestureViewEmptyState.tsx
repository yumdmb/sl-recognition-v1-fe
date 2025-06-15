"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card>
      <CardContent className="text-center py-12">
        <HandHeart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {isMySubmissions
            ? "You haven't submitted any gestures yet"
            : "No Gesture Contributions Found"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {isMySubmissions
            ? "Contribute your first gesture to see it here."
            : userRole === "admin"
            ? "There are no pending contributions to review at the moment."
            : "No contributions match the current filters."}
        </p>
        <Button asChild>
          <Link href="/gesture/submit">
            <Plus className="mr-2 h-4 w-4" />
            Contribute a Gesture
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
