import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useState } from "react";

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const isCandidates = pathname.includes("/candidates");

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path as never);
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable
          onPress={() => setMenuOpen(true)}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressed,
          ]}
          hitSlop={8}
        >
          <Ionicons
            name="menu-outline"
            size={24}
            color="#111827"
          />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>

          {isCandidates && (
            <View style={styles.liveDot}>
              <View style={styles.liveDotInner} />
              <Text style={styles.liveText}>Workspace</Text>
            </View>
          )}
        </View>

        <View style={styles.headerRight}>
          {isCandidates ? (
            <Pressable
              onPress={() =>
                router.push("/candidates/search" as never)
              }
              style={({ pressed }) => [
                styles.headerAction,
                pressed && styles.pressed,
              ]}
              hitSlop={8}
            >
              <Ionicons
                name="search-outline"
                size={21}
                color="#344054"
              />
            </Pressable>
          ) : (
            <Pressable
              onPress={() =>
                router.push("/(app)/profile" as never)
              }
              style={({ pressed }) => [
                styles.headerProfile,
                pressed && styles.pressed,
              ]}
              hitSlop={8}
            >
              <Ionicons
                name="person-outline"
                size={19}
                color="#667085"
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Sidebar */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.overlay}
            onPress={() => setMenuOpen(false)}
          />

          <View style={styles.sidebar}>
            {/* Sidebar brand */}
            <View style={styles.sidebarHeader}>
              <View style={styles.brandRow}>
                <View style={styles.brandIcon}>
                  <Text style={styles.brandIconText}>O</Text>
                </View>

                <View>
                  <Text style={styles.logo}>OERP</Text>
                  <Text style={styles.logoSubtitle}>
                    Overseas ERP
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setMenuOpen(false)}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.pressed,
                ]}
                hitSlop={6}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color="#667085"
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.menuContent}
            >
              {/* Workspace */}
              <MenuSection title="WORKSPACE">
                <MenuItem
                  icon="grid-outline"
                  active={isDashboard(pathname)}
                  label="Dashboard"
                  onPress={() => navigate("/(app)")}
                />

                <MenuItem
                  icon="people-outline"
                  active={pathname.includes("/candidates")}
                  label="Candidates"
                  onPress={() =>
                    navigate("/(app)/candidates")
                  }
                />

                <MenuItem
                  icon="document-text-outline"
                  active={pathname.includes("/visa")}
                  label="Visa"
                  onPress={() => navigate("/(app)/visa")}
                />
              </MenuSection>

              {/* Processing */}
              <MenuSection title="PROCESSING">
                <MenuItem
                  icon="medkit-outline"
                  label="Medical"
                  onPress={() => setMenuOpen(false)}
                />

                <MenuItem
                  icon="document-outline"
                  label="MOFA"
                  onPress={() => setMenuOpen(false)}
                />

                <MenuItem
                  icon="finger-print-outline"
                  label="Finger"
                  onPress={() => setMenuOpen(false)}
                />

                <MenuItem
                  icon="shield-checkmark-outline"
                  label="PCC"
                  onPress={() => setMenuOpen(false)}
                />

                <MenuItem
                  icon="school-outline"
                  label="Takamul"
                  onPress={() => setMenuOpen(false)}
                />

                <MenuItem
                  icon="airplane-outline"
                  label="Flight"
                  onPress={() => setMenuOpen(false)}
                />
              </MenuSection>

              {/* System */}
              <MenuSection title="SYSTEM">
                <MenuItem
                  icon="bar-chart-outline"
                  label="Reports"
                  onPress={() => setMenuOpen(false)}
                />

                <MenuItem
                  icon="person-outline"
                  active={pathname.includes("/profile")}
                  label="Profile"
                  onPress={() =>
                    navigate("/(app)/profile")
                  }
                />
              </MenuSection>
            </ScrollView>

            {/* Sidebar footer */}
            <View style={styles.sidebarFooter}>
              <View>
                <Text style={styles.footerTitle}>
                  OERP Mobile
                </Text>

                <Text style={styles.footerSubtitle}>
                  Overseas ERP workspace
                </Text>
              </View>

              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v1.0</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Menu                                                                        */
/* -------------------------------------------------------------------------- */

function MenuSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {children}
    </View>
  );
}

function MenuItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        active && styles.menuItemActive,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.menuIcon,
          active && styles.menuIconActive,
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={active ? "#208AEF" : "#667085"}
        />
      </View>

      <Text
        style={[
          styles.menuLabel,
          active && styles.menuLabelActive,
        ]}
      >
        {label}
      </Text>

      {active && (
        <View style={styles.activeIndicator} />
      )}
    </Pressable>
  );
}

function isDashboard(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/(app)" ||
    pathname.endsWith("/(app)")
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Keep individual styles strongly typed.
 *
 * React Native 0.86's StyleSheet typings can widen a mixed
 * StyleSheet.create object into ViewStyle | TextStyle | ImageStyle.
 * That then causes Text/View style compatibility errors.
 */
const styles = {
  header: {
    height: 60,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E4E7EC",
    elevation: 2,
    zIndex: 10,
  } satisfies ViewStyle,

  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  } satisfies ViewStyle,

  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  } satisfies TextStyle,

  liveDot: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  } satisfies ViewStyle,

  liveDotInner: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  } satisfies ViewStyle,

  liveText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#98A2B3",
  } satisfies TextStyle,

  headerRight: {
    width: 40,
    alignItems: "flex-end",
  } satisfies ViewStyle,

  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,

  headerProfile: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
    borderWidth: 1,
    borderColor: "#E4E7EC",
  } satisfies ViewStyle,
overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(15, 23, 42, 0.38)",
},
  /* Sidebar */

  modalRoot: {
    flex: 1,
    flexDirection: "row",
  } satisfies ViewStyle,

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.38)",
  } satisfies ViewStyle,

  sidebar: {
    width: 292,
    height: "100%",
    backgroundColor: "#FFFFFF",
    elevation: 12,
    shadowColor: "#101828",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: {
      width: 5,
      height: 0,
    },
  } satisfies ViewStyle,

  sidebarHeader: {
    minHeight: 84,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EAECF0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } satisfies ViewStyle,

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  } satisfies ViewStyle,

  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#208AEF",
    marginRight: 11,
  } satisfies ViewStyle,

  brandIconText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  } satisfies TextStyle,

  logo: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.3,
  } satisfies TextStyle,

  logoSubtitle: {
    marginTop: 2,
    fontSize: 10,
    color: "#98A2B3",
  } satisfies TextStyle,

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
  } satisfies ViewStyle,

  menuContent: {
    paddingHorizontal: 12,
    paddingTop: 13,
    paddingBottom: 20,
  } satisfies ViewStyle,

  menuSection: {
    marginBottom: 12,
  } satisfies ViewStyle,

  sectionTitle: {
    marginTop: 10,
    marginBottom: 7,
    marginLeft: 9,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#98A2B3",
  } satisfies TextStyle,

  menuItem: {
    minHeight: 48,
    paddingHorizontal: 10,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    position: "relative",
  } satisfies ViewStyle,

  menuItemActive: {
    backgroundColor: "#EAF4FF",
  } satisfies ViewStyle,

  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,

  menuIconActive: {
    backgroundColor: "#FFFFFF",
  } satisfies ViewStyle,

  menuLabel: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#667085",
  } satisfies TextStyle,

  menuLabelActive: {
    color: "#1674CF",
    fontWeight: "700",
  } satisfies TextStyle,

  activeIndicator: {
    position: "absolute",
    right: 9,
    width: 4,
    height: 20,
    borderRadius: 3,
    backgroundColor: "#208AEF",
  } satisfies ViewStyle,

  /* Footer */

  sidebarFooter: {
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EAECF0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } satisfies ViewStyle,

  footerTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#344054",
  } satisfies TextStyle,

  footerSubtitle: {
    marginTop: 2,
    fontSize: 9,
    color: "#98A2B3",
  } satisfies TextStyle,

  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#F2F4F7",
  } satisfies ViewStyle,

  versionText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#667085",
  } satisfies TextStyle,

  pressed: {
    opacity: 0.65,
  } satisfies ViewStyle,
};