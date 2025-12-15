'use client'

import { useState, useEffect } from 'react';
import { User } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Flag, CheckCircle, XCircle } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" /> User Verification
        </CardTitle>
        <CardDescription>Verify new user accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-signlang-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Loading users...</p>
          </div>
        ) : users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.role === 'deaf' ? 
                      "bg-purple-100 text-purple-800 border-purple-300" : 
                      "bg-blue-100 text-blue-800 border-blue-300"}>
                      {user.role === 'deaf' ? 'Deaf User' : 'Regular User'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.id)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => verifyUser(user.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Verify
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => rejectUser(user.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No pending user verifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const WordVerification: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flag className="h-5 w-5 mr-2" /> Word Verification
        </CardTitle>
        <CardDescription>Review and approve user-submitted sign language words</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-gray-500">No pending word submissions to verify</p>
          <p className="text-gray-400 text-sm mt-2">Word verification functionality will be implemented in a future update</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Admin Page Component
// Note: Role-based access is enforced by middleware - no client-side check needed
export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="user-verification" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user-verification" className="flex items-center justify-center">
            <Users className="h-4 w-4 mr-2" /> User Verification
          </TabsTrigger>
          <TabsTrigger value="word-verification" className="flex items-center justify-center">
            <Flag className="h-4 w-4 mr-2" /> Word Verification
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="user-verification" className="mt-6">
          <UserVerification />
        </TabsContent>
        
        <TabsContent value="word-verification" className="mt-6">
          <WordVerification />
        </TabsContent>
      </Tabs>
    </div>
  );
}