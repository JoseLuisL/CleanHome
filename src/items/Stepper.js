import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';

/**
 * Indicador de pasos (timeline horizontal) del flujo.
 * @param {number} total - cantidad de pasos
 * @param {number} current - paso actual (1-indexed)
 */
export default function Stepper({ total = 6, current = 1 }) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const active = step <= current;
        const isLast = index === steps.length - 1;
        return (
          <React.Fragment key={step}>
            <View
              style={[
                styles.dot,
                { backgroundColor: active ? colors.primary : colors.border },
                step === current && styles.dotCurrent,
              ]}
            />
            {!isLast && (
              <View
                style={[
                  styles.line,
                  { backgroundColor: step < current ? colors.primary : colors.border },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 2,
  },
});
