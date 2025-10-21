export interface User {
  id: string
  email: string
  name: string
  businessName?: string
  industry?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Save user to localStorage
export function saveUser(user: User): void {
  localStorage.setItem("currentUser", JSON.stringify(user))
}

// Remove user from localStorage
export function removeUser(): void {
  localStorage.removeItem("currentUser")
}

// Sign up new user
export function signUp(
  email: string,
  password: string,
  name: string,
  businessName?: string,
  industry?: string,
): { success: boolean; error?: string; user?: User } {
  // Check if user already exists
  const users = getAllUsers()
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "이미 등록된 이메일입니다." }
  }

  // Create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    name,
    businessName,
    industry,
    createdAt: new Date().toISOString(),
  }

  // Save to users list
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  // Save password (in real app, this would be hashed on backend)
  const passwords = getPasswords()
  passwords[email] = password
  localStorage.setItem("passwords", JSON.stringify(passwords))

  // Set as current user
  saveUser(newUser)

  return { success: true, user: newUser }
}

// Sign in user
export function signIn(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getAllUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "등록되지 않은 이메일입니다." }
  }

  // Check password
  const passwords = getPasswords()
  if (passwords[email] !== password) {
    return { success: false, error: "비밀번호가 일치하지 않습니다." }
  }

  // Set as current user
  saveUser(user)

  return { success: true, user }
}

// Sign out user
export function signOut(): void {
  removeUser()
}

// Helper functions
function getAllUsers(): User[] {
  const usersStr = localStorage.getItem("users")
  if (!usersStr) return []

  try {
    return JSON.parse(usersStr)
  } catch {
    return []
  }
}

function getPasswords(): Record<string, string> {
  const passwordsStr = localStorage.getItem("passwords")
  if (!passwordsStr) return {}

  try {
    return JSON.parse(passwordsStr)
  } catch {
    return {}
  }
}

// Update user profile
export function updateUser(updates: Partial<User>): { success: boolean; error?: string; user?: User } {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    return { success: false, error: "로그인이 필요합니다." }
  }

  const users = getAllUsers()
  const userIndex = users.findIndex((u) => u.id === currentUser.id)

  if (userIndex === -1) {
    return { success: false, error: "사용자를 찾을 수 없습니다." }
  }

  // Update user
  const updatedUser = { ...users[userIndex], ...updates }
  users[userIndex] = updatedUser
  localStorage.setItem("users", JSON.stringify(users))

  // Update current user
  saveUser(updatedUser)

  return { success: true, user: updatedUser }
}
