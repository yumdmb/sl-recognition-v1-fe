'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileCheck, AlertTriangle, BarChart } from "lucide-react";
import { User } from '@/context/AuthContext';
import Link from 'next/link';

// QuickAccessPanel with verify users button
const QuickAccessPanel = ({ userRole, pendingVerifications }: { userRole: string, pendingVerifications: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">Verify User Accounts</h3>
        <p className="text-gray-500 mb-4">
          {pendingVerifications > 0 
            ? `${pendingVerifications} user${pendingVerifications === 1 ? '' : 's'} awaiting verification`
            : 'No pending verifications'}
        </p>
        <Link href="/admin">
          <button className="bg-signlang-primary text-gray-900 px-4 py-2 rounded w-full">
            Manage Accounts
          </button>
        </Link>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">Word Contributions</h3>
        <p className="text-gray-500 mb-4">Review submitted sign language words</p>
        <button className="bg-signlang-primary text-gray-900 px-4 py-2 rounded w-full">
          Review Words
        </button>
      </CardContent>
    </Card>
  </div>
);

const NotificationCenter = ({ userRole, pendingVerifications }: { userRole: string, pendingVerifications: number }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Notifications</h3>
      <div className="space-y-4">
        {pendingVerifications > 0 && (
          <div className="flex gap-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
            <div className="text-amber-500">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">New account verification needed</p>
              <p className="text-sm text-gray-500">
                {pendingVerifications} new user{pendingVerifications === 1 ? '' : 's'} awaiting verification
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <div className="text-blue-500">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Word contribution submitted</p>
            <p className="text-sm text-gray-500">New sign language word awaiting approval</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ActivitySummary = ({ userRole }: { userRole: string }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-green-400 pl-4">
          <p className="font-medium">User account approved</p>
          <p className="text-sm text-gray-500">10 minutes ago</p>
        </div>
        <div className="border-l-4 border-blue-400 pl-4">
          <p className="font-medium">System backup completed</p>
          <p className="text-sm text-gray-500">2 hours ago</p>
        </div>
        <div className="border-l-4 border-purple-400 pl-4">
          <p className="font-medium">Recognition model updated</p>
          <p className="text-sm text-gray-500">Yesterday at 15:30</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProgressChart = ({ userRole }: { userRole: string }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">System Performance</h3>
      <div className="h-64 flex items-center justify-center text-gray-500">
        [Chart would be implemented here]
      </div>
    </CardContent>
  </Card>
);

const AdminStats: React.FC<{ totalUsers: number, pendingVerifications: number }> = ({ 
  totalUsers, 
  pendingVerifications 
}) => {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: <Users className="h-5 w-5" />,
      change: "+12% from last month",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Pending Verifications",
      value: pendingVerifications.toString(),
      icon: <FileCheck className="h-5 w-5" />,
      change: pendingVerifications > 0 ? "Requires attention" : "All verified",
      color: pendingVerifications > 0 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
    },
    {
      title: "System Alerts",
      value: "2",
      icon: <AlertTriangle className="h-5 w-5" />,
      change: "Requires attention",
      color: "bg-red-100 text-red-700"
    },
    {
      title: "Recognition Accuracy",
      value: "94.7%",
      icon: <BarChart className="h-5 w-5" />,
      change: "+1.2% this week",
      color: "bg-green-100 text-green-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);

  useEffect(() => {
    // Get user data from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers);
      setTotalUsers(users.length);
      
      // Count unverified users
      const unverifiedUsers = users.filter(user => user.isVerified !== true);
      setPendingVerifications(unverifiedUsers.length);
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      
      <AdminStats totalUsers={totalUsers} pendingVerifications={pendingVerifications} />
      
      <QuickAccessPanel userRole="admin" pendingVerifications={pendingVerifications} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationCenter userRole="admin" pendingVerifications={pendingVerifications} />
        <ActivitySummary userRole="admin" />
      </div>
      
      <ProgressChart userRole="admin" />
    </div>
  );
};

export default AdminDashboard; 