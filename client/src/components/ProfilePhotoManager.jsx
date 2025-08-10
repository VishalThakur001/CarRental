import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { defaultAvatars, getDefaultAvatar } from '../assets/avatars';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProfilePhotoManager = ({ isOpen, onClose, currentImage, onImageUpdate }) => {
  const { axios, fetchUser } = useAppContext();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customImage, setCustomImage] = useState(null);
  const [activeTab, setActiveTab] = useState('avatars'); // 'avatars' or 'upload'

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setCustomImage(null);
  };

  const handleCustomImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCustomImage(file);
      setSelectedAvatar(null);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setIsUploading(true);
      const { data } = await axios.post('/api/user/update-profile-image', {
        imageType: 'default',
        imageUrl: ''
      });

      if (data.success) {
        await fetchUser();
        toast.success('Profile photo removed successfully');
        onImageUpdate('');
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to remove profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedAvatar && !customImage) {
      toast.error('Please select an avatar or upload a custom image');
      return;
    }

    try {
      setIsUploading(true);

      if (selectedAvatar) {
        // Save selected avatar
        const { data } = await axios.post('/api/user/update-profile-image', {
          imageType: 'avatar',
          imageUrl: selectedAvatar.url
        });

        if (data.success) {
          await fetchUser();
          toast.success('Profile photo updated successfully');
          onImageUpdate(selectedAvatar.url);
          onClose();
        } else {
          toast.error(data.message);
        }
      } else if (customImage) {
        // Upload custom image
        const formData = new FormData();
        formData.append('image', customImage);

        const { data } = await axios.post('/api/user/upload-profile-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (data.success) {
          await fetchUser();
          toast.success('Profile photo uploaded successfully');
          onImageUpdate(data.imageUrl);
          onClose();
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error('Failed to update profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const getCurrentImageDisplay = () => {
    if (customImage) return URL.createObjectURL(customImage);
    if (selectedAvatar) return selectedAvatar.url;
    return currentImage || getDefaultAvatar();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Manage Profile Photo</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img src={assets.close_icon} alt="Close" className="w-6 h-6" />
              </button>
            </div>

            {/* Current Photo Preview */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={getCurrentImageDisplay()}
                    alt="Current profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {(selectedAvatar || customImage) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <img src={assets.check_icon} alt="Selected" className="w-3 h-3 brightness-0 invert" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Current Profile Photo</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAvatar ? `Selected: ${selectedAvatar.name}` :
                     customImage ? 'Custom image selected' :
                     'Current photo'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('avatars')}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'avatars'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Choose Avatar
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Upload Custom
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'avatars' && (
                <div className="grid grid-cols-4 gap-4">
                  {defaultAvatars.map((avatar) => (
                    <motion.button
                      key={avatar.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`relative group ${
                        selectedAvatar?.id === avatar.id
                          ? 'ring-4 ring-primary ring-offset-2'
                          : 'hover:ring-2 hover:ring-gray-300'
                      } rounded-full transition-all`}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {selectedAvatar?.id === avatar.id && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <img src={assets.check_icon} alt="Selected" className="w-3 h-3 brightness-0 invert" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-colors"></div>
                    </motion.button>
                  ))}
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <img src={assets.upload_icon} alt="Upload" className="w-12 h-12 mx-auto mb-4 opacity-60" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Your Photo</h3>
                    <p className="text-sm text-gray-600 mb-4">Choose a photo from your device</p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomImageSelect}
                        className="hidden"
                      />
                      <span className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull transition-colors">
                        Choose File
                      </span>
                    </label>
                  </div>

                  {customImage && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={URL.createObjectURL(customImage)}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{customImage.name}</p>
                          <p className="text-sm text-gray-600">
                            {(customImage.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Remove Photo
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isUploading}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isUploading || (!selectedAvatar && !customImage)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {isUploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePhotoManager;
