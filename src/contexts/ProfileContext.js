import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    fullName: 'Anubhav Kumar',
    email: 'anubhavkumar@gmail.com',
    username: 'anubhav01',
    phone: '+91 9876543210',
    upiId: 'anubhav01@paytm'
  });

  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    pushNotifications: true,
    language: 'English'
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const savedSettings = localStorage.getItem('userSettings');
      
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        console.log('✅ Profile loaded from localStorage:', parsedProfile);
      }
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        console.log('✅ Settings loaded from localStorage:', parsedSettings);
      }
    } catch (error) {
      console.error('❌ Error loading profile data:', error);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      console.log('💾 Profile saved to localStorage:', profile);
    } catch (error) {
      console.error('❌ Error saving profile:', error);
    }
  }, [profile]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      console.log('💾 Settings saved to localStorage:', settings);
    } catch (error) {
      console.error('❌ Error saving settings:', error);
    }
  }, [settings]);

  const updateProfile = (newProfileData) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      ...newProfileData
    }));
  };

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const resetProfile = () => {
    const defaultProfile = {
      fullName: 'Anubhav Kumar',
      email: 'anubhavkumar@gmail.com',
      username: 'anubhav01',
      phone: '+91 9876543210',
      upiId: 'anubhav01@upi'
    };
    setProfile(defaultProfile);
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      settings,
      updateProfile,
      updateSettings,
      resetProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
