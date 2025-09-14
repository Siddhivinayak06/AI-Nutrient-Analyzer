// components/ProfileContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  location: string;
  activityLevel: string;
  healthConcerns: string[];
  primaryGoals: string[];
  dietaryRestrictions: string[];
  allergies: string;
  sleepHours: string;
  stressLevel: string;
  digestiveIssues: string[];
  currentDiet: string;
  dosha: string;
}

// default empty profile
export const defaultProfile: UserProfile = {
  name: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  location: "",
  activityLevel: "",
  healthConcerns: [],
  primaryGoals: [],
  dietaryRestrictions: [],
  allergies: "",
  sleepHours: "",
  stressLevel: "",
  digestiveIssues: [],
  currentDiet: "",
  dosha: "",
};

interface ProfileContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
