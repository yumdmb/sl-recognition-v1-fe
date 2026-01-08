"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Ear, EarOff, Clock, GraduationCap, BookOpen, TrendingUp, AlertCircle } from "lucide-react";

interface ProficiencyDistribution {
  beginner: number;
  intermediate: number;
  advanced: number;
  unassessed: number;
}

interface AdminStatsProps {
  totalUsers: number;
  deafUsers: number;
  nonDeafUsers: number;
  pendingContributions: number;
  proficiencyDistribution: ProficiencyDistribution;
  activeLearners: number;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
  totalUsers,
  deafUsers,
  nonDeafUsers,
  pendingContributions,
  proficiencyDistribution,
  activeLearners,
}) => {
  const totalAssessed = proficiencyDistribution.beginner + proficiencyDistribution.intermediate + proficiencyDistribution.advanced;
  
  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">User Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-700">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-700">
                <Ear className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{deafUsers}</p>
                <p className="text-sm font-medium text-muted-foreground">Deaf Users</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-pink-100 text-pink-700">
                <EarOff className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{nonDeafUsers}</p>
                <p className="text-sm font-medium text-muted-foreground">Non-Deaf Users</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement & Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Contributions - Actionable */}
        <Card className={pendingContributions > 0 ? "border-amber-300 bg-amber-50/50" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Pending Contributions</h3>
              {pendingContributions > 0 && (
                <span className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  Requires Action
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className={`p-3 rounded-full ${pendingContributions > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{pendingContributions}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {pendingContributions === 0 ? 'All caught up!' : 'Awaiting review'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Learners */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium">Active Learners</h3>
            <div className="flex items-center space-x-4 mt-4">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{activeLearners}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  Users with learning progress
                </p>
              </div>
            </div>
            {totalUsers > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span>{((activeLearners / totalUsers) * 100).toFixed(1)}% engagement rate</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Proficiency Distribution */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Proficiency Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <GraduationCap className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-700">{proficiencyDistribution.beginner}</p>
              <p className="text-sm font-medium text-green-600">Beginner</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <GraduationCap className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-700">{proficiencyDistribution.intermediate}</p>
              <p className="text-sm font-medium text-blue-600">Intermediate</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <GraduationCap className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-700">{proficiencyDistribution.advanced}</p>
              <p className="text-sm font-medium text-purple-600">Advanced</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
              <GraduationCap className="h-6 w-6 mx-auto text-gray-500 mb-2" />
              <p className="text-2xl font-bold text-gray-600">{proficiencyDistribution.unassessed}</p>
              <p className="text-sm font-medium text-gray-500">Unassessed</p>
            </div>
          </div>
          {totalAssessed > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                <div 
                  className="bg-green-500 transition-all" 
                  style={{ width: `${(proficiencyDistribution.beginner / (totalAssessed || 1)) * 100}%` }}
                />
                <div 
                  className="bg-blue-500 transition-all" 
                  style={{ width: `${(proficiencyDistribution.intermediate / (totalAssessed || 1)) * 100}%` }}
                />
                <div 
                  className="bg-purple-500 transition-all" 
                  style={{ width: `${(proficiencyDistribution.advanced / (totalAssessed || 1)) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {totalAssessed} users have completed proficiency assessment
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
