/**
 * Onboarding Components
 * Barrel export for all onboarding step components.
 */

// Shared components
export { StepShell } from './StepShell';
export { FieldCard } from './FieldCard';
export { ChipGrid } from './ChipGrid';

// Full-screen steps (no shell)
export { WelcomeStep } from './WelcomeStep';
export { DoneStep } from './DoneStep';
export { SplashScreen } from './SplashScreen';
export { WelcomeBackStep } from './WelcomeBackStep';

// Shared steps
export { PhoneStep } from './PhoneStep';
export { ForkStep } from './ForkStep';

// Business steps
export { NameStep as BusinessNameStep } from './business/NameStep';
export { LocationStep as BusinessLocationStep } from './business/LocationStep';
export { LogoStep as BusinessLogoStep } from './business/LogoStep';
export { BioStep as BusinessBioStep } from './business/BioStep';

// Influencer steps
export { NameBioStep as InfluencerNameBioStep } from './influencer/NameBioStep';
export { PhotoStep as InfluencerPhotoStep } from './influencer/PhotoStep';
export { CategoriesStep as InfluencerCategoriesStep } from './influencer/CategoriesStep';
export { ContentStep as InfluencerContentStep } from './influencer/ContentStep';
export { LanguagesStep as InfluencerLanguagesStep } from './influencer/LanguagesStep';
export { DemoStep as InfluencerDemoStep } from './influencer/DemoStep';
export { PlatformsStep as InfluencerPlatformsStep } from './influencer/PlatformsStep';
