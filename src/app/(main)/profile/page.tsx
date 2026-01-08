'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Edit, Award, KeyRound } from "lucide-react";
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

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* User Information Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" /> User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8 flex justify-center">
                <ProfilePictureUpload
                  userId={currentUser.id}
                  currentPictureUrl={profilePictureUrl}
                  userName={currentUser.name}
                  onUpdate={handleProfilePictureUpdate}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-lg">{currentUser.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg">{currentUser.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Type</p>
                    <p className="text-lg capitalize">{currentUser.role}</p>
                  </div>
                </div>
                
                {currentUser.role !== 'admin' && (
                <div className="flex items-start">
                  <Award className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-3">Proficiency Levels</p>
                    
                    {/* Language Proficiency Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      {/* ASL Proficiency */}
                      <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🇺🇸</span>
                          <span className="font-medium">ASL</span>
                        </div>
                        {currentUser.asl_proficiency_level ? (
                          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 capitalize">
                            {currentUser.asl_proficiency_level}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Not assessed</p>
                        )}
                      </div>
                      
                      {/* MSL Proficiency */}
                      <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🇲🇾</span>
                          <span className="font-medium">MSL</span>
                        </div>
                        {currentUser.msl_proficiency_level ? (
                          <p className="text-lg font-semibold text-green-600 dark:text-green-400 capitalize">
                            {currentUser.msl_proficiency_level}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Not assessed</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => router.push('/proficiency-test/history')}
                      >
                        View History
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => router.push('/proficiency-test/select')}
                      >
                        Take New Test
                      </Button>
                    </div>
                  </div>
                </div>
                )}
                
                {/* Language Preference Section */}
                {currentUser.role !== 'admin' && (
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 mt-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-2">Sign Language Preference</p>
                    {currentUser.preferred_language ? (
                      <div className="space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{currentUser.preferred_language === 'ASL' ? '🇺🇸' : '🇲🇾'}</span>
                            <p className="text-lg font-semibold">
                              {currentUser.preferred_language === 'ASL' ? 'American Sign Language' : 'Malaysian Sign Language'}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => router.push('/proficiency-test/select')}
                          >
                            Change Language
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          All learning content will be filtered to show {currentUser.preferred_language} content
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-lg text-gray-600">Not yet selected</p>
                        <Button size="sm" onClick={() => router.push('/proficiency-test/select')}>
                          Select Language
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-start"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-start"
                  onClick={() => setIsChangePasswordDialogOpen(true)}
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentUser={currentUser}
        onSave={handleSaveProfile}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
        onSave={handleChangePassword}
      />
    </div>
  );
} 