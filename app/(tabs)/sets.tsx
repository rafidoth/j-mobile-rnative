import styles from "../(tab_styles)/SetsTabStyles";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { Link, router } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import dummy_sets from "@/data/sets";

interface SetData {
  id: string;
  visibility: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface OwnerData {
  id: string;
  email: string;
  name: string;
  image_url: string;
}

type SetType = {
  set: SetData;
  owner: OwnerData;
};

const Sets = () => {
  const [sets, setSets] = useState<SetType[]>(dummy_sets as SetType[]);
  const [query, setQuery] = useState("");
  const isLoading = false;

  const filteredSets = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sets;
    return sets.filter((s) => (s.set.title || "").toLowerCase().includes(q));
  }, [query, sets]);

  const handleDelete = (id: string) => {
    setSets((prev) => prev.filter((s) => s.set.id !== id));
  };

  const renderItem = ({ item }: { item: SetType }) => {
    const ownerInitial = item.owner?.name?.[0]?.toUpperCase?.() || "?";
    return (
      <View style={styles.card}>
        <Link href={`/sets/${item.set.id}`} asChild>
          <TouchableOpacity activeOpacity={0.85}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.set.title || "Untitled Set"}
              </Text>
              <TouchableOpacity
                onPress={() => handleDelete(item.set.id)}
                style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                activeOpacity={0.7}
              >
                <Text style={{ color: "#ef4444", fontWeight: "600" }}>Delete</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardFooterRow}>
              <View style={styles.ownerRow}>
                {item.owner?.image_url ? (
                  <Image
                    source={{ uri: item.owner?.image_url }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{ownerInitial}</Text>
                  </View>
                )}
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.ownerName} numberOfLines={1}>
                    {item.owner?.name || "Unknown Owner"}
                  </Text>
                  {item.set.updated_at ? (
                    <Text style={styles.subText}>
                      Updated {timeAgo(item.set.updated_at)}
                    </Text>
                  ) : item.set.created_at ? (
                    <Text style={styles.subText}>
                      Created {timeAgo(item.set.created_at)}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View>
                {item.set.visibility ? (
                  <Text style={styles.visibilityBadge}>
                    {item.set.visibility}
                  </Text>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    );
  };

  const onCreateNew = () => {
    const now = new Date().toISOString();
    const newId = String(Date.now());
    const ownerFallback: OwnerData = sets[0]?.owner || {
      id: "local",
      email: "",
      name: "You",
      image_url: "",
    };
    const newSet: SetType = {
      set: {
        id: newId,
        title: `New Set ${sets.length + 1}`,
        visibility: "private",
        created_at: now,
        updated_at: now,
        user_id: ownerFallback.id,
      },
      owner: ownerFallback,
    };
    setSets((prev) => [newSet, ...prev]);
    // router.push(`/sets/${newId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Sets</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={onCreateNew}>
          <View style={styles.headerBtnContainer}>
            <PlusIcon size={24} color={"#a5b4fc"} />
            <Text style={styles.headerBtnText}>New</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search sets by title"
          placeholderTextColor="#9aa0b2"
          style={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: "#1c1c1c",
            backgroundColor: "transparent",
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 8,
            color: "#111827",
          }}
        />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loaderText}>Loading sets…</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSets}
          keyExtractor={(item) => String(item.set.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={{ padding: 24 }}>
              <Text style={styles.subText}>No sets match your search.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export default Sets;
