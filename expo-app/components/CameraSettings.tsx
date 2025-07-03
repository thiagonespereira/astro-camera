import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type CameraSettingsProps = {
  imgFormatValue: string;
  imgFormatChoices: string[];
  onImgFormatChange: (value: string) => void;
  isoValue: string;
  isoChoices: string[];
  onIsoChange: (value: string) => void;
  apertureValue: string;
  apertureChoices: string[];
  onApertureChange: (value: string) => void;
  shutterSpeedValue: string;
  shutterSpeedChoices: string[];
  onShutterSpeedChange: (value: string) => void;
  numShots: number;
  onNumShotsChange: (value: string) => void;
};

const CameraSettings: React.FC<CameraSettingsProps> = ({
  imgFormatValue,
  imgFormatChoices,
  onImgFormatChange,
  isoValue,
  isoChoices,
  onIsoChange,
  apertureValue,
  apertureChoices,
  onApertureChange,
  shutterSpeedValue,
  shutterSpeedChoices,
  onShutterSpeedChange,
  numShots,
  onNumShotsChange,
}) => (
  <View style={styles.panel}>
    <Text style={styles.label}>Image Format</Text>
    <Picker selectedValue={imgFormatValue} onValueChange={onImgFormatChange} style={styles.picker}>
      {imgFormatChoices.map((choice) => (
        <Picker.Item key={choice} label={choice} value={choice} />
      ))}
    </Picker>
    <Text style={styles.label}>ISO</Text>
    <Picker selectedValue={isoValue} onValueChange={onIsoChange} style={styles.picker}>
      {isoChoices.map((choice) => (
        <Picker.Item key={choice} label={choice} value={choice} />
      ))}
    </Picker>
    <Text style={styles.label}>Aperture</Text>
    <Picker selectedValue={apertureValue} onValueChange={onApertureChange} style={styles.picker}>
      {apertureChoices.map((choice) => (
        <Picker.Item key={choice} label={choice} value={choice} />
      ))}
    </Picker>
    <Text style={styles.label}>Shutter Speed</Text>
    <Picker selectedValue={shutterSpeedValue} onValueChange={onShutterSpeedChange} style={styles.picker}>
      {shutterSpeedChoices.map((choice) => (
        <Picker.Item key={choice} label={choice} value={choice} />
      ))}
    </Picker>
    <Text style={styles.label}>Number of shots</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      value={numShots.toString()}
      onChangeText={onNumShotsChange}
    />
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
  label: {
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
});

export default CameraSettings; 