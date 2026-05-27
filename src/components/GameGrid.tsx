// X2 Global Blocks — Game Grid Component
import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Grid as GridType } from '../engine/gridEngine';
import { BlockTile } from './BlockTile';
import { COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GameGridProps {
  grid: GridType;
  onColumnPress: (col: number) => void;
  highlightCol?: number;
  cols: number;
  rows: number;
}

export const GameGrid: React.FC<GameGridProps> = ({
  grid,
  onColumnPress,
  highlightCol,
  cols,
  rows,
}) => {
  const gridPadding = 12;
  const gridWidth = SCREEN_WIDTH - 40;
  const cellSize = Math.floor((gridWidth - gridPadding * 2) / cols);
  const gridHeight = cellSize * rows + gridPadding * 2;

  // Column touch zones
  const columnZones = useMemo(() => {
    return Array.from({ length: cols }, (_, i) => i);
  }, [cols]);

  return (
    <View
      style={[
        styles.gridContainer,
        {
          width: gridWidth,
          height: gridHeight,
          borderRadius: 16,
        },
      ]}
    >
      {/* Grid background cells */}
      <View style={styles.cellsContainer}>
        {grid.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} style={styles.row}>
            {row.map((cell, colIdx) => (
              <View
                key={`cell-${rowIdx}-${colIdx}`}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor:
                      highlightCol === colIdx
                        ? 'rgba(77, 201, 246, 0.15)'
                        : COLORS.gridCell,
                    borderRadius: cellSize * 0.15,
                  },
                ]}
              >
                {cell && (
                  <BlockTile
                    value={cell.value}
                    size={cellSize}
                    isNew={cell.isNew}
                    isMerging={cell.merging}
                  />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Column touch zones (invisible overlay for tap-to-drop) */}
      <View style={[StyleSheet.absoluteFill, styles.touchOverlay]}>
        {columnZones.map((col) => (
          <TouchableOpacity
            key={`touch-${col}`}
            style={[
              styles.columnTouch,
              { width: cellSize, height: '100%' },
            ]}
            onPress={() => onColumnPress(col)}
            activeOpacity={0.7}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: COLORS.gridBg,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.gridBorder,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  cellsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  touchOverlay: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  columnTouch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
