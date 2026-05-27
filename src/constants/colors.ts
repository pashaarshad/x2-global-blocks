// X2 Global Blocks — Color Palette
// Neon arcade theme inspired by reference designs

export const COLORS = {
  // Background gradients
  bgPrimary: '#0a0e27',
  bgSecondary: '#1a1a4e',
  bgTertiary: '#0d1137',
  bgCard: '#1e2255',
  bgOverlay: 'rgba(10, 14, 39, 0.85)',

  // Accent colors
  neonBlue: '#4dc9f6',
  neonPurple: '#9b59f5',
  neonPink: '#f56baf',
  neonGreen: '#2ecc71',
  neonOrange: '#ff9f43',
  gold: '#ffd700',
  goldDark: '#b8860b',

  // UI
  textPrimary: '#ffffff',
  textSecondary: '#a8b2d1',
  textMuted: '#6c7293',
  buttonPrimary: '#4dc9f6',
  buttonSecondary: '#9b59f5',
  danger: '#e74c3c',
  success: '#2ecc71',

  // Grid
  gridBg: '#141833',
  gridCell: '#1c2040',
  gridBorder: '#2a2f5a',

  // Shadows
  shadowColor: '#000000',
};

// Block colors — vibrant, high contrast, matching reference images
export const BLOCK_COLORS: Record<number, { bg: string; text: string; glow: string }> = {
  2:    { bg: '#e74c3c', text: '#ffffff', glow: '#ff6b6b' },     // Red
  4:    { bg: '#2ecc71', text: '#ffffff', glow: '#55efc4' },     // Green
  8:    { bg: '#f39c12', text: '#ffffff', glow: '#fdcb6e' },     // Orange/Yellow
  16:   { bg: '#3498db', text: '#ffffff', glow: '#74b9ff' },     // Blue
  32:   { bg: '#9b59b6', text: '#ffffff', glow: '#a29bfe' },     // Purple
  64:   { bg: '#e84393', text: '#ffffff', glow: '#fd79a8' },     // Pink
  128:  { bg: '#e67e22', text: '#ffffff', glow: '#ffa502' },     // Deep Orange
  256:  { bg: '#00cec9', text: '#ffffff', glow: '#81ecec' },     // Cyan/Teal
  512:  { bg: '#ffd700', text: '#1a1a2e', glow: '#ffeaa7' },    // Gold
  1024: { bg: '#00b894', text: '#ffffff', glow: '#55efc4' },     // Emerald
  2048: { bg: '#6c5ce7', text: '#ffffff', glow: '#a29bfe' },     // Indigo
  4096: { bg: '#fd79a8', text: '#ffffff', glow: '#fab1a0' },     // Rose
  8192: { bg: '#00cec9', text: '#ffffff', glow: '#81ecec' },     // Aqua
};

// Gradient pairs for backgrounds
export const GRADIENTS = {
  splash: ['#0a0e27', '#1a1a4e'],
  home: ['#0d1137', '#1a1a4e', '#0a0e27'],
  game: ['#0a0e27', '#141833'],
  victory: ['#1a1a4e', '#2d1b69', '#0a0e27'],
  gameOver: ['#1a0a0a', '#2d1111', '#0a0e27'],
  button: ['#4dc9f6', '#9b59f5'],
  buttonGold: ['#ffd700', '#ff9f43'],
  levelLocked: ['#2a2f5a', '#1c2040'],
  levelComplete: ['#2ecc71', '#27ae60'],
};

export const getBlockColor = (value: number) => {
  return BLOCK_COLORS[value] || { bg: '#555', text: '#fff', glow: '#777' };
};
