import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from './ScreenHeader';
import Stepper from './Stepper';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme/theme';

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
      <ScreenHeader title={title} onBack={onBack} />
      <View style={styles.stepperWrap}>
        <Stepper total={totalSteps} current={step} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          onPress={onButtonPress}
          disabled={buttonDisabled}
          loading={buttonLoading}
        >
          {buttonLabel}
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  stepperWrap: {
    paddingHorizontal: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
