import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMemo, useState } from "react";

import {
  createCandidate,
  type CreateCandidateInput,
} from "@/services/candidate-service";

const COUNTRIES = [
  "Saudi Arabia",
  "Mauritius",
  "Laos",
  "Malaysia",
  "Belarus",
] as const;

const DEFAULT_SERVICES: Record<string, boolean> = {
  medical: true,
  mofa: true,
  finger: true,
  police_clearance: true,
  takamul: true,
  visa: true,
  manpower: true,
  flight: true,
  iqama: true,
};

const SERVICE_LABELS: Record<string, string> = {
  medical: "Medical",
  mofa: "MOFA",
  finger: "Finger",
  police_clearance: "Police Clearance",
  takamul: "Takamul",
  visa: "Visa",
  manpower: "Manpower",
  flight: "Flight",
  iqama: "Iqama",
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddCandidateScreen() {
  const [name, setName] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [country, setCountry] = useState("");
  const [receivedDate, setReceivedDate] =
    useState(today());

  const [nationality, setNationality] = useState("");
  const [profession, setProfession] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [services, setServices] =
    useState<Record<string, boolean>>(
      DEFAULT_SERVICES,
    );

  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      passportNo.trim().length > 0 &&
      country.trim().length > 0 &&
      !saving
    );
  }, [name, passportNo, country, saving]);

  function toggleService(key: string) {
    setServices((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert("Required", "Candidate name is required.");
      return;
    }

    if (!passportNo.trim()) {
      Alert.alert(
        "Required",
        "Passport number is required.",
      );
      return;
    }

    if (!country) {
      Alert.alert("Required", "Please select a country.");
      return;
    }

    try {
      setSaving(true);

      const input: CreateCandidateInput = {
        name,
        passport_no: passportNo,
        country,
        received_date: receivedDate || null,
        nationality: nationality || null,
        profession: profession || null,
        date_of_birth: dateOfBirth || null,
        phone: phone || null,
        address: address || null,
        requested_services: services,
      };

      const candidate = await createCandidate(input);

      Alert.alert(
        "Candidate Added",
        candidate.sl
          ? `Candidate #${candidate.sl} has been added successfully.`
          : "Candidate has been added successfully.",
        [
          {
            text: "Done",
            onPress: () => {
              router.replace("/candidates");
            },
          },
        ],
      );
    } catch (error) {
      console.error("Add candidate error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to add candidate.";

      Alert.alert("Unable to Add Candidate", message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Add Candidate
          </Text>

          <Text style={styles.subtitle}>
            Create a new candidate record
          </Text>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Basic Information
          </Text>

          <Field
            label="Full Name"
            required
            value={name}
            onChangeText={setName}
            placeholder="Candidate full name"
          />

          <Field
            label="Passport Number"
            required
            value={passportNo}
            onChangeText={(value) =>
              setPassportNo(value.toUpperCase())
            }
            placeholder="e.g. A12345678"
            autoCapitalize="characters"
          />

          <Text style={styles.label}>
            Country <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.countryGrid}>
            {COUNTRIES.map((item) => {
              const selected = country === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setCountry(item)}
                  style={({ pressed }) => [
                    styles.countryButton,
                    selected &&
                      styles.countryButtonSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.countryText,
                      selected &&
                        styles.countryTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Field
            label="Received Date"
            value={receivedDate}
            onChangeText={setReceivedDate}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Personal Information
          </Text>

          <Field
            label="Nationality"
            value={nationality}
            onChangeText={setNationality}
            placeholder="e.g. Bangladeshi"
          />

          <Field
            label="Profession"
            value={profession}
            onChangeText={setProfession}
            placeholder="e.g. Driver"
          />

          <Field
            label="Date of Birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
          />

          <Field
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="01XXXXXXXXX"
            keyboardType="phone-pad"
          />

          <Field
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Candidate address"
            multiline
          />
        </View>

        {/* Requested Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Requested Services
          </Text>

          <Text style={styles.sectionDescription}>
            Select the services required for this
            candidate.
          </Text>

          <View style={styles.serviceGrid}>
            {Object.entries(SERVICE_LABELS).map(
              ([key, label]) => {
                const selected = services[key];

                return (
                  <Pressable
                    key={key}
                    onPress={() => toggleService(key)}
                    style={({ pressed }) => [
                      styles.serviceItem,
                      selected &&
                        styles.serviceItemSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selected &&
                          styles.checkboxSelected,
                      ]}
                    >
                      {selected && (
                        <Text
                          style={styles.checkmark}
                        >
                          ✓
                        </Text>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.serviceText,
                        selected &&
                          styles.serviceTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            Candidate workflow
          </Text>

          <Text style={styles.infoText}>
            New candidates will start in Hold status
            with the reason "received", matching the
            OverseasErp workflow.
          </Text>
        </View>

        {/* Submit */}
        <Pressable
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            !canSubmit &&
              styles.submitButtonDisabled,
            pressed && canSubmit && styles.pressed,
          ]}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              Add Candidate
            </Text>
          )}
        </Pressable>

        <Pressable
          disabled={saving}
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

function Field({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType = "default",
  autoCapitalize,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}{" "}
        {required && (
          <Text style={styles.required}>*</Text>
        )}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={
          multiline ? "top" : "center"
        }
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backText: {
    fontSize: 30,
    lineHeight: 32,
    color: "#111",
    marginTop: -3,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#777",
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
  },

  sectionDescription: {
    marginTop: -6,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 19,
    color: "#777",
  },

  field: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 7,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  required: {
    color: "#d00",
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 11,
    backgroundColor: "#fff",
    color: "#111",
    fontSize: 15,
  },

  multilineInput: {
    minHeight: 90,
    paddingTop: 13,
  },

  countryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  countryButton: {
    minHeight: 42,
    paddingHorizontal: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  countryButtonSelected: {
    borderColor: "#111",
    backgroundColor: "#111",
  },

  countryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },

  countryTextSelected: {
    color: "#fff",
  },

  serviceGrid: {
    gap: 9,
  },

  serviceItem: {
    minHeight: 48,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  serviceItemSelected: {
    borderColor: "#ccc",
    backgroundColor: "#f8f8f8",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  checkboxSelected: {
    backgroundColor: "#111",
    borderColor: "#111",
  },

  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  serviceText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },

  serviceTextSelected: {
    color: "#111",
    fontWeight: "600",
  },

  infoBox: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f6f6f6",
    marginBottom: 18,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
    marginBottom: 5,
  },

  infoText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#666",
  },

  submitButton: {
    height: 50,
    borderRadius: 11,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },

  submitButtonDisabled: {
    backgroundColor: "#aaa",
  },

  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  cancelButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },

  pressed: {
    opacity: 0.7,
  },
});