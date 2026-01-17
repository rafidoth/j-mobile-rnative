import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, TextInput, Alert } from "react-native";
import { useSession } from "../../context/AuthContext";
import { useRouter, Link } from "expo-router";

export default function Page() {
  const router = useRouter();
  const { signIn, isLoading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSignInPress = async () => {
    try {
      setError("");
      await signIn(email, password);
      router.replace("/");
    } catch (err: any) {
      console.error("Sign in error", err);
      // Try to get message from axios error
       const msg = err.response?.data?.error || "Invalid credentials";
       setError(msg);

    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#666"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#666"
          secureTextEntry
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={onSignInPress}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? "Signing in..." : "Sign In"}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/sign-up">
          <Text style={styles.linkText}>Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 24,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: "#FFF",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 16,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    marginTop: 24,
  },
  footerText: {
    color: "#888",
  },
  linkText: {
    color: "#2563EB",
    fontWeight: "500",
  },
});
