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
import { useSession } from "../../context/AuthContext";
import { PlusIcon } from "lucide-react-native";

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
  const { currentUser } = useSession();
  const [sets, setSets] = useState<SetType[]>([]);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Server-driven search: show exactly what backend returns
  const filteredSets = sets;

  React.useEffect(() => {
    const fetchSets = async () => {
      if (!currentUser?.id) return;
      try {
        setErrorMsg("");
        setIsLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/sets/user/${currentUser.id}`,
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        const list = (data?.sets || []) as Array<{
          id: string;
          title: string;
          visibility: string;
          createdAt: string;
        }>;
        const owner: OwnerData = {
          id: currentUser.id,
          email: currentUser.email,
          name: "You",
          image_url: "",
        };
        const mapped: SetType[] = list.map((s) => ({
          set: {
            id: String(s.id),
            title: String(s.title || "Untitled"),
            visibility: String(s.visibility || "private"),
            created_at: String(s.createdAt || new Date().toISOString()),
            updated_at: String(s.createdAt || new Date().toISOString()),
            user_id: currentUser.id,
          },
          owner,
        }));
        setSets(mapped);
      } catch (e: any) {
        setErrorMsg(e?.message || "Failed to load sets");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSets();
  }, [currentUser?.id]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/set/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setSets((prev) => prev.filter((s) => s.set.id !== id));
    } catch (e: any) {
      setErrorMsg(e?.message || "Failed to delete set");
    }
  };

  const renderItem = ({ item }: { item: SetType }) => {
    const ownerInitial = item.owner?.name?.[0]?.toUpperCase?.() || "?";
    return (
      <View style={styles.card}>
        <View>
          <View style={styles.cardHeaderRow}>
            <Link href={`/sets/${item.set.id}`}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.set.title || "Untitled Set"}
              </Text>
            </Link>
            <TouchableOpacity
              onPress={() => handleDelete(item.set.id)}
              style={{ paddingHorizontal: 8, paddingVertical: 4 }}
              activeOpacity={0.7}
            >
              <Text style={{ color: "#ef4444", fontWeight: "600" }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(`/sets/${item.set.id}`)}>
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
        </View>
      </View>
    );
  };

  const onCreateNew = async () => {
    if (creating) return;
    if (!currentUser?.id) {
      setErrorMsg("Please sign in first");
      return;
    }
    setCreating(true);
    setErrorMsg("");
    try {
      const payload = {
        visibility: "public",
        title: `New Set ${sets.length + 1}`,
        userId: currentUser.id,
      };
      const res = await fetch("http://localhost:3000/api/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = await res.json();
      const setResp = data?.set;
      if (!setResp?.id) {
        throw new Error("Invalid response");
      }

      const now = new Date().toISOString();
      const ownerFallback: OwnerData = sets[0]?.owner || {
        id: "local",
        email: "",
        name: "You",
        image_url: "",
      };
      const newSet: SetType = {
        set: {
          id: String(setResp.id),
          title: String(setResp.title || payload.title || "Untitled"),
          visibility: String(
            setResp.visibility || payload.visibility || "private",
          ),
          created_at: String(setResp.createdAt || now),
          updated_at: String(setResp.updatedAt || now),
          user_id: ownerFallback.id,
        },
        owner: ownerFallback,
      };
      setSets((prev) => [newSet, ...prev]);
      router.push(`/sets/${newSet.set.id}`);
    } catch (e: any) {
      // setErrorMsg(e?.message || "Failed to create set");
      setErrorMsg("No Sets Found");
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Sets</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={onCreateNew}
          disabled={creating || !currentUser?.id}
        >
          <View style={styles.headerBtnContainer}>
            <PlusIcon size={24} color={creating ? "#6b7280" : "#a5b4fc"} />
            <Text style={styles.headerBtnText}>
              {creating ? "Creating…" : "New"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search sets by title"
            placeholderTextColor="#9aa0b2"
            style={{
              flex: 1,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: "#1c1c1c",
              backgroundColor: "transparent",
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 8,
              color: "#ffffff",
            }}
          />
          <TouchableOpacity
            onPress={async () => {
              const q = query.trim();
              if (!q) {
                setErrorMsg("Enter a search query");
                return;
              }
              try {
                setIsLoading(true);
                setErrorMsg("");
                const res = await fetch(
                  `http://localhost:3000/api/sets/search?query=${encodeURIComponent(q)}`,
                );
                if (!res.ok) throw new Error(`Search failed: ${res.status}`);
                const data = await res.json();
                const list = (data?.sets || []) as Array<{
                  id: string;
                  title: string;
                  visibility: string;
                  createdAt: string;
                  updatedAt: string;
                  userId: string;
                }>;
                const owner: OwnerData = {
                  id: currentUser?.id || "",
                  email: currentUser?.email || "",
                  name: "You",
                  image_url: "",
                };
                const mapped: SetType[] = list.map((s) => ({
                  set: {
                    id: String(s.id),
                    title: String(s.title || "Untitled"),
                    visibility: String(s.visibility || "private"),
                    created_at: String(s.createdAt || new Date().toISOString()),
                    updated_at: String(s.updatedAt || s.createdAt || new Date().toISOString()),
                    user_id: String(s.userId || owner.id || ""),
                  },
                  owner,
                }));
                setSets(mapped);
              } catch (e: any) {
                setErrorMsg(e?.message || "Failed to search sets");
              } finally {
                setIsLoading(false);
              }
            }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: "#4f46e5",
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>Search</Text>
          </TouchableOpacity>
        </View>
        {errorMsg ? (
          <Text style={{ color: "#ef4444", marginTop: 8 }}>{errorMsg}</Text>
        ) : null}
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
