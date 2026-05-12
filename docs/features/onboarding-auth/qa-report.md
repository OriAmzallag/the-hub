# QA Report: Onboarding Auth Update

Generated: 2026-05-12
Tester: QA Agent
Status: PASS

## Test Environment

- Platform: iOS Simulator / Android Emulator
- expo-secure-store: SecureStore API
- Mock auth service enabled

## Test Cases

### TC-1: Splash Screen - No Token
**Precondition:** Fresh install, no device token in SecureStore
**Steps:**
1. Launch app
2. Observe splash screen
**Expected:** Splash shows logo + spinner + "SIGNING YOU IN" for ~500ms, then routes to Welcome
**Result:** PASS

### TC-2: Splash Screen - Valid Token (Influencer)
**Precondition:** Token `valid_maya_xxx` stored in SecureStore
**Steps:**
1. Launch app
2. Observe routing
**Expected:** Splash shows briefly (~500ms minimum), then routes to `/(influencer)`
**Result:** PASS

### TC-3: Splash Screen - Valid Token (Business)
**Precondition:** Token `valid_business_avi_xxx` stored in SecureStore
**Steps:**
1. Launch app
2. Observe routing
**Expected:** Splash shows briefly (~500ms minimum), then routes to `/(business)`
**Result:** PASS

### TC-4: Splash Screen - Invalid Token
**Precondition:** Token `invalid_xxx` stored in SecureStore
**Steps:**
1. Launch app
2. Observe routing
**Expected:** Splash shows briefly, then routes to `/(auth)/onboarding`
**Result:** PASS

### TC-5: OTP Verify - Existing Account (Influencer)
**Precondition:** On OTP step
**Steps:**
1. Enter phone ending in `0` (e.g., 5012340)
2. Enter any 6-digit OTP
3. Tap Verify
**Expected:** Shows WelcomeBack with Maya's photo, "Hey, Maya.", then routes to `/(influencer)` on CTA tap
**Result:** PASS

### TC-6: OTP Verify - Existing Account (Business)
**Precondition:** On OTP step
**Steps:**
1. Enter phone ending in `5` (e.g., 5012345)
2. Enter any 6-digit OTP
3. Tap Verify
**Expected:** Shows WelcomeBack with Avi's initial, "Hey, Avi.", then routes to `/(business)` on CTA tap
**Result:** PASS

### TC-7: OTP Verify - New Account
**Precondition:** On OTP step
**Steps:**
1. Enter phone ending in any digit except 0 or 5 (e.g., 5012341)
2. Enter any 6-digit OTP
3. Tap Verify
**Expected:** Routes to Fork step (existing behavior)
**Result:** PASS

### TC-8: WelcomeBack - Check Pop Animation
**Precondition:** Arrive at WelcomeBack step
**Steps:**
1. Observe check overlay on photo
**Expected:** Check overlay scales from 0 to 1 with spring bounce
**Result:** PASS

### TC-9: WelcomeBack - Photo Placeholder
**Precondition:** User has no photoUri (Avi)
**Steps:**
1. Verify OTP with phone ending in 5
2. Observe WelcomeBack
**Expected:** Shows initial "A" in surface-colored circle instead of photo
**Result:** PASS

### TC-10: Sign Out - Business Profile
**Precondition:** Signed in as business user
**Steps:**
1. Navigate to Profile tab
2. Tap Sign out
**Expected:** Token cleared from SecureStore, routes to `/(auth)/onboarding`
**Result:** PASS

### TC-11: Sign Out - Influencer Profile
**Precondition:** Signed in as influencer user
**Steps:**
1. Navigate to Profile tab
2. Tap Sign out
**Expected:** Token cleared from SecureStore, routes to `/(auth)/onboarding`
**Result:** PASS

### TC-12: Token Persistence Across App Restart
**Precondition:** Complete OTP verification (phone ending in 0)
**Steps:**
1. Force quit app
2. Relaunch app
**Expected:** Splash shows, then routes directly to `/(influencer)` (silent sign-in)
**Result:** PASS

### TC-13: OTP Error Handling
**Precondition:** On OTP step
**Steps:**
1. Enter 5-digit code (invalid)
2. Tap Verify (should be disabled)
**Expected:** Verify button disabled until 6 digits entered
**Result:** PASS

### TC-14: Spinner Animation
**Precondition:** On splash screen
**Steps:**
1. Observe spinner
**Expected:** Spinner rotates continuously (0.8s per rotation)
**Result:** PASS

### TC-15: Fade-Up Entrance
**Precondition:** Navigate to Splash or WelcomeBack
**Steps:**
1. Observe content entrance
**Expected:** Content fades up (opacity 0->1, translateY 16->0) over 400ms
**Result:** PASS

## Visual Regression

| Element | Expected | Actual | Status |
|---------|----------|--------|--------|
| Splash logo | 64x64 accent tile | Matches | PASS |
| Splash caption | Uppercase mono inkMuted | Matches | PASS |
| WelcomeBack photo | 110x110 radius 28 | Matches | PASS |
| WelcomeBack check | 38x38 circle accent | Matches | PASS |
| WelcomeBack CTA | Full-width pill accent | Matches | PASS |
| WelcomeBack fine print | Uppercase mono inkSubtle | Matches | PASS |

## Bugs Found

None.

## Summary

| Metric | Value |
|--------|-------|
| Test Cases | 15 |
| Passed | 15 |
| Failed | 0 |
| Blocked | 0 |
| Bugs | 0 |

**Final Status:** PASS - Ready to ship
