import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type CameraControlsProps = {
  onConnect: () => void;
  onTogglePreview: () => void;
  onTakeShots: () => void;
  onTestShot: () => void;
  cameraName: string;
  statusColor: string;
};

const CameraControls: React.FC<CameraControlsProps> = ({
  onConnect,
  onTogglePreview,
  onTakeShots,
  onTestShot,
  cameraName,
  statusColor,
}) => (
  <View style={styles.panel}>
    <Text style={styles.title}>Astro Camera</Text>
    <View style={styles.statusRow}>
      <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
      <Text>{cameraName}</Text>
    </View>
    <View style={styles.buttonStack}>
      <Button title="Connect" onPress={onConnect} />
      <Button title="Preview" onPress={onTogglePreview} />
      <Button title="Take Shots" onPress={onTakeShots} />
      <Button title="Test Shot" onPress={onTestShot} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  buttonStack: {
    gap: 8,
    flexDirection: 'column',
    rowGap: 8,
  },
});

export default CameraControls; 