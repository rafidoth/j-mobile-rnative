import React from "react";
import { Tabs } from "expo-router";
import { Redirect } from "expo-router";
import { useSession } from "../../context/AuthContext";
import { Home, Archive, ClipboardList } from "lucide-react-native";
import { Image } from "react-native";

const Layout = () => {
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0A0A0A",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#7a7a7a",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sets"
        options={{
          title: "Sets",
          tabBarIcon: ({ color, size }) => (
            <Archive color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Exams",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
          tabBarIcon: ({ color, size }) => {
            return (
              <Image
                source={{ uri: "https://via.placeholder.com/150" }}
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  opacity: 0.8,
                  backgroundColor: "#333"
                }}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default Layout;
