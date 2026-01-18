import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import axios from "axios";

type User = { id: string; email: string } | null;

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  session: boolean;
  isLoading: boolean;
  currentUser: User;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  session: false,
  isLoading: false,
  currentUser: null,
});

export const useSession = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        let logged: string | null = null;
        let userId: string | null = null;
        let userEmail: string | null = null;
        if (Platform.OS === "web") {
          logged = typeof localStorage !== "undefined" ? localStorage.getItem("loggedIn") : null;
          userId = typeof localStorage !== "undefined" ? localStorage.getItem("userId") : null;
          userEmail = typeof localStorage !== "undefined" ? localStorage.getItem("userEmail") : null;
        } else {
          logged = await SecureStore.getItemAsync("loggedIn");
          userId = await SecureStore.getItemAsync("userId");
          userEmail = await SecureStore.getItemAsync("userEmail");
        }
        if (logged === "true") {
          setSession(true);
        }
        if (userId) {
          setCurrentUser({ id: userId, email: String(userEmail || "") });
        }
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      const { loggedIn, user } = response.data || {};
      if (user?.id) {
        setSession(true);
        setCurrentUser({ id: String(user.id), email: String(user.email || email) });
        try {
          if (Platform.OS === "web") {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userId", String(user.id));
            localStorage.setItem("userEmail", String(user.email || email));
          } else {
            await SecureStore.setItemAsync("loggedIn", "true");
            await SecureStore.setItemAsync("userId", String(user.id));
            await SecureStore.setItemAsync("userEmail", String(user.email || email));
          }
        } catch {}
        return;
      }
      throw new Error("Invalid credentials");
    } catch (error) {
      console.error("Sign in error", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/signup", {
        email,
        password,
      });
      const { user } = response.data || {};
      if (user?.id) {
        setCurrentUser({ id: String(user.id), email: String(user.email || email) });
        setSession(true);
        try {
          if (Platform.OS === "web") {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userId", String(user.id));
            localStorage.setItem("userEmail", String(user.email || email));
          } else {
            await SecureStore.setItemAsync("loggedIn", "true");
            await SecureStore.setItemAsync("userId", String(user.id));
            await SecureStore.setItemAsync("userEmail", String(user.email || email));
          }
        } catch {}
        return;
      }
      throw new Error("Failed to sign up");
    } catch (error) {
      console.error("Sign up error", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setSession(false);
    setCurrentUser(null);
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
      } else {
        await SecureStore.deleteItemAsync("loggedIn");
        await SecureStore.deleteItemAsync("userId");
        await SecureStore.deleteItemAsync("userEmail");
      }
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        session,
        isLoading,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
