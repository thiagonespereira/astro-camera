import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

type LogsPanelProps = {
  logs: string[];
};

const LogsPanel: React.FC<LogsPanelProps> = ({ logs }) => (
  <View style={styles.panel}>
    <Text style={styles.title}>Logs</Text>
    <ScrollView style={{ maxHeight: 200 }}>
      {logs.map((log, i) => (
        <Text key={i} style={styles.logText}>{log}</Text>
      ))}
    </ScrollView>
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
  logText: {
    color: '#ccc',
    fontFamily: 'monospace',
    fontSize: 13,
    marginBottom: 2,
  },
});

export default LogsPanel; 