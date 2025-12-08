import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";

function timeAgo(date: Date) {
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

function formatReadableDateTime(date?: Date) {
  if (!date) return "—";
  return date.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const avatarSize = 64;
  const imageUri = user?.imageUrl || (user as any)?.image_url || undefined;
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";
  const provider = user?.externalAccounts?.[0]?.provider || undefined;
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const fullName = user?.fullName || `${firstName} ${lastName}`.trim();
  const createdAtDate = user?.createdAt ? new Date(user.createdAt) : undefined;
  const lastSignInDate = user?.lastSignInAt
    ? new Date(user.lastSignInAt)
    : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.identityCard}>
        <View style={styles.identityRow}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
              }}
            />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                },
              ]}
            >
              <Text style={styles.avatarInitial}>
                {(fullName || "?").charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.identityTextBlock}>
            <Text style={styles.nameText} numberOfLines={1}>
              {fullName || "Unknown User"}
            </Text>
            {provider ? (
              <View style={styles.providerBadge}>
                <View style={styles.providerLogoCircle}>
                  <Text style={styles.providerLogoText}>G</Text>
                </View>
                <Text style={styles.providerText}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Joined</Text>
          <Text style={styles.detailValue}>
            {createdAtDate ? `Joined ${timeAgo(createdAtDate)}` : "—"}
          </Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>
            {!!primaryEmail && (
              <Text style={styles.emailText} numberOfLines={1}>
                {primaryEmail}
              </Text>
            )}
          </Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Last Sign-In</Text>
          <Text style={styles.detailValue}>
            {formatReadableDateTime(lastSignInDate)}
          </Text>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logout} onPress={() => signOut()}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 24,
    justifyContent: "center",
  },
  identityCard: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 20,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  avatarFallback: {
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#e5e7eb",
    fontSize: 40,
    fontWeight: "700",
  },
  identityTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  nameText: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 6,
  },
  emailText: {
    color: "#9aa0b2",
    fontSize: 16,
    marginBottom: 12,
  },
  providerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2937",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 10,
    alignSelf: "flex-start",
  },
  providerLogoCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ea4335",
    alignItems: "center",
    justifyContent: "center",
  },
  providerLogoText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  providerText: {
    color: "#e5e7eb",
    fontSize: 15,
    fontWeight: "700",
  },
  detailsCard: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 20,
    gap: 18,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  detailBlock: {
    gap: 6,
  },
  detailLabel: {
    color: "#9aa0b2",
    fontSize: 14,
  },
  detailValue: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "600",
  },
  securityCard: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    backgroundColor: "#1f2937",
    color: "#a5b4fc",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 14,
    fontWeight: "700",
  },
  badgeMuted: {
    backgroundColor: "#1f2937",
    color: "#9aa0b2",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 14,
    fontWeight: "700",
  },
  logout: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  logoutContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
