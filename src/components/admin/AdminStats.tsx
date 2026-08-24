'use client'

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Ear, EarOff, Clock, GraduationCap, BookOpen, TrendingUp, AlertCircle, Hand, User, ArrowRight } from "lucide-react";

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
  pendingGestureContributions: number;
  pendingAvatarContributions: number;
  proficiencyDistribution: ProficiencyDistribution;
  activeLearners: number;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
  totalUsers,
  deafUsers,
  nonDeafUsers,
  pendingGestureContributions,
  pendingAvatarContributions,
  proficiencyDistribution,
  activeLearners,
}) => {
  const totalPendingContributions = pendingGestureContributions + pendingAvatarContributions;
  const totalAssessed = proficiencyDistribution.beginner + proficiencyDistribution.intermediate + proficiencyDistribution.advanced;

  const stats = [
    {
      icon: Users,
      tone: 'bg-primary-soft text-primary',
      value: totalUsers,
      label: 'Total learners',
      sub: 'excluding admins',
    },
    {
      icon: Ear,
      tone: 'bg-sky/10 text-sky',
      value: deafUsers,
      label: 'Deaf members',
      sub: 'primary signers',
    },
    {
      icon: EarOff,
      tone: 'bg-sun/10 text-sun',
      value: nonDeafUsers,
      label: 'Hearing learners',
      sub: 'learning to sign',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Botanical user stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="card-lift gap-0">
            <CardContent className="flex items-center gap-4">
              <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${s.tone}`}>
                <s.icon className="size-5.5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-3xl font-extrabold leading-none tracking-tight">{s.value}</p>
                <p className="mt-1.5 truncate text-sm font-semibold">{s.label}</p>
                <p className="truncate text-xs text-muted-foreground">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement & Actions Row - from origin, styled botanically */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Contributions - Actionable */}
        <Card className={`card-lift gap-0 ${totalPendingContributions > 0 ? "border-amber-200 bg-amber-50/30" : ""}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold">Pending Contributions</h3>
              {totalPendingContributions > 0 && (
                <span className="flex items-center gap-1 text-amber-700 text-xs font-semibold">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Requires Action
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <span className={`grid size-12 place-items-center rounded-2xl ${totalPendingContributions > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                <Clock className="size-5.5" />
              </span>
              <div>
                <p className="font-display text-3xl font-extrabold">{totalPendingContributions}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {totalPendingContributions === 0 ? 'All caught up!' : 'Awaiting review'}
                </p>
              </div>
            </div>
            
            {/* Breakdown by type */}
            {totalPendingContributions > 0 && (
              <div className="mt-4 pt-4 border-t border-amber-200 grid grid-cols-2 gap-4">
                <Link 
                  href="/gesture/view"
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-amber-100/60 transition-colors group cursor-pointer border border-transparent hover:border-amber-200"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors">
                    <Hand className="size-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{pendingGestureContributions}</p>
                      <ArrowRight className="h-3.5 w-3.5 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground">Gesture</p>
                  </div>
                </Link>
                
                <Link 
                  href="/avatar/admin-database?status=pending"
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-amber-100/60 transition-colors group cursor-pointer border border-transparent hover:border-amber-200"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                    <User className="size-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{pendingAvatarContributions}</p>
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground">Avatar</p>
                  </div>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Learners */}
        <Card className="card-lift gap-0">
          <CardContent className="p-6">
            <h3 className="font-display text-base font-bold">Active Learners</h3>
            <div className="flex items-center space-x-4 mt-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <BookOpen className="size-5.5" />
              </span>
              <div>
                <p className="font-display text-3xl font-extrabold">{activeLearners}</p>
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

      {/* Proficiency Distribution - botanical */}
      <Card className="card-lift gap-0">
        <CardContent className="p-6">
          <h3 className="font-display text-base font-bold mb-4">Proficiency Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-2xl bg-primary-soft border border-primary/10">
              <GraduationCap className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="font-display text-2xl font-bold text-primary">{proficiencyDistribution.beginner}</p>
              <p className="text-sm font-medium text-primary/80">Beginner</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-sky/10 border border-sky/20">
              <GraduationCap className="h-6 w-6 mx-auto text-sky mb-2" />
              <p className="font-display text-2xl font-bold text-sky">{proficiencyDistribution.intermediate}</p>
              <p className="text-sm font-medium text-sky/80">Intermediate</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-sun/10 border border-sun/20">
              <GraduationCap className="h-6 w-6 mx-auto text-sun mb-2" />
              <p className="font-display text-2xl font-bold text-sun">{proficiencyDistribution.advanced}</p>
              <p className="text-sm font-medium text-sun/80">Advanced</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-muted border border-border">
              <GraduationCap className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="font-display text-2xl font-bold text-muted-foreground">{proficiencyDistribution.unassessed}</p>
              <p className="text-sm font-medium text-muted-foreground">Unassessed</p>
            </div>
          </div>
          {totalAssessed > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                <div 
                  className="bg-primary transition-all" 
                  style={{ width: `${(proficiencyDistribution.beginner / (totalAssessed || 1)) * 100}%` }}
                />
                <div 
                  className="bg-sky transition-all" 
                  style={{ width: `${(proficiencyDistribution.intermediate / (totalAssessed || 1)) * 100}%` }}
                />
                <div 
                  className="bg-sun transition-all" 
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
