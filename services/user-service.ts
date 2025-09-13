// Mock user service - in production, this would connect to your database
interface UserProfile {
  id: string
  name: string
  age: number
  gender: string
  height: number
  weight: number
  activityLevel: string
  dosha: string
  healthConcerns: string[]
  dietaryRestrictions: string[]
}

const mockUsers: Record<string, UserProfile> = {
  "user-1": {
    id: "user-1",
    name: "John Doe",
    age: 30,
    gender: "male",
    height: 175,
    weight: 70,
    activityLevel: "moderate",
    dosha: "VATA",
    healthConcerns: ["Low Energy", "Digestive Issues"],
    dietaryRestrictions: ["Vegetarian"],
  },
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const user = mockUsers[userId]
  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const user = mockUsers[userId]
  if (!user) {
    throw new Error("User not found")
  }

  mockUsers[userId] = { ...user, ...updates }
  return mockUsers[userId]
}

export async function createUserProfile(profile: Omit<UserProfile, "id">): Promise<UserProfile> {
  const id = `user-${Date.now()}`
  const newUser = { ...profile, id }
  mockUsers[id] = newUser
  return newUser
}
