// X2 Global Blocks — Main App Entry
// Navigation setup with all screens
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LevelSelectScreen } from './src/screens/LevelSelectScreen';
import { GameScreen } from './src/screens/GameScreen';
import { VictoryScreen } from './src/screens/VictoryScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  LevelSelect: undefined;
  Game: { levelId: number };
  Victory: { levelId: number; score: number; stars: number; highestTile: number; winBonus?: number };
  GameOver: { levelId: number; score: number; highestTile: number; goalTile: number };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#0a0e27' },
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ animation: 'none' }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="LevelSelect"
            component={LevelSelectScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="Victory"
            component={VictoryScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="GameOver"
            component={GameOverScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
