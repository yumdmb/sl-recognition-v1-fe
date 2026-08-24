'use client'

import { useState, useEffect } from 'react';
import { User } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Flag, CheckCircle, XCircle, ShieldCheck, Clock } from 'lucide-react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const roleBadgeClass = (role: string) =>
  cn(
    "border-transparent",
    role === "admin" && "bg-sun/10 text-sun",
    role === "deaf" && "bg-primary-soft text-primary",
    role === "non-deaf" && "bg-sky/10 text-sky"
  );

const roleLabel = (role: string) => {
  if (role === "admin") return "Admin";
  if (role === "deaf") return "Deaf User";
  return "Regular User";
};

// User Verification Component
const UserVerification: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use an empty array since user verification
    // will be handled through Supabase email verification
    // In a real implementation, you might fetch users from Supabase
    // who need manual verification
    setUsers([]);
    setLoading(false);
  }, []);

  const verifyUser = (id: string) => {
    // In a real implementation, you would update user metadata in Supabase
    // For now, just remove from the list
    setUsers(users.filter(user => user.id !== id));

    toast.success("User Verified", {
      description: "User has been successfully verified and can now log in."
    });
  };

  const rejectUser = (id: string) => {
    // In a real implementation, you would delete the user from Supabase
    // For now, just remove from the list
    setUsers(users.filter(user => user.id !== id));

    toast.success("User Rejected", {
      description: "User account has been rejected and removed from the system."
    });
  };

  const formatDate = (userId: string) => {
    // Extract timestamp from user ID (assuming format "user-{timestamp}")
    const timestamp = userId.split('-')[1];
    if (timestamp) {
      return new Date(parseInt(timestamp)).toLocaleString();
    }
    return 'Unknown date';
  };

  return (
    <Card className="rounded-2xl shadow-soft">
      <CardHeader>
        <div className="flex items-center gap-3.5">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <Users className="size-5" />
          </span>
          <div>
            <CardTitle className="font-display text-lg font-bold">User Verification</CardTitle>
            <CardDescription>Verify new user accounts</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Email</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Role</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Registered</TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleBadgeClass(user.role)}>
                        {roleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(user.id)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => verifyUser(user.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => rejectUser(user.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
              <ShieldCheck className="size-6" />
            </span>
            <h3 className="font-display mt-5 text-lg font-bold">No pending user verifications</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              New sign-ups that need manual review will appear here. You are all caught up.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const WordVerification: React.FC = () => {
  return (
    <Card className="rounded-2xl shadow-soft">
      <CardHeader>
        <div className="flex items-center gap-3.5">
          <span className="grid size-10 place-items-center rounded-xl bg-sun/10 text-sun">
            <Flag className="size-5" />
          </span>
          <div>
            <CardTitle className="font-display text-lg font-bold">Word Verification</CardTitle>
            <CardDescription>Review and approve user-submitted sign language words</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-sun/10 text-sun">
            <Flag className="size-6" />
          </span>
          <h3 className="font-display mt-5 text-lg font-bold">No pending word submissions</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Flagged and submitted words will be queued here for moderation. This view is coming soon.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Badge className="border-transparent bg-sun/10 text-sun">
              <Clock />
              Pending
            </Badge>
            <Badge>
              <CheckCircle />
              Resolved
            </Badge>
            <Badge className="border-transparent bg-destructive/10 text-destructive">
              <XCircle />
              Rejected
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Admin Page Component
// Note: Role-based access is enforced by middleware - no client-side check needed
export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Administration</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1.5 max-w-xl text-muted-foreground">
            Review new accounts and moderate community submissions.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <Tabs defaultValue="user-verification" className="space-y-6">
          <TabsList className="inline-flex h-auto w-full justify-start gap-1 rounded-full bg-muted p-1 sm:w-fit">
            <TabsTrigger
              value="user-verification"
              className="rounded-full px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-soft"
            >
              <Users className="h-4 w-4" />
              User Verification
            </TabsTrigger>
            <TabsTrigger
              value="word-verification"
              className="rounded-full px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-soft"
            >
              <Flag className="h-4 w-4" />
              Word Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user-verification" className="mt-6">
            <UserVerification />
          </TabsContent>

          <TabsContent value="word-verification" className="mt-6">
            <WordVerification />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
