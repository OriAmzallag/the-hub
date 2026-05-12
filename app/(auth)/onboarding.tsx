/**
 * Onboarding Screen
 * Multi-step onboarding flow with Business and Influencer paths.
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import {
  WelcomeStep,
  PhoneStep,
  ForkStep,
  DoneStep,
  BusinessNameStep,
  BusinessLocationStep,
  BusinessLogoStep,
  BusinessBioStep,
  InfluencerNameBioStep,
  InfluencerPhotoStep,
  InfluencerCategoriesStep,
  InfluencerContentStep,
  InfluencerLanguagesStep,
  InfluencerDemoStep,
  InfluencerPlatformsStep,
} from '@/components/onboarding';
import {
  type OnboardingState,
  type OnboardingStep,
  INITIAL_ONBOARDING_STATE,
  getProgressInfo,
  getPreviousStep,
  BUSINESS_STEPS,
  INFLUENCER_STEPS,
} from '@/types/onboarding';

export default function OnboardingScreen() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>(INITIAL_ONBOARDING_STATE);

  // Helper to update state
  const updateState = useCallback(
    (updates: Partial<OnboardingState>) => {
      setState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  // Navigate to step
  const goToStep = useCallback((step: OnboardingStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    const prevStep = getPreviousStep(state.step);
    if (prevStep) {
      goToStep(prevStep);
    }
  }, [state.step, goToStep]);

  // Get progress for current step
  const progress = getProgressInfo(state.step);

  // Handle completion
  const handleComplete = useCallback(() => {
    if (state.persona === 'business') {
      router.replace('/(business)');
    } else {
      router.replace('/(influencer)');
    }
  }, [router, state.persona]);

  // Render current step
  const renderStep = () => {
    switch (state.step) {
      case 'welcome':
        return <WelcomeStep onGetStarted={() => goToStep('phone')} />;

      case 'phone':
        return (
          <PhoneStep
            phone={state.phone}
            otp={state.otp}
            onPhoneChange={(phone) => updateState({ phone })}
            onOtpChange={(otp) => updateState({ otp })}
            onBack={handleBack}
            onNext={() => goToStep('otp')}
            stage="phone"
          />
        );

      case 'otp':
        return (
          <PhoneStep
            phone={state.phone}
            otp={state.otp}
            onPhoneChange={(phone) => updateState({ phone })}
            onOtpChange={(otp) => updateState({ otp })}
            onBack={handleBack}
            onNext={() => goToStep('fork')}
            stage="otp"
          />
        );

      case 'fork':
        return (
          <ForkStep
            selected={state.persona}
            onSelect={(persona) => updateState({ persona })}
            onBack={handleBack}
            onNext={() => {
              if (state.persona === 'business') {
                goToStep('b-name');
              } else {
                goToStep('i-name');
              }
            }}
          />
        );

      // Business flow
      case 'b-name':
        return (
          <BusinessNameStep
            step={progress?.current ?? 1}
            total={progress?.total ?? BUSINESS_STEPS.length}
            name={state.businessName}
            category={state.businessCategory}
            onNameChange={(businessName) => updateState({ businessName })}
            onCategoryChange={(businessCategory) =>
              updateState({ businessCategory })
            }
            onBack={handleBack}
            onNext={() => goToStep('b-location')}
          />
        );

      case 'b-location':
        return (
          <BusinessLocationStep
            step={progress?.current ?? 2}
            total={progress?.total ?? BUSINESS_STEPS.length}
            location={state.businessLocation}
            onLocationChange={(businessLocation) =>
              updateState({ businessLocation })
            }
            onBack={handleBack}
            onNext={() => goToStep('b-logo')}
          />
        );

      case 'b-logo':
        return (
          <BusinessLogoStep
            step={progress?.current ?? 3}
            total={progress?.total ?? BUSINESS_STEPS.length}
            logo={state.businessLogo}
            businessName={state.businessName}
            onLogoChange={(businessLogo) => updateState({ businessLogo })}
            onBack={handleBack}
            onNext={() => goToStep('b-bio')}
            onSkip={() => goToStep('b-bio')}
          />
        );

      case 'b-bio':
        return (
          <BusinessBioStep
            step={progress?.current ?? 4}
            total={progress?.total ?? BUSINESS_STEPS.length}
            bio={state.businessBio}
            onBioChange={(businessBio) => updateState({ businessBio })}
            onBack={handleBack}
            onNext={() => goToStep('b-done')}
            onSkip={() => goToStep('b-done')}
          />
        );

      case 'b-done':
        return (
          <DoneStep
            name={state.businessName}
            persona="business"
            onContinue={handleComplete}
          />
        );

      // Influencer flow
      case 'i-name':
        return (
          <InfluencerNameBioStep
            step={progress?.current ?? 1}
            total={progress?.total ?? INFLUENCER_STEPS.length}
            name={state.influencerName}
            bio={state.influencerBio}
            onNameChange={(influencerName) => updateState({ influencerName })}
            onBioChange={(influencerBio) => updateState({ influencerBio })}
            onBack={handleBack}
            onNext={() => goToStep('i-photo')}
          />
        );

      case 'i-photo':
        return (
          <InfluencerPhotoStep
            step={progress?.current ?? 2}
            total={progress?.total ?? INFLUENCER_STEPS.length}
            photo={state.influencerPhoto}
            onPhotoChange={(influencerPhoto) =>
              updateState({ influencerPhoto })
            }
            onBack={handleBack}
            onNext={() => goToStep('i-categories')}
          />
        );

      case 'i-categories':
        return (
          <InfluencerCategoriesStep
            step={progress?.current ?? 3}
            total={progress?.total ?? INFLUENCER_STEPS.length}
            categories={state.influencerCategories}
            onCategoriesChange={(influencerCategories) =>
              updateState({ influencerCategories })
            }
            onBack={handleBack}
            onNext={() => goToStep('i-content')}
          />
        );

      case 'i-content':
        return (
          <InfluencerContentStep
            step={progress?.current ?? 4}
            total={progress?.total ?? INFLUENCER_STEPS.length}
            contentTypes={state.influencerContentTypes}
            onContentTypesChange={(influencerContentTypes) =>
              updateState({ influencerContentTypes })
            }
            onBack={handleBack}
            onNext={() => goToStep('i-languages')}
          />
        );

      case 'i-languages':
        return (
          <InfluencerLanguagesStep
            step={progress?.current ?? 5}
            total={progress?.total ?? INFLUENCER_STEPS.length}
            languages={state.influencerLanguages}
            onLanguagesChange={(influencerLanguages) =>
              updateState({ influencerLanguages })
            }
            onBack={handleBack}
            onNext={() => goToStep('i-demo')}
          />
        );

      case 'i-demo':
        return (
          <InfluencerDemoStep
            step={progress?.current ?? 6}
            total={progress?.total ?? INFLUENCER_STEPS.length}
            age={state.influencerAge}
            gender={state.influencerGender}
            onAgeChange={(influencerAge) => updateState({ influencerAge })}
            onGenderChange={(influencerGender) =>
              updateState({ influencerGender })
            }
            onBack={handleBack}
            onNext={() => goToStep('i-platforms')}
          />
        );

      case 'i-platforms':
        return (
          <InfluencerPlatformsStep
            step={progress?.current ?? 7}
            total={progress?.total ?? INFLUENCER_STEPS.length}
            platforms={state.influencerPlatforms}
            onPlatformsChange={(influencerPlatforms) =>
              updateState({ influencerPlatforms })
            }
            onBack={handleBack}
            onNext={() => goToStep('i-done')}
          />
        );

      case 'i-done':
        return (
          <DoneStep
            name={state.influencerName}
            persona="influencer"
            onContinue={handleComplete}
          />
        );

      default:
        return null;
    }
  };

  // Key on state.step so React unmounts the previous step and mounts
  // the next one as a fresh tree on every transition — including the
  // phone → otp swap where the same `PhoneStep` component is reused.
  // Without this, useEffect-based entrance animations don't re-fire
  // for those same-component transitions.
  return (
    <View style={styles.container}>
      <View key={state.step} style={styles.stepHost}>
        {renderStep()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  stepHost: {
    flex: 1,
  },
});
