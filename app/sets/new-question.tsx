import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import NewQuestionsAdd from "@/components/sets/NewQuestionsAdd";

export default function NewQuestionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={18} color="#e5e7eb" />
        </TouchableOpacity>
        <Text style={styles.title}>Create New Question</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <NewQuestionsAdd
          onCreate={(q: any) => {
            router.back();
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b", paddingTop: 40 },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#334155",
    backgroundColor: "#121212",
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
  },
  backText: { color: "#e5e7eb" },
  title: { color: "#e5e7eb", fontWeight: "600" },
  content: { padding: 16 },
});
