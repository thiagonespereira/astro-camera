import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import CameraControls from './components/CameraControls';
import CameraSettings from './components/CameraSettings';
import LogsPanel from './components/LogsPanel';
import PreviewPanel from './components/PreviewPanel';
import ZoomPanel from './components/ZoomPanel';

export default function App() {
  // Placeholder state
  const [logs, setLogs] = useState<string[]>(["Astro Camera by @thiagonespereira", "https://github.com/thiagonespereira/astro-camera", ""]);
  const [cameraName, setCameraName] = useState<string>('Not connected');
  const [statusColor, setStatusColor] = useState<string>('#3b82f6');
  const [imgFormatValue, setImgFormatValue] = useState<string>('JPG');
  const [imgFormatChoices] = useState<string[]>(['JPG', 'RAW']);
  const [isoValue, setIsoValue] = useState<string>('100');
  const [isoChoices] = useState<string[]>(['100', '200', '400', '800']);
  const [apertureValue, setApertureValue] = useState<string>('2.8');
  const [apertureChoices] = useState<string[]>(['2.8', '4', '5.6', '8']);
  const [shutterSpeedValue, setShutterSpeedValue] = useState<string>('1/60');
  const [shutterSpeedChoices] = useState<string[]>(['1/60', '1/125', '1/250']);
  const [numShots, setNumShots] = useState<number>(1);
  const [previewImg, setPreviewImg] = useState<string>('');
  const [zoomImg, setZoomImg] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showZoom, setShowZoom] = useState<boolean>(false);

  // Placeholder handlers
  const handleConnect = () => setCameraName('Connected: Demo Camera');
  const handleTogglePreview = () => setShowPreview((v) => !v);
  const handleTakeShots = () => setLogs((prev) => [...prev, 'Taking shots...']);
  const handleTestShot = () => setLogs((prev) => [...prev, 'Test shot taken.']);
  const handleCenterZoom = () => setShowZoom(true);
  const handleCloseZoom = () => setShowZoom(false);
  const handleZoom = () => setLogs((prev) => [...prev, 'Zoomed.']);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#121212' }} contentContainerStyle={{ padding: 16 }}>
      <CameraControls
        onConnect={handleConnect}
        onTogglePreview={handleTogglePreview}
        onTakeShots={handleTakeShots}
        onTestShot={handleTestShot}
        cameraName={cameraName}
        statusColor={statusColor}
      />
      <CameraSettings
        imgFormatValue={imgFormatValue}
        imgFormatChoices={imgFormatChoices}
        onImgFormatChange={setImgFormatValue}
        isoValue={isoValue}
        isoChoices={isoChoices}
        onIsoChange={setIsoValue}
        apertureValue={apertureValue}
        apertureChoices={apertureChoices}
        onApertureChange={setApertureValue}
        shutterSpeedValue={shutterSpeedValue}
        shutterSpeedChoices={shutterSpeedChoices}
        onShutterSpeedChange={setShutterSpeedValue}
        numShots={numShots}
        onNumShotsChange={text => setNumShots(Number(text) || 1)}
      />
      <LogsPanel logs={logs} />
      <PreviewPanel
        previewImg={previewImg}
        onCenterZoom={handleCenterZoom}
        onZoom={handleZoom}
        visible={showPreview}
      />
      <ZoomPanel
        zoomImg={zoomImg || previewImg}
        onClose={handleCloseZoom}
        visible={showZoom}
      />
    </ScrollView>
  );
}
