// X2 Global Blocks — Next Block Preview Component
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BlockTile } from './BlockTile';
import { COLORS } from '../constants/colors';

interface NextBlockPreviewProps {
  currentBlock: number;
  nextBlock: number;
}

export const NextBlockPreview: React.FC<NextBlockPreviewProps> = ({
  currentBlock,
  nextBlock,
}) => {
  return (
    <View style={styles.container}>
      {/* Current block - larger */}
      <View style={styles.currentContainer}>
        <Text style={styles.label}>DROP</Text>
        <View style={styles.blockWrapper}>
          <BlockTile value={currentBlock} size={56} />
        </View>
      </View>

      {/* Arrow */}
      <Text style={styles.arrow}>→</Text>

      {/* Next block - smaller */}
      <View style={styles.nextContainer}>
        <Text style={styles.label}>NEXT</Text>
        <View style={styles.blockWrapper}>
          <BlockTile value={nextBlock} size={42} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  currentContainer: {
    alignItems: 'center',
  },
  nextContainer: {
    alignItems: 'center',
    opacity: 0.7,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  blockWrapper: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  arrow: {
    color: COLORS.textMuted,
    fontSize: 20,
    marginHorizontal: 16,
    marginTop: 14,
  },
});
