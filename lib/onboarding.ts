const ONBOARDING_KEY = "onboarding_completed"

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return true
  return localStorage.getItem(ONBOARDING_KEY) === "true"
}

export function markOnboardingComplete(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ONBOARDING_KEY, "true")
}

export function resetOnboarding(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ONBOARDING_KEY)
}
