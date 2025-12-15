'use client'

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Edit, Award, KeyRound } from "lucide-react";
import { EditProfileDialog } from '@/components/user/EditProfileDialog';
import { ChangePasswordDialog } from '@/components/user/ChangePasswordDialog';

export default function ProfilePage() {
  const { currentUser, updateUser, changePassword } = useAuth();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" /> User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
             <div className="flex items-start">
               <Award className="h-5 w-5 mr-3 text-gray-500 mt-1" />
               <div className="flex-1">
                 <p className="text-sm font-medium text-gray-500 mb-2">Proficiency Level</p>
                 {currentUser.proficiency_level ? (
                   <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <p className="text-lg font-semibold capitalize">{currentUser.proficiency_level}</p>
                       <div className="flex gap-2">
                         <Button 
                           size="sm" 
                           variant="outline"
                           onClick={() => router.push('/proficiency-test/history')}
                         >
                           View History
                         </Button>
                         <Button 
                           size="sm" 
                           variant="outline"
                           onClick={() => router.push('/proficiency-test/select')}
                         >
                           Retake Test
                         </Button>
                       </div>
                     </div>
                     {currentUser.proficiency_level !== 'Advanced' && (
                       <div className="space-y-1">
                         <div className="flex justify-between text-xs text-gray-600">
                           <span>Progress to {currentUser.proficiency_level === 'Beginner' ? 'Intermediate' : 'Advanced'}</span>
                           <span>
                             {currentUser.proficiency_level === 'Beginner' ? '50%' : '80%'} needed
                           </span>
                         </div>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                           <div 
                             className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                             style={{ 
                               width: currentUser.proficiency_level === 'Beginner' ? '33%' : '66%' 
                             }}
                           />
                         </div>
                         <p className="text-xs text-gray-500 mt-1">
                           Retake the test to advance to the next level
                         </p>
                       </div>
                     )}
                     {currentUser.proficiency_level === 'Advanced' && (
                       <p className="text-sm text-green-600">
                         🎉 You've reached the highest level!
                       </p>
                     )}
                   </div>
                 ) : (
                   <div className="flex items-center gap-2">
                     <p className="text-lg text-gray-600">Not yet assessed</p>
                     <Button size="sm" onClick={() => router.push('/proficiency-test/select')}>
                       Take Test
                     </Button>
                   </div>
                 )}
               </div>
             </div>
           </div>
           
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center"
                  onClick={() => setIsChangePasswordDialogOpen(true)}
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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