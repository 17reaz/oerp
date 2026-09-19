import { StyleSheet, View } from 'react-native';

type Props = {
  progress: number; // 0 to 1
};

export function UpdateProgressBar({ progress }: Props) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E6F4FE',
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#208AEF',
  },
});