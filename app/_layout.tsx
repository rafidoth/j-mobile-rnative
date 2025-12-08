import "./global.css";
import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const queryClient = new QueryClient();

function AxiosAuthInterceptor() {
  const { getToken } = useAuth();

  useEffect(() => {
    axios.defaults.baseURL = "http://192.168.0.194:9999";
    const id = axios.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers = {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
          } as any;
        }
      } catch (e) {
        // no-op if token fetch fails; request proceeds without auth header
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(id);
    };
  }, [getToken]);

  return null;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <QueryClientProvider client={queryClient}>
        <AxiosAuthInterceptor />
        <GestureHandlerRootView style={{ flex: 1 }}>
           <Stack initialRouteName="(tabs)">
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="sets/[setId]"
              options={{ headerShown: false }}
            />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="sets/new-question" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
