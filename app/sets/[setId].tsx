import React, { useCallback, useMemo, useRef, useState } from "react";
import styles from "./setIdStyles";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  Image,
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
}: {
  setId: string | number;
  title: string;
  visibility?: string;
  itemsLength: number;
  showAnswer: boolean;
  toggleShowAnswer: () => void;
  onAdd: () => void;
  onSettings: () => void;
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
        </View>
      </View>
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

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
         const resp = await fetch(
           `http://localhost:3000/api/questions/${setId}`,
         );
         const data = await resp.json();
         if (Array.isArray(data?.questions)) {
           setItems(data.questions);
         }

      } catch (e) {
        console.log("Failed to load questions", e);
      }
    };
    if (setId) fetchQuestions();
  }, [setId]);

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
      }
    } catch (e) {
      console.log("Failed to update question", e);
      // rollback
      setItems(prevItems);
    }
  };

  const deleteQuestionById = async (questionId: string | number) => {
    const prevItems = items;
    // optimistic remove
    setItems((prev) => prev.filter((q: any) => String(q.id) !== String(questionId)));
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
      setItems((prev) => [created, ...prev]);
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

export default ExistingSetScreen;
