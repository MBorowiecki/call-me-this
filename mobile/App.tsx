import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/Home';
import RoomScreen from './screens/Room';

import { socket, SocketContext } from './contexts/socket';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Room" component={RoomScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}
