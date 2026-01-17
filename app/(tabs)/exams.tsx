import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface GenerateProps {
  propName: string;
}

const Generate = ({ propName }: GenerateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },

  text: {
    color: "#ffffff50",
    fontSize: 24,
  },
});

export default Generate;
