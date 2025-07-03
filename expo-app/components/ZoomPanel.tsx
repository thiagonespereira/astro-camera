import React from 'react';
import { View, Image, Button, StyleSheet } from 'react-native';

type ZoomPanelProps = {
  zoomImg: string;
  onClose: () => void;
  visible: boolean;
};

const ZoomPanel: React.FC<ZoomPanelProps> = ({ zoomImg, onClose, visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.zoomPanel}>
      <Image source={{ uri: zoomImg }} style={styles.zoomImg} resizeMode="contain" />
      <Button title="Close" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  zoomPanel: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  zoomImg: {
    width: 300,
    height: 300,
    borderRadius: 8,
    backgroundColor: '#222',
    marginBottom: 8,
  },
});

export default ZoomPanel; 