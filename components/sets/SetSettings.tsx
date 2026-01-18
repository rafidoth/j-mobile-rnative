import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  Globe as GlobeIcon,
  Lock as LockClosedIcon,
  Eye as EyeOpenIcon,
} from "lucide-react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

const COLORS = {
  primary: "#1d4ed8",
  primaryLight: "#eff6ff",
  text: "#000000",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  error: "#dc2626",
  white: "#ffffff",
};

interface SetPreferences {
  id: string;
  title: string;
  visibility?: string;
}

interface SetSettingsUpdateViewProps {
  set: SetPreferences;
  setSet: (updater: SetPreferences | ((prev: SetPreferences) => SetPreferences)) => void;
}

function SetSettingsUpdateView({ set, setSet }: SetSettingsUpdateViewProps) {
  const [title, setTitle] = useState<string>(set.title);
  const visibilityList = ["public", "private", "restricted"] as const;
  const [currentVisibility, setCurrentVisibility] = useState<string>(set.visibility || "private");
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleApply = async () => {
    try {
      setIsPending(true);
      setError("");
      const res = await fetch(`http://localhost:3000/api/set/${set.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, visibility: currentVisibility }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const data = await res.json();
      const updated = data?.set;
      if (!updated?.id) throw new Error("Invalid response");
      setSet((prev) => ({ ...prev, title: String(updated.title || title), visibility: String(updated.visibility || currentVisibility) }));
    } catch (_e) {
      setError("Failed to update set. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const isUnchanged = title === set.title && (currentVisibility || "") === (set.visibility || "");
  const isValid = title && title.trim() !== "";
  const isDisabled = !isValid || isUnchanged || isPending;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Set Settings</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Title</Text>
          <BottomSheetTextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Enter set title"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Visibility</Text>
          <VisibilityList
            currentVisibility={currentVisibility}
            setCurrentVisibility={setCurrentVisibility}
            visibilityList={visibilityList as unknown as string[]}
          />
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={isDisabled}
          onPress={handleApply}
          style={[styles.button, isDisabled && styles.buttonDisabled]}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SetSettingsUpdateView;

function VisibilityList({
  currentVisibility,
  setCurrentVisibility,
  visibilityList,
}: {
  currentVisibility: string;
  setCurrentVisibility: (value: string) => void;
  visibilityList: string[];
}) {
  return (
    <View style={styles.visibilityContainer}>
      {visibilityList.map((v) => {
        const isSelected = currentVisibility === v;
        return (
          <TouchableOpacity
            key={v}
            onPress={() => setCurrentVisibility(v)}
            style={[
              styles.visibilityOption,
              isSelected && styles.visibilityOptionSelected,
            ]}
          >
            <Text
              style={[
                styles.visibilityText,
                isSelected && styles.visibilityTextSelected,
              ]}
            >
              {v}
            </Text>
            {getVisibilityIcon(v, isSelected)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function getVisibilityIcon(visibility: string, isSelected: boolean) {
  const color = isSelected ? COLORS.primary : COLORS.textMuted;

  switch (visibility) {
    case "public":
      return <GlobeIcon size={24} color={color} />;
    case "private":
      return <LockClosedIcon size={24} color={color} />;
    case "restricted":
      return <EyeOpenIcon size={24} color={color} />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 8,
    padding: 20,
  },
  section: {
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
    marginBottom: 8,
  },
  input: {
    height: 40,
    width: "100%",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "white",
    backgroundColor: "transparent",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
  },
  visibilityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  visibilityOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#1c1c1c",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    gap: 8,
  },
  visibilityOptionSelected: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#334155",
    backgroundColor: "#1c1c1c",
  },
  visibilityText: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "white",
  },
  visibilityTextSelected: {
    color: COLORS.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginBottom: 8,
  },
  button: {
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
});
