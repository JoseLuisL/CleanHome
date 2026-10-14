import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from './ScreenHeader';
import Stepper from './Stepper';
import PrimaryButton from './PrimaryButton';
import { colors, layout } from '../theme/theme';

/**
 * Layout comun para las pantallas del flujo:
 * header + stepper + contenido scrollable + boton fijo inferior.
 */
export default function StepLayout({
  title,
  onBack,
  step,
  totalSteps = 6,
  children,
  buttonLabel = 'Continuar',
  onButtonPress,
  buttonDisabled,
  buttonLoading,
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScreenHeader title={title} onBack={onBack} />
        <View style={styles.stepperWrap}>
          <Stepper total={totalSteps} current={step} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {children}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerInner}>
            <PrimaryButton
              onPress={onButtonPress}
              disabled={buttonDisabled}
              loading={buttonLoading}
            >
              {buttonLabel}
            </PrimaryButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  flex: {
    flex: 1,
  },
  stepperWrap: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  scroll: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 24,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  footerInner: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    padding: 20,
  },
});
