import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { UserSessionProvider } from '@/components/contexts/sessionContext'


const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1,backgroundColor:'#FFFFF'}} edges={{bottom: 'off',top:'maximum'}}>
          <BottomSheetModalProvider>
            <UserSessionProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(routes)/login/index" />
                <Stack.Screen name="(routes)/signup/index" />
                <Stack.Screen name="(routes)/verify-account/index" />
                <Stack.Screen name="(routes)/album-detail/[albumId]" />
              </Stack>
            </UserSessionProvider>
          </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
} 
export default RootLayout
