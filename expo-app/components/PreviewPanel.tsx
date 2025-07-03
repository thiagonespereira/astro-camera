import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

type PreviewPanelProps = {
  previewImg: string;
  onCenterZoom: () => void;
  onZoom: () => void;
  visible: boolean;
};

const PreviewPanel: React.FC<PreviewPanelProps> = ({ previewImg, onCenterZoom, onZoom, visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Preview</Text>
      {previewImg ? (
        <Image source={{ uri: previewImg }} style={styles.previewImg} resizeMode="contain" />
      ) : (
        <Text>No preview available</Text>
      )}
      <View style={styles.buttonRow}>
        <Button title="Center Zoom" onPress={onCenterZoom} />
        <Button title="Zoom" onPress={onZoom} />
      </View>
    </View>
  );
};

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
  previewImg: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#222',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

export default PreviewPanel; 