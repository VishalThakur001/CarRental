import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'
import ProfilePhotoManager from '../components/ProfilePhotoManager'

const Profile = () => {
  const { user, logout, axios } = useAppContext()
  const [showPhotoManager, setShowPhotoManager] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newForgotPassword, setNewForgotPassword] = useState('')
  const [confirmForgotPassword, setConfirmForgotPassword] = useState('')
  const [forgotStep, setForgotStep] = useState(1)
  const [forgotVerificationToken, setForgotVerificationToken] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long')
      return
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error('New password must be different from current password')
      return
    }

    setIsChangingPassword(true)
    try {
      const { data } = await axios.post('/api/user/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })

      if (data.success) {
        toast.success(data.message)
        setShowChangePassword(false)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to change password. Please try again.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Forgot Password Handlers
  const handleForgotPasswordEmail = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email');
      return;
    }

    setForgotLoading(true);
    try {
      const { data } = await axios.post('/api/otp/send-otp', { email: forgotEmail });

      if (data.success) {
        toast.success('Reset code sent to your email');
        setForgotStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to send reset code. Please try again.');
    }
    setForgotLoading(false);
  };

  const handleForgotPasswordOTP = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setForgotLoading(true);
    try {
      const { data } = await axios.post('/api/otp/verify-otp', { email: forgotEmail, otp: forgotOtp });

      if (data.success) {
        toast.success('Code verified successfully');
        setForgotVerificationToken(data.verificationToken);
        setForgotStep(3);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Code verification failed. Please try again.');
    }
    setForgotLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newForgotPassword || newForgotPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (newForgotPassword !== confirmForgotPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setForgotLoading(true);
    try {
      const { data } = await axios.post('/api/user/reset-password', {
        email: forgotEmail,
        newPassword: newForgotPassword,
        verificationToken: forgotVerificationToken
      });

      if (data.success) {
        toast.success('Password reset successfully');
        setShowForgotPassword(false);
        setForgotStep(1);
        setForgotEmail('');
        setForgotOtp('');
        setNewForgotPassword('');
        setConfirmForgotPassword('');
        setForgotVerificationToken('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    }
    setForgotLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error('Please enter your password to confirm deletion')
      return
    }

    setIsDeleting(true)
    try {
      const { data } = await axios.delete('/api/user/delete-account', {
        data: { password: deletePassword }
      })

      if (data.success) {
        toast.success(data.message)
        logout() // Log out user after successful deletion
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setDeletePassword('')
    }
  }

  const getCurrentImageDisplay = () => {
    if (user?.image) {
      return user.image
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3b82f6&color=fff&size=200&rounded=true&bold=true`
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-purple-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={getCurrentImageDisplay()}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <button
                  onClick={() => setShowPhotoManager(true)}
                  className="absolute -bottom-2 -right-2 bg-white text-primary p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-blue-100 text-lg">{user.email}</p>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'owner' 
                      ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30' 
                      : 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
                  }`}>
                    {user.role === 'owner' ? '🏆 Car Owner' : '👤 User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="mr-3">👤</span>
                  Account Information
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="text-sm font-medium text-gray-500">Account Type</label>
                    <p className="text-lg font-semibold text-gray-800 capitalize">{user.role}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="mr-3">⚙️</span>
                  Account Settings
                </h2>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setShowPhotoManager(true)}
                    className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">Profile Photo</h3>
                        <p className="text-sm text-gray-600">Update your profile picture</p>
                      </div>
                      <span className="text-2xl">📸</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">Change Password</h3>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <span className="text-2xl">🔒</span>
                    </div>
                  </button>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">ℹ️</span>
                      <div>
                        <h3 className="font-semibold text-blue-800">Account Information</h3>
                        <p className="text-sm text-blue-600 mt-1">
                          To update your name or email address, please contact our support team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-red-600 flex items-center mb-4">
                    <span className="mr-3">⚠️</span>
                    Danger Zone
                  </h3>
                  
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-600 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Photo Manager Modal */}
        {showPhotoManager && (
          <ProfilePhotoManager
            isOpen={showPhotoManager}
            onClose={() => setShowPhotoManager(false)}
            currentImage={user.image}
            onImageUpdate={() => {}} // The component handles the update internally
          />
        )}

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Change Password</h3>
                <p className="text-gray-600">
                  Enter your current password and choose a new secure password.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <img
                        src={showCurrentPassword ? assets.eye_close_icon : assets.eye_icon}
                        alt="toggle password visibility"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter new password (min 8 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <img
                        src={showNewPassword ? assets.eye_close_icon : assets.eye_icon}
                        alt="toggle password visibility"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <img
                        src={showConfirmPassword ? assets.eye_close_icon : assets.eye_icon}
                        alt="toggle password visibility"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>

                {passwordForm.newPassword && passwordForm.newPassword.length < 8 && (
                  <p className="text-sm text-red-600">Password must be at least 8 characters long</p>
                )}

                {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              <div className="text-center mb-4">
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setShowForgotPassword(true);
                    setForgotEmail(user?.email || '');
                  }}
                  className="text-primary hover:underline text-sm"
                >
                  Forgot your current password?
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowChangePassword(false)
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || passwordForm.newPassword !== passwordForm.confirmPassword || passwordForm.newPassword.length < 8}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
                <p className="text-gray-600">
                  This will permanently delete your account and all associated data including:
                </p>
                <ul className="text-left text-sm text-gray-600 mt-3 space-y-1">
                  <li>• Your profile and personal information</li>
                  <li>• All your car listings (if you're an owner)</li>
                  <li>• Booking history and reviews</li>
                  <li>• All notifications and messages</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm:
                </label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <img
                      src={showDeletePassword ? assets.eye_close_icon : assets.eye_icon}
                      alt="toggle password visibility"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletePassword('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotStep(1);
                    setForgotEmail('');
                    setForgotOtp('');
                    setNewForgotPassword('');
                    setConfirmForgotPassword('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Step 1: Enter Email */}
              {forgotStep === 1 && (
                <form onSubmit={handleForgotPasswordEmail} className="space-y-4">
                  <p className="text-gray-600 text-sm">Enter your email address to receive a password reset code.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      onChange={(e) => setForgotEmail(e.target.value)}
                      value={forgotEmail}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      type="email"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Code"}
                  </button>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {forgotStep === 2 && (
                <form onSubmit={handleForgotPasswordOTP} className="space-y-4">
                  <p className="text-gray-600 text-sm">Enter the 6-digit code sent to {forgotEmail}</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                    <input
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      value={forgotOtp}
                      placeholder="000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-center text-lg tracking-widest"
                      type="text"
                      maxLength="6"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading || forgotOtp.length !== 6}
                    className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {forgotLoading ? "Verifying..." : "Verify Code"}
                  </button>
                </form>
              )}

              {/* Step 3: Set New Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-gray-600 text-sm">Choose a new secure password for your account.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        onChange={(e) => setNewForgotPassword(e.target.value)}
                        value={newForgotPassword}
                        placeholder="Enter new password (min 8 chars)"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        type={showNewPassword ? "text" : "password"}
                        minLength="8"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <img
                          src={showNewPassword ? assets.eye_close_icon : assets.eye_icon}
                          alt="toggle password visibility"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      onChange={(e) => setConfirmForgotPassword(e.target.value)}
                      value={confirmForgotPassword}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      type={showNewPassword ? "text" : "password"}
                      minLength="8"
                      required
                    />
                  </div>
                  {newForgotPassword && confirmForgotPassword && newForgotPassword !== confirmForgotPassword && (
                    <p className="text-sm text-red-600">Passwords do not match</p>
                  )}
                  <button
                    type="submit"
                    disabled={forgotLoading || newForgotPassword !== confirmForgotPassword || newForgotPassword.length < 8}
                    className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
