import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const isCandidates = pathname.includes("/candidates");

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path as never);
  };

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => setMenuOpen(true)}
          style={styles.headerButton}
          hitSlop={10}
        >
          <Ionicons name="menu-outline" size={25} color="#111" />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.headerRight}>
          {isCandidates && (
            <>
              <Pressable
                onPress={() => router.push("/candidates/search" as never)}
                style={styles.headerButton}
                hitSlop={10}
              >
                <Ionicons name="search-outline" size={22} color="#111" />
              </Pressable>

              <Pressable
                onPress={() => setFilterOpen(true)}
                style={styles.headerButton}
                hitSlop={10}
              >
                <Ionicons name="filter-outline" size={22} color="#111" />
              </Pressable>
            </>
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
            <View style={styles.sidebarHeader}>
              <View>
                <Text style={styles.logo}>OERP</Text>
                <Text style={styles.logoSubtitle}>Overseas ERP</Text>
              </View>

              <Pressable
                onPress={() => setMenuOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#111" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.menuContent}
            >
              <Text style={styles.sectionTitle}>MAIN</Text>

              <MenuItem
                icon="grid-outline"
                label="Dashboard"
                active={pathname === "/"}
                onPress={() => navigate("/(app)")}
              />

              <MenuItem
                icon="people-outline"
                label="Candidates"
                active={pathname.includes("/candidates")}
                onPress={() => navigate("/(app)/candidates")}
              />

              <MenuItem
                icon="document-text-outline"
                label="Visa"
                active={pathname.includes("/visa")}
                onPress={() => navigate("/(app)/visa")}
              />

              <Text style={styles.sectionTitle}>PROCESSING</Text>

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

              <Text style={styles.sectionTitle}>OTHER</Text>

              <MenuItem
                icon="bar-chart-outline"
                label="Reports"
                onPress={() => setMenuOpen(false)}
              />

              <MenuItem
                icon="person-outline"
                label="Profile"
                active={pathname.includes("/profile")}
                onPress={() => navigate("/(app)/profile")}
              />
            </ScrollView>

            <View style={styles.sidebarFooter}>
              <Text style={styles.footerText}>OERP</Text>
              <Text style={styles.footerVersion}>v1.0</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Candidate Filter */}
      <CandidateFilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </>
  );
}

function CandidateFilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState("all");
  const [stage, setStage] = useState("all");
  const [agent, setAgent] = useState("all");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.filterRoot}>
        <Pressable style={styles.filterOverlay} onPress={onClose} />

        <View style={styles.filterSheet}>
          <View style={styles.filterHandle} />

          <View style={styles.filterHeader}>
            <View>
              <Text style={styles.filterTitle}>Filter Candidates</Text>
              <Text style={styles.filterSubtitle}>
                Filter candidates by status, stage or agent
              </Text>
            </View>

            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#111" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {/* STATUS */}
            <FilterSection title="Status">
              <FilterOption
                label="All"
                selected={status === "all"}
                onPress={() => setStatus("all")}
              />

              <FilterOption
                label="Active"
                selected={status === "active"}
                onPress={() => setStatus("active")}
              />

              <FilterOption
                label="Returned"
                selected={status === "returned"}
                onPress={() => setStatus("returned")}
              />

              <FilterOption
                label="Complete"
                selected={status === "complete"}
                onPress={() => setStatus("complete")}
              />

              <FilterOption
                label="Hold"
                selected={status === "hold"}
                onPress={() => setStatus("hold")}
              />

              <FilterOption
                label="Cancelled"
                selected={status === "cancelled"}
                onPress={() => setStatus("cancelled")}
              />
            </FilterSection>

            {/* STAGE */}
            <FilterSection title="Stage">
              <FilterOption
                label="All"
                selected={stage === "all"}
                onPress={() => setStage("all")}
              />

              <FilterOption
                label="Medical"
                selected={stage === "medical"}
                onPress={() => setStage("medical")}
              />

              <FilterOption
                label="MOFA"
                selected={stage === "mofa"}
                onPress={() => setStage("mofa")}
              />

              <FilterOption
                label="Finger"
                selected={stage === "finger"}
                onPress={() => setStage("finger")}
              />

              <FilterOption
                label="PCC"
                selected={stage === "pcc"}
                onPress={() => setStage("pcc")}
              />

              <FilterOption
                label="Takamul"
                selected={stage === "takamul"}
                onPress={() => setStage("takamul")}
              />

              <FilterOption
                label="Visa"
                selected={stage === "visa"}
                onPress={() => setStage("visa")}
              />

              <FilterOption
                label="Flight"
                selected={stage === "flight"}
                onPress={() => setStage("flight")}
              />

              <FilterOption
                label="Iqama"
                selected={stage === "iqama"}
                onPress={() => setStage("iqama")}
              />
            </FilterSection>

            {/* AGENT */}
            <FilterSection title="Agent">
              <FilterOption
                label="All"
                selected={agent === "all"}
                onPress={() => setAgent("all")}
              />

              <FilterOption
                label="Agent 001"
                selected={agent === "agent-001"}
                onPress={() => setAgent("agent-001")}
              />

              <FilterOption
                label="Agent 002"
                selected={agent === "agent-002"}
                onPress={() => setAgent("agent-002")}
              />

              <FilterOption
                label="Agent 003"
                selected={agent === "agent-003"}
                onPress={() => setAgent("agent-003")}
              />
            </FilterSection>
          </ScrollView>

          <View style={styles.filterFooter}>
            <Pressable
              style={styles.clearButton}
              onPress={() => {
                setStatus("all");
                setStage("all");
                setAgent("all");
              }}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>

            <Pressable
              style={styles.applyButton}
              onPress={onClose}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <View style={styles.optionsBox}>{children}</View>
    </View>
  );
}

function FilterOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterOption,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.filterOptionText,
          selected && styles.filterOptionTextSelected,
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}
      >
        {selected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
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
      <Ionicons
        name={icon}
        size={21}
        color={active ? "#111" : "#666"}
      />

      <Text
        style={[
          styles.menuLabel,
          active && styles.menuLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    elevation: 2,
    zIndex: 10,
  },

  headerButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  headerRight: {
    width: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },

  modalRoot: {
    flex: 1,
    flexDirection: "row",
  },

  overlay: {
  ...StyleSheet.absoluteFill,
  backgroundColor: "rgba(0,0,0,0.35)",
},

  sidebar: {
    width: 292,
    height: "100%",
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 3,
      height: 0,
    },
  },

  sidebarHeader: {
    height: 82,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },

  logoSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#888",
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },

  menuContent: {
    paddingVertical: 18,
    paddingHorizontal: 12,
  },

  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 10,
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 1,
  },

  menuItem: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 3,
  },

  menuItemActive: {
    backgroundColor: "#f1f1f1",
  },

  menuLabel: {
    fontSize: 14,
    color: "#555",
  },

  menuLabelActive: {
    color: "#111",
    fontWeight: "700",
  },

  sidebarFooter: {
    padding: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
  },

  footerVersion: {
    fontSize: 11,
    color: "#999",
  },

  pressed: {
    opacity: 0.65,
  },

  filterRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },

 filterOverlay: {
  ...StyleSheet.absoluteFill,
  backgroundColor: "rgba(0,0,0,0.35)",
},

  filterSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: "88%",
    paddingTop: 8,
  },

  filterHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginVertical: 8,
  },

  filterHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },

  filterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  filterSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#888",
  },

  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 24,
  },

  filterSection: {
    marginTop: 12,
  },

  filterSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    marginBottom: 7,
  },

  optionsBox: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    overflow: "hidden",
  },

  filterOption: {
    minHeight: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },

  filterOptionText: {
    fontSize: 14,
    color: "#555",
  },

  filterOptionTextSelected: {
    color: "#111",
    fontWeight: "600",
  },

  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: "#111",
  },

  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#111",
  },

  filterFooter: {
    padding: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },

  clearButton: {
    flex: 1,
    height: 46,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
  },

  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  applyButton: {
    flex: 1,
    height: 46,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },

  applyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});