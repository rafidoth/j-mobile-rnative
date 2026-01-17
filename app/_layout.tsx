import "./global.css";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider, useSession } from "../context/AuthContext";

const queryClient = new QueryClient();

function AxiosAuthInterceptor() {
  const { session } = useSession();

  useEffect(() => {
    // START: Update to point to your actual backend URL and port
    axios.defaults.baseURL = "http://localhost:3000";
    // END: Update to point to your actual backend URL and port

    const id = axios.interceptors.request.use(async (config) => {
      try {
        if (session) {
          // If you need to send a token, add it here.
          // For simple auth without JWT, we might pass userId or nothing if session is just client-side state of "logged in".
          // Since the user asked for "string matching", maybe no token?
          // But usually we'd want to separate public/private data.
          // The previous code sent a Bearer token.
          // With simple string matching login, we might not have a token unless we generate one.
          // For now, I'll assume we don't send Authorization header or just send userId if needed.
          // But let's keep the interceptor structure.
          // If we want to secure backend, we need a token.
          // But the prompt said "simple email password... login credential string matching".
          // It didn't mention tokens.
          // I'll leave the interceptor but remove the token logic for now or rely on what's in session.
        }
      } catch (e) {
        // no-op
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(id);
    };
  }, [session]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AxiosAuthInterceptor />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack initialRouteName="(auth)">
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="sets/[setId]"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="sets/new-question"
              options={{ headerShown: false }}
            />
          </Stack>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </AuthProvider>
  );
}
