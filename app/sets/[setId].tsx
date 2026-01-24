import React, { useCallback, useMemo, useRef, useState } from "react";
import styles from "./setIdStyles";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  Image,
  ActivityIndicator,
} from "react-native";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import {
  Settings,
  Plus,
  Globe,
  Lock,
  Eye,
  ArrowLeft,
  Pencil,
  X,
  Check,
} from "lucide-react-native";

import useExistingSetStore from "../../store/existingSetStore";
import McqCard from "../../components/question_cards/McqCard";
import SetSettingsUpdateView from "@/components/sets/SetSettings";
import NewQuestionsAdd from "@/components/sets/NewQuestionsAdd";

type AccessUser = {
  id: string | number;
  name: string | null;
  email: string | null;
  image_url?: string | null;
};

type SetPreferences = {
  id: string;
  title: string;
  visibility?: string;
};

const getVisibilityIcon = (visibility?: string) => {
  const iconColor = "#cbd5e1";
  switch (visibility) {
    case "public":
      return <Globe size={20} color={iconColor} />;
    case "private":
      return <Lock size={20} color={iconColor} />;
    case "restricted":
      return <Eye size={20} color={iconColor} />;
    default:
      return null;
  }
};

const AvatarRow = ({ users }: { users: AccessUser[] }) => {
  if (!users?.length) return null;
  const max = 4;
  const visible = users.slice(0, max);
  const remaining = users.length - visible.length;
  return (
    <View style={styles.avatarRow}>
      {visible.map((u, i) => (
        <View
          key={String(u.id)}
          style={[styles.avatarWrap, i > 0 && { marginLeft: -12 }]}
        >
          {u?.image_url ? (
            <Image source={{ uri: u.image_url }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>
                {(u?.name?.[0] || "?").toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      ))}
      {remaining > 0 && (
        <View style={[styles.avatarWrap, { marginLeft: -12 }]}>
          <View style={[styles.avatarFallback, { backgroundColor: "#e5e7eb" }]}>
            <Text style={[styles.avatarFallbackText, { color: "#111827" }]}>
              +{remaining}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const Header = ({
  setId,
  title,
  visibility,
  itemsLength,
  showAnswer,
  toggleShowAnswer,
  onAdd,
  onSettings,
  editMode,
  onToggleEditMode,
  hasUnsavedChanges,
  onSaveOrder,
  onCancelEdit,
  isSaving,
}: {
  setId: string | number;
  title: string;
  visibility?: string;
  itemsLength: number;
  showAnswer: boolean;
  toggleShowAnswer: () => void;
  onAdd: () => void;
  onSettings: () => void;
  editMode: boolean;
  onToggleEditMode: () => void;
  hasUnsavedChanges: boolean;
  onSaveOrder: () => void;
  onCancelEdit: () => void;
  isSaving: boolean;
}) => {
  const users: AccessUser[] = [];
  const isLoading = false;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={() => router.push("/sets")}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#e5e7eb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.headerActions}>
          {!editMode && (
            <>
              <TouchableOpacity
                onPress={onAdd}
                style={styles.iconButton}
                accessibilityLabel="Add question"
              >
                <Plus size={22} color="#e5e7eb" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSettings}
                style={styles.iconButton}
                accessibilityLabel="Set settings"
              >
                <Settings size={22} color="#e5e7eb" />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            onPress={onToggleEditMode}
            style={[
              styles.iconButton,
              editMode && { backgroundColor: "#7c3aed", borderColor: "#7c3aed" },
            ]}
            accessibilityLabel={editMode ? "Exit edit mode" : "Enter edit mode"}
          >
            <Pencil size={22} color="#e5e7eb" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Mode Actions Bar */}
      {editMode && (
        <View style={editModeStyles.editModeBar}>
          <Text style={editModeStyles.editModeText}>Reorder Mode</Text>
          <View style={editModeStyles.editModeActions}>
            <TouchableOpacity
              onPress={onCancelEdit}
              style={editModeStyles.cancelBtn}
              accessibilityLabel="Cancel"
            >
              <X size={18} color="#e5e7eb" />
              <Text style={editModeStyles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSaveOrder}
              disabled={!hasUnsavedChanges || isSaving}
              style={[
                editModeStyles.saveBtn,
                (!hasUnsavedChanges || isSaving) && editModeStyles.saveBtnDisabled,
              ]}
              accessibilityLabel="Save order"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Check size={18} color="#ffffff" />
                  <Text style={editModeStyles.saveBtnText}>Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.headerMetaRow}>
        <View style={styles.visibilityBadge}>
          {getVisibilityIcon(visibility)}
          <Text style={styles.visibilityText}>
            {visibility ? visibility : "unknown"}
          </Text>
        </View>
        <View style={styles.answerToggle}>
          <Switch value={showAnswer} onValueChange={toggleShowAnswer} />
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{itemsLength} questions</Text>
        </View>
      </View>
    </View>
  );
};

const ExistingSetScreen = () => {
  const { setId } = useLocalSearchParams();
  console.log(setId);

  const [set, setSet] = useState<SetPreferences | null>(null);

  React.useEffect(() => {
    const fetchSet = async () => {
      try {
        const resp = await fetch(`http://localhost:3000/api/set/${setId}`);
        const data = await resp.json();
        if (data?.set) {
          setSet(data.set);
        }
      } catch (e) {
        console.log("Failed to load set", e);
      }
    };
    fetchSet();
  }, [setId]);

  const [items, setItems] = useState<any[]>([]);
  const [originalItems, setOriginalItems] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
         const resp = await fetch(
           `http://localhost:3000/api/questions/${setId}`,
         );
         const data = await resp.json();
         if (Array.isArray(data?.questions)) {
           setItems(data.questions);
           setOriginalItems(data.questions);
         }

      } catch (e) {
        console.log("Failed to load questions", e);
      }
    };
    if (setId) fetchQuestions();
  }, [setId]);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if order has changed
  const hasUnsavedChanges = useMemo(() => {
    if (items.length !== originalItems.length) return true;
    return items.some((item, index) => item.id !== originalItems[index]?.id);
  }, [items, originalItems]);

  // Toggle edit mode
  const handleToggleEditMode = () => {
    if (editMode) {
      // Exiting edit mode - reset to original order
      setItems(originalItems);
    }
    setEditMode(!editMode);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setItems(originalItems);
    setEditMode(false);
  };

  // Move question up
  const moveQuestionUp = (index: number) => {
    if (index <= 0) return;
    setItems((prev) => {
      const newItems = [...prev];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      return newItems;
    });
  };

  // Move question down
  const moveQuestionDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => {
      const newItems = [...prev];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      return newItems;
    });
  };

  // Save new order to backend
  const handleSaveOrder = async () => {
    if (!hasUnsavedChanges || !set?.id) return;

    setIsSaving(true);
    try {
      const positions = items.map((item, index) => ({
        questionId: item.id,
        position: index + 1,
      }));

      const res = await fetch("http://localhost:3000/api/questions/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setId: set.id, positions }),
      });

      if (!res.ok) throw new Error(`Reorder failed: ${res.status}`);

      const data = await res.json();
      if (Array.isArray(data?.questions)) {
        setItems(data.questions);
        setOriginalItems(data.questions);
      } else {
        // If API doesn't return updated list, use local state
        setOriginalItems(items);
      }

      setEditMode(false);
    } catch (e) {
      console.log("Failed to save order", e);
      // Optionally show error to user
    } finally {
      setIsSaving(false);
    }
  };

  const editQuestionById = async (questionId: string | number, updates: any) => {
    // optimistic update
    const prevItems = items;
    setItems((prev) =>
      prev.map((q: any) =>
        String(q.id) === String(questionId) ? { ...q, ...updates } : q,
      ),
    );
    try {
      const res = await fetch(`http://localhost:3000/api/question/${encodeURIComponent(String(questionId))}` , {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const data = await res.json();
      const updated = data?.question;
      if (updated?.id != null) {
        setItems((curr) =>
          curr.map((q: any) => (String(q.id) === String(updated.id) ? updated : q)),
        );
        setOriginalItems((curr) =>
          curr.map((q: any) => (String(q.id) === String(updated.id) ? updated : q)),
        );
      }
    } catch (e) {
      console.log("Failed to update question", e);
      // rollback
      setItems(prevItems);
    }
  };

  const deleteQuestionById = async (questionId: string | number) => {
    const prevItems = items;
    const prevOriginal = originalItems;
    // optimistic remove
    setItems((prev) => prev.filter((q: any) => String(q.id) !== String(questionId)));
    setOriginalItems((prev) => prev.filter((q: any) => String(q.id) !== String(questionId)));
    try {
      const res = await fetch(
        `http://localhost:3000/api/question/${encodeURIComponent(String(questionId))}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      // optionally read response
      // const data = await res.json();
    } catch (e) {
      console.log("Failed to delete question", e);
      // rollback
      setItems(prevItems);
      setOriginalItems(prevOriginal);
    }
  };

  const showAnswer = useExistingSetStore((state: any) => state.showAnswer);
  const toggleShowAnswer = useExistingSetStore(
    (state: any) => state.toggleShowAnswer,
  );

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const handleSelectingAnswer = (qId: string | number, ansIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [String(qId)]: ansIndex }));
  };

  // const [settingsOpen, setSettingsOpen] = useState(false);
  // const [addOpen, setAddOpen] = useState(false);
  // const onSettings = () => setSettingsOpen(true);
  const onAdd = () => {
    if (!set?.id) return;
    router.push(`/sets/new-question?setId=${encodeURIComponent(String(set.id))}`);
  };

  const handleCreateQuestion = async (q: any) => {
    try {
      if (!set?.id) return;
      const payload = {
        setId: String(set.id),
        text: String(q.text || ""),
        type: "mcq",
        difficulty: String(q.difficulty || "medium"),
        choices: Array.isArray(q.choices) ? q.choices : [],
        answer: String(q.answer || ""),
        answerIdx: Number(q.answerIdx ?? 0),
        explanation: q.explanation ? String(q.explanation) : undefined,
      };
      const res = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const data = await res.json();
      const created = data?.question;
      if (!created?.id) throw new Error("Invalid response");
      // Add to end of list (new questions get highest position)
      setItems((prev) => [...prev, created]);
      setOriginalItems((prev) => [...prev, created]);
    } catch (e) {
      console.log("Failed to create question", e);
    }
  };

  const settingsSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentSettingsPress = useCallback(() => {
    settingsSheetRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item: any, index: number) =>
          item?.id != null ? `${String(item.id)}-${index}` : String(index)
        }
        numColumns={1}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <McqCard
            question={item}
            position={index + 1}
            selected={selectedAnswers[String(item?.id ?? index)] ?? -1}
            selectAnswer={handleSelectingAnswer}
            editQuestion={editQuestionById}
            deleteQuestion={deleteQuestionById}
            showAnswer={!!showAnswer}
            editMode={editMode}
            onMoveUp={() => moveQuestionUp(index)}
            onMoveDown={() => moveQuestionDown(index)}
            isFirst={index === 0}
            isLast={index === items.length - 1}
          />
        )}
        ListHeaderComponent={() => (
          <Header
            setId={set?.id || ""}
            title={(set?.title as string) || "Set"}
            visibility={set?.visibility}
            itemsLength={items.length}
            showAnswer={!!showAnswer}
            toggleShowAnswer={toggleShowAnswer}
            onAdd={onAdd}
            onSettings={handlePresentSettingsPress}
            editMode={editMode}
            onToggleEditMode={handleToggleEditMode}
            hasUnsavedChanges={hasUnsavedChanges}
            onSaveOrder={handleSaveOrder}
            onCancelEdit={handleCancelEdit}
            isSaving={isSaving}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No questions in this set yet.</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        onEndReachedThreshold={0.2}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={settingsSheetRef}
          onChange={handleSheetChanges}
          snapPoints={["50%", "100%"]}
          backgroundStyle={{ backgroundColor: "#1c1c1c" }}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <SetSettingsUpdateView set={set as any} setSet={setSet as any} />
            <NewQuestionsAdd onCreate={handleCreateQuestion} />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

// Edit mode specific styles
import { StyleSheet } from "react-native";

const editModeStyles = StyleSheet.create({
  editModeBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1e1033",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#7c3aed",
  },
  editModeText: {
    color: "#c4b5fd",
    fontSize: 14,
    fontWeight: "600",
  },
  editModeActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#374151",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#4b5563",
  },
  cancelBtnText: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#16a34a",
  },
  saveBtnDisabled: {
    backgroundColor: "#374151",
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default ExistingSetScreen;
