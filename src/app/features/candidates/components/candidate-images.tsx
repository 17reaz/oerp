import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { downloadAndShareImage } from "@/services/share-image";
import type { CandidateImage } from "@/types/candidate";

type Props = {
  images: CandidateImage[];
};

export function CandidateImages({ images }: Props) {
  const { width, height } = useWindowDimensions();

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [sharingKey, setSharingKey] = useState<string | null>(null);

  function open(index: number) {
    setPage(index);
    setOpenIndex(index);
  }

  function close() {
    setOpenIndex(null);
  }

  async function shareImage(image: CandidateImage) {
    try {
      setSharingKey(image.key);

      await downloadAndShareImage(
        image.url,
        `${image.key}.jpg`,
      );
    } catch (error) {
      console.error("Failed to share image:", error);
    } finally {
      setSharingKey(null);
    }
  }

  const current = images[page];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Images</Text>

        <Text style={styles.count}>{images.length}</Text>
      </View>

      {images.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No images</Text>

          <Text style={styles.emptyText}>
            No image uploaded for this candidate.
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbs}
        >
          {images.map((image, index) => (
            <View key={image.key} style={styles.imageCard}>
              <Pressable
                onPress={() => open(index)}
                accessibilityRole="imagebutton"
                accessibilityLabel={`Preview ${image.label}`}
                style={({ pressed }) => [
                  styles.thumb,
                  pressed && styles.pressed,
                ]}
              >
                <Image
                  source={{ uri: image.url }}
                  style={styles.thumbImage}
                  contentFit="cover"
                  transition={150}
                />

                <Text style={styles.thumbLabel} numberOfLines={1}>
                  {image.label}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => shareImage(image)}
                disabled={sharingKey === image.key}
                accessibilityRole="button"
                accessibilityLabel={`Share ${image.label}`}
                style={({ pressed }) => [
                  styles.shareButton,
                  pressed && styles.pressed,
                  sharingKey === image.key && styles.shareButtonDisabled,
                ]}
              >
                {sharingKey === image.key ? (
                  <ActivityIndicator
                    size="small"
                    color="#111"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="share-outline"
                      size={15}
                      color="#111"
                    />

                    <Text style={styles.shareText}>
                      Share
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={openIndex !== null}
        transparent={false}
        animationType="fade"
        onRequestClose={close}
        statusBarTranslucent
      >
        <View style={styles.viewer}>
          <View style={styles.viewerTop}>
            <View style={styles.viewerTitleBox}>
              <Text style={styles.viewerTitle} numberOfLines={1}>
                {current?.label}
              </Text>

              <Text style={styles.viewerCount}>
                {page + 1} / {images.length}
              </Text>
            </View>

            <View style={styles.viewerActions}>
              {current ? (
                <Pressable
                  onPress={() => shareImage(current)}
                  disabled={sharingKey === current.key}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Share ${current.label}`}
                  style={styles.viewerShare}
                >
                  {sharingKey === current.key ? (
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                    />
                  ) : (
                    <Ionicons
                      name="share-outline"
                      size={23}
                      color="#fff"
                    />
                  )}
                </Pressable>
              ) : null}

              <Pressable
                onPress={close}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Close preview"
                style={styles.close}
              >
                <Ionicons
                  name="close"
                  size={26}
                  color="#fff"
                />
              </Pressable>
            </View>
          </View>

          <FlatList
            data={images}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={openIndex ?? 0}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              setPage(
                Math.round(
                  event.nativeEvent.contentOffset.x / width,
                ),
              );
            }}
            renderItem={({ item }) => (
              <Pressable
                onPress={close}
                style={[
                  styles.slide,
                  {
                    width,
                    height: height - 120,
                  },
                ]}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.slideImage}
                  contentFit="contain"
                  transition={150}
                />
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  count: {
    marginBottom: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#777",
  },

  thumbs: {
    gap: 12,
  },

  imageCard: {
    width: 110,
  },

  thumb: {
    width: 110,
  },

  pressed: {
    opacity: 0.7,
  },

  thumbImage: {
    width: 110,
    height: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#f2f2f2",
  },

  thumbLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  shareButton: {
    marginTop: 7,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  shareButtonDisabled: {
    opacity: 0.6,
  },

  shareText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
  },

  empty: {
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 14,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },

  viewer: {
    flex: 1,
    backgroundColor: "#000",
  },

  viewerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
    height: 120,
  },

  viewerTitleBox: {
    flex: 1,
    paddingRight: 12,
  },

  viewerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  viewerCount: {
    marginTop: 2,
    color: "#aaa",
    fontSize: 12,
  },

  viewerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  viewerShare: {
    padding: 4,
  },

  close: {
    padding: 4,
  },

  slide: {
    alignItems: "center",
    justifyContent: "center",
  },

  slideImage: {
    width: "100%",
    height: "100%",
  },
});