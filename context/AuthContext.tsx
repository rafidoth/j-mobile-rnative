import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  session: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  session: false,
  isLoading: false,
});

export const useSession = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const logged = await SecureStore.getItemAsync("loggedIn");
        if (logged === "true") {
          setSession(true);
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
      const { loggedIn } = response.data || {};
      if (loggedIn === true) {
        setSession(true);
        await SecureStore.setItemAsync("loggedIn", "true");
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
      if (response.status === 201) {
        // Optional: auto-login on signup success
        setSession(true);
        await SecureStore.setItemAsync("loggedIn", "true");
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
    await SecureStore.deleteItemAsync("loggedIn");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
