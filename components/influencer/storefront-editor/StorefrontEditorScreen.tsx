/**
 * StorefrontEditorScreen Component
 * Full editor screen for influencer storefront.
 */

import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, recipes } from '@/constants/theme';
import { MAYA_COHEN } from '@/constants/mockInfluencerStorefront';

import { EditorTopBar } from './EditorTopBar';
import { EditorSection } from './EditorSection';
import { IdentityPhotoCard } from './IdentityPhotoCard';
import { FieldRow } from './FieldRow';
import { FieldDisplayRow } from './FieldDisplayRow';
import { AddRow } from './AddRow';
import { CategoryChipsEditor } from './CategoryChipsEditor';
import { PlatformRow } from './PlatformRow';
import { ServiceRow } from './ServiceRow';
import { PortfolioGrid } from './PortfolioGrid';

// Mock content metadata for "About your content" section
const CONTENT_METADATA = {
  contentTypes: ['UGC', 'Short-Form Video', 'Lifestyle'],
  languages: ['Hebrew', 'English'],
  ageBracket: ['25–34'],
  gender: ['Women'],
};

export function StorefrontEditorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Load initial data from mock
  const profile = MAYA_COHEN;

  // Editor state
  const [displayName, setDisplayName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || '');
  const [categories, setCategories] = useState(profile.categories);
  const [portfolio, setPortfolio] = useState(profile.portfolio);

  // Compute hasChanges
  const hasChanges = useMemo(() => {
    return (
      displayName !== profile.name ||
      bio !== (profile.bio || '') ||
      JSON.stringify(categories) !== JSON.stringify(profile.categories) ||
      JSON.stringify(portfolio) !== JSON.stringify(profile.portfolio)
    );
  }, [displayName, bio, categories, portfolio, profile]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    console.log('TODO: Save storefront changes');
    // Reset state to simulate save
    setDisplayName(profile.name);
    setBio(profile.bio || '');
    setCategories(profile.categories);
    setPortfolio(profile.portfolio);
  };

  const handleChangePhoto = () => {
    console.log('TODO: Upload photo');
  };

  const handleRemoveCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCategory = () => {
    console.log('TODO: Add category');
  };

  const handleEditPlatform = (name: string) => {
    console.log(`TODO: Edit platform ${name}`);
  };

  const handleAddPlatform = () => {
    console.log('TODO: Add platform');
  };

  const handleEditService = (name: string) => {
    console.log(`TODO: Edit service ${name}`);
  };

  const handleAddService = () => {
    console.log('TODO: Add service');
  };

  const handleRemovePortfolioImage = (index: number) => {
    setPortfolio((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPortfolioImage = () => {
    console.log('TODO: Add portfolio image');
  };

  const handleEditContentTypes = () => {
    console.log('TODO: Open content types editor');
  };

  const handleEditLanguages = () => {
    console.log('TODO: Open languages editor');
  };

  const handleEditAgeBracket = () => {
    console.log('TODO: Open age bracket editor');
  };

  const handleEditGender = () => {
    console.log('TODO: Open gender editor');
  };

  const handleUnpublish = () => {
    console.log('TODO: Unpublish storefront');
  };

  return (
    <View style={styles.container}>
      <EditorTopBar
        onBack={handleBack}
        onSave={handleSave}
        hasChanges={hasChanges}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity Section */}
        <EditorSection
          title="Identity"
          description="How you appear to businesses"
        >
          <IdentityPhotoCard
            imageUri={profile.portfolio[0] || null}
            onChangePress={handleChangePhoto}
          />
          <FieldRow label="Display name" value={displayName} />
          <FieldRow
            label="Bio"
            value={bio}
            charCount={{ current: bio.length, max: 150 }}
            multiline
          />
        </EditorSection>

        {/* Categories Section */}
        <EditorSection
          title="Categories"
          description="Up to 3 categories. First is primary."
        >
          <CategoryChipsEditor
            categories={categories}
            onRemove={handleRemoveCategory}
            onAdd={handleAddCategory}
          />
        </EditorSection>

        {/* Platforms Section */}
        <EditorSection
          title="Platforms"
          description="Where businesses can reach your audience"
        >
          {profile.platforms.map((platform) => (
            <PlatformRow
              key={platform.name}
              name={platform.name}
              icon={platform.icon}
              followers={platform.followers}
              onEdit={() => handleEditPlatform(platform.name)}
            />
          ))}
          <AddRow label="Add platform" onPress={handleAddPlatform} />
        </EditorSection>

        {/* Services Section */}
        <EditorSection
          title="Services"
          description="What you offer and pricing"
        >
          {profile.services.map((service) => (
            <ServiceRow
              key={service.id}
              name={service.name}
              platform={service.platform}
              delivery={service.delivery}
              price={service.price}
              onEdit={() => handleEditService(service.name)}
            />
          ))}
          <AddRow label="Add service" onPress={handleAddService} />
        </EditorSection>

        {/* Portfolio Section */}
        <EditorSection
          title="Portfolio"
          description="Your best work. First image is your cover."
        >
          <PortfolioGrid
            images={portfolio}
            onRemove={handleRemovePortfolioImage}
            onAdd={handleAddPortfolioImage}
          />
        </EditorSection>

        {/* About Your Content Section */}
        <EditorSection
          title="About your content"
          description="Helps Businesses find the right match"
        >
          <FieldDisplayRow
            label="CONTENT TYPES"
            values={CONTENT_METADATA.contentTypes}
            onPress={handleEditContentTypes}
          />
          <FieldDisplayRow
            label="CONTENT LANGUAGES"
            values={CONTENT_METADATA.languages}
            onPress={handleEditLanguages}
          />
          <FieldDisplayRow
            label="AGE BRACKET"
            values={CONTENT_METADATA.ageBracket}
            onPress={handleEditAgeBracket}
          />
          <FieldDisplayRow
            label="GENDER"
            values={CONTENT_METADATA.gender}
            onPress={handleEditGender}
          />
        </EditorSection>

        {/* Unpublish Button */}
        <Pressable
          style={styles.unpublishButton}
          onPress={handleUnpublish}
          accessibilityRole="button"
          accessibilityLabel="Unpublish storefront"
        >
          <EyeOff size={18} color={colors.decline} />
          <Text style={styles.unpublishText}>Unpublish storefront</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  unpublishButton: {
    ...recipes.declineButton,
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  unpublishText: {
    ...typography.rowSecondary,
    color: colors.decline,
  },
});
