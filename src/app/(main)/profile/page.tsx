'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Edit, Award, KeyRound, GraduationCap, UserRound } from "lucide-react";
import { EditProfileDialog } from '@/components/user/EditProfileDialog';
import { ChangePasswordDialog } from '@/components/user/ChangePasswordDialog';
import { ProfilePictureUpload } from '@/components/user/ProfilePictureUpload';

export default function ProfilePage() {
  const { currentUser, updateUser, changePassword } = useAuth();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(currentUser?.profile_picture_url || null);

  // Sync profile picture with currentUser when it changes
  useEffect(() => {
    if (currentUser?.profile_picture_url !== undefined) {
      setProfilePictureUrl(currentUser.profile_picture_url);
    }
  }, [currentUser?.profile_picture_url]);

  // Handle profile picture update (silently, without toast from AuthContext)
  const handleProfilePictureUpdate = (newUrl: string | null) => {
    setProfilePictureUrl(newUrl);
  };

  const handleSaveProfile = async (updates: { name: string; email: string }) => {
    await updateUser(updates);
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    return await changePassword(newPassword);
  };

  if (!currentUser) {
    return null;
  }

  const initials = (currentUser.name || 'U')
    .split(' ')
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const roleLabel =
    currentUser.role === 'admin'
      ? 'Administrator'
      : currentUser.role === 'deaf'
        ? 'Deaf member'
        : 'Hearing learner';
  const roleTone =
    currentUser.role === 'admin'
      ? 'border-sun/30 bg-sun/10 text-sun'
      : currentUser.role === 'deaf'
        ? 'border-primary/25 bg-primary-soft text-primary'
        : 'border-sky/25 bg-sky/10 text-sky';

  const infoRows = [
    {
      icon: UserRound,
      tone: 'bg-primary-soft text-primary',
      label: 'Full name',
      value: currentUser.name,
    },
    {
      icon: Mail,
      tone: 'bg-sky/10 text-sky',
      label: 'Email',
      value: currentUser.email,
    },
    {
      icon: Calendar,
      tone: 'bg-coral/10 text-coral',
      label: 'Account type',
      value: roleLabel,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Hero card - botanical */}
      <Card className="relative overflow-hidden gap-0 border-border">
        <div className="bg-dots h-24 w-full bg-ink opacity-90" aria-hidden />
        <CardContent className="-mt-10 px-6 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              {/* Profile picture or initials */}
              <div className="-mb-1">
                <ProfilePictureUpload
                  userId={currentUser.id}
                  currentPictureUrl={profilePictureUrl}
                  userName={currentUser.name}
                  onUpdate={handleProfilePictureUpdate}
                />
              </div>
              <div className="pb-1">
                <h2 className="font-display text-2xl font-extrabold tracking-tight">{currentUser.name}</h2>
                <span className={`mt-1.5 inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${roleTone}`}>
                  {roleLabel}
                </span>
              </div>
            </div>
            <Button variant="outline" className="rounded-full" onClick={() => setIsEditDialogOpen(true)}>
              <Edit />
              Edit profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_1fr]">
        {/* Details - botanical + enriched */}
        <Card className="gap-0">
          <CardContent className="space-y-5 p-6">
            <h3 className="font-display text-base font-bold">Account details</h3>
            <div className="space-y-4">
              {infoRows.map((row) => (
                <div key={row.label} className="flex items-center gap-3.5">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${row.tone}`}>
                    <row.icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">{row.label}</p>
                    <p className="truncate text-sm font-semibold">{row.value}</p>
                  </div>
                </div>
              ))}

              {/* Proficiency - merged botanical + ASL/MSL breakdown */}
              <div className="flex items-start gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun/10 text-sun">
                  <Award className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Proficiency levels</p>
                  {currentUser.role !== 'admin' ? (
                    <div className="mt-2 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border bg-muted/40 p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🇺🇸</span>
                            <span className="text-xs font-semibold">ASL</span>
                          </div>
                          {currentUser.asl_proficiency_level ? (
                            <Badge className="mt-2 capitalize">{currentUser.asl_proficiency_level}</Badge>
                          ) : (
                            <p className="mt-2 text-xs text-muted-foreground">Not assessed</p>
                          )}
                        </div>
                        <div className="rounded-xl border border-border bg-muted/40 p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🇲🇾</span>
                            <span className="text-xs font-semibold">MSL</span>
                          </div>
                          {currentUser.msl_proficiency_level ? (
                            <Badge className="mt-2 capitalize">{currentUser.msl_proficiency_level}</Badge>
                          ) : (
                            <p className="mt-2 text-xs text-muted-foreground">Not assessed</p>
                          )}
                        </div>
                      </div>
                      {/* Legacy single field fallback */}
                      {!currentUser.asl_proficiency_level && !currentUser.msl_proficiency_level && currentUser.proficiency_level && (
                        <Badge className="capitalize">{currentUser.proficiency_level}</Badge>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => router.push('/proficiency-test/history')}>
                          View history
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => router.push('/proficiency-test/select')}>
                          Take new test
                        </Button>
                      </div>
                      {/* Language preference */}
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground">Sign language preference</p>
                        {currentUser.preferred_language ? (
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{currentUser.preferred_language === 'ASL' ? '🇺🇸' : '🇲🇾'}</span>
                              <span className="text-sm font-semibold">{currentUser.preferred_language === 'ASL' ? 'American Sign Language' : 'Malaysian Sign Language'}</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => router.push('/proficiency-test/select')}>
                              Change
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Not yet selected</span>
                            <Button size="sm" onClick={() => router.push('/proficiency-test/select')}>
                              Select language
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : currentUser.proficiency_level ? (
                    <Badge className="mt-0.5 capitalize">{currentUser.proficiency_level}</Badge>
                  ) : (
                    <div className="mt-1 flex flex-wrap items-center gap-2.5">
                      <span className="text-sm text-muted-foreground">Not applicable</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fallback for simple proficiency display if needed */}
              {currentUser.role === 'admin' && currentUser.proficiency_level && (
                <div className="flex items-center gap-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun/10 text-sun">
                    <GraduationCap className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Proficiency</p>
                    <Badge className="mt-0.5 capitalize">{currentUser.proficiency_level}</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="h-fit gap-0">
          <CardContent className="space-y-3 p-6">
            <h3 className="font-display text-base font-bold">Account actions</h3>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditDialogOpen(true)}>
              <Edit />
              Edit profile
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsChangePasswordDialogOpen(true)}>
              <KeyRound />
              Change password
            </Button>
            <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
              Need to update your details? Account changes apply across all your SignBridge devices.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs - preserved from origin */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentUser={currentUser}
        onSave={handleSaveProfile}
      />
      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
        onSave={handleChangePassword}
      />
    </div>
  );
}
