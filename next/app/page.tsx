"use client";
import React, { useState, useRef, useEffect } from "react";
import CameraControls from "./components/CameraControls";
import CameraSettings from "./components/CameraSettings";
import LogsPanel from "./components/LogsPanel";
import PreviewPanel from "./components/PreviewPanel";
import ZoomPanel from "./components/ZoomPanel";

export default function Home() {
  // State
  const [logs, setLogs] = useState<string[]>([
    "Astro Camera by @thiagonespereira",
    "https://github.com/thiagonespereira/astro-camera",
    "",
  ]);
  const [camera, setCamera] = useState<any>(null);
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [imgFormatValue, setImgFormatValue] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [isoChoices, setIsoChoices] = useState<string[]>([]);
  const [apertureChoices, setApertureChoices] = useState<string[]>([]);
  const [shutterSpeedChoices, setShutterSpeedChoices] = useState<string[]>([]);
  const [imgFormatChoices, setImgFormatChoices] = useState<string[]>([]);
  const [isoValue, setIsoValue] = useState("");
  const [apertureValue, setApertureValue] = useState("");
  const [shutterSpeedValue, setShutterSpeedValue] = useState("");
  const [actionsVisible, setActionsVisible] = useState(false);
  const [statusColor, setStatusColor] = useState("gray");
  const [buttonsDisabled, setButtonsDisabled] = useState<Record<string, boolean>>({
    previewBtn: true,
    takeShotsBtn: true,
    testShotBtn: true,
  });
  const [previewImg, setPreviewImg] = useState("");
  const [zoomImg, setZoomImg] = useState("");
  const [previewPanelVisible, setPreviewPanelVisible] = useState(false);
  const [logsPanelVisible, setLogsPanelVisible] = useState(true);
  const [zoomContainerVisible, setZoomContainerVisible] = useState(false);
  const [numShots, setNumShots] = useState(30);
  const [choice, setChoice] = useState(0);
  const valuesArray = ["1", "2", "4", "5", "17"];
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const CameraRef = useRef<any>(null);

  // Append log
  const appendLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  // Dynamic import of Camera class
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).Camera) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "/scripts/camera.js";
      script.onload = () => {
        CameraRef.current = (window as any).Camera;
      };
      document.body.appendChild(script);
    } else if (typeof window !== "undefined") {
      CameraRef.current = (window as any).Camera;
    }
  }, []);

  // Helper
  function getFileTypeByManufacturer() {
    if (manufacturer === "FUJIFILM") {
      return "raf";
    } else if (manufacturer === "Canon") {
      return "cr2";
    } else {
      return "jpg";
    }
  }

  // Button state helpers
  const disableButtons = (btns: string[]) => {
    setButtonsDisabled((prev) => ({ ...prev, ...Object.fromEntries(btns.map((b) => [b, true])) }));
  };
  const enableButtons = (btns: string[]) => {
    setButtonsDisabled((prev) => ({ ...prev, ...Object.fromEntries(btns.map((b) => [b, false])) }));
  };

  // Camera connect
  const connectCamera = async () => {
    try {
      appendLog(`[${new Date().toLocaleTimeString()}] Starting application...`);
      if (!CameraRef.current) return;
      await CameraRef.current.showPicker();
      const cam = new CameraRef.current();
      await cam.connect();
      setCamera(cam);
      const config = await cam.getConfig();
      const mfr = config.children.status.children.manufacturer.value;
      const mdl = config.children.status.children.cameramodel.value;
      setManufacturer(mfr);
      setModel(mdl);
      appendLog(`[${new Date().toLocaleTimeString()}] Camera model: ${mfr} ${mdl}`);
      // Image format
      const imgChoices = config.children.imgsettings.children.imageformat.choices.map(String);
      setImgFormatChoices(imgChoices);
      setImgFormatValue(String(config.children.imgsettings.children.imageformat.value));
      // ISO
      const isoChoices = config.children.imgsettings.children.iso.choices.map(String);
      setIsoChoices(isoChoices);
      setIsoValue(String(config.children.imgsettings.children.iso.value));
      // Aperture
      const apertureChoices = config.children.capturesettings.children["f-number"].choices.map(String);
      setApertureChoices(apertureChoices);
      setApertureValue(String(config.children.capturesettings.children["f-number"].value));
      // Shutter speed
      const ssChoices = config.children.capturesettings.children.shutterspeed.choices.map(String);
      setShutterSpeedChoices(ssChoices);
      setShutterSpeedValue(String(config.children.capturesettings.children.shutterspeed.value));
      enableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
      setActionsVisible(true);
      setStatusColor("green");
    } catch (e) {
      console.error(e);
      setStatusColor("red");
      alert("Failed to connect to camera.");
    }
  };

  // Preview logic
  const togglePreview = async () => {
    setPreviewEnabled((prev) => !prev);
  };
  useEffect(() => {
    if (!camera) return;
    if (previewEnabled) {
      appendLog(`[${new Date().toLocaleTimeString()}] Starting preview...`);
      setPreviewPanelVisible(true);
      setLogsPanelVisible(false);
      intervalRef.current = setInterval(async () => {
        if (previewEnabled && camera) {
          const blob = await camera.capturePreviewAsBlob();
          const url = URL.createObjectURL(blob);
          setPreviewImg(url);
          setZoomImg(url);
        }
      }, 250);
    } else {
      appendLog(`[${new Date().toLocaleTimeString()}] Stopping preview...`);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPreviewImg("");
      setZoomImg("");
      setPreviewPanelVisible(false);
      setLogsPanelVisible(true);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line
  }, [previewEnabled, camera]);

  // Take test shot
  const takeTestShot = async () => {
    if (previewEnabled) setPreviewEnabled(false);
    disableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
    appendLog(`[${new Date().toLocaleTimeString()}] Taking test shot...`);
    if (!camera) return;
    const file = await camera.captureImageAsFile();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = `${file.name}${imgFormatValue === "RAW" ? getFileTypeByManufacturer() : ""}`;
    a.click();
    appendLog(`[${new Date().toLocaleTimeString()}] Downloaded test shot.`);
    enableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
  };

  // Take shots (port from main.js)
  const takeShots = async () => {
    if (previewEnabled) setPreviewEnabled(false);
    setStatusColor("gold");
    disableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
    appendLog(`[${new Date().toLocaleTimeString()}] Taking ${numShots} shots...`);
    for (let i = 0; i < numShots; i++) {
      appendLog(`[${new Date().toLocaleTimeString()}] Taking shot ${i + 1}...`);
      if (!camera) break;
      await camera.captureImageAsFile();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    enableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
    setStatusColor("green");
    appendLog(`[${new Date().toLocaleTimeString()}] Capture finished.`);
  };

  // Preview zoom
  const previewZoom = async () => {
    if (!camera) return;
    const newChoice = choice === 4 ? 0 : choice + 1;
    setChoice(newChoice);
    await camera.setConfigValue("d01b", valuesArray[newChoice]);
  };

  // Select handlers
  const handleImgFormatChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setImgFormatValue(value);
    appendLog(`[${new Date().toLocaleTimeString()}] Setting image format to ${value}...`);
    if (!camera) return;
    await camera.setConfigValue("imageformat", value);
  };
  const handleIsoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsoValue(value);
    appendLog(`[${new Date().toLocaleTimeString()}] Setting ISO to ${value}...`);
    if (!camera) return;
    await camera.setConfigValue("iso", value);
  };
  const handleApertureChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setApertureValue(value);
    appendLog(`[${new Date().toLocaleTimeString()}] Setting aperture to ${value}...`);
    if (!camera) return;
    await camera.setConfigValue("f-number", value);
  };
  const handleShutterSpeedChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setShutterSpeedValue(value);
    appendLog(`[${new Date().toLocaleTimeString()}] Setting shutter speed to ${value}...`);
    if (!camera) return;
    await camera.setConfigValue("shutterspeed", value);
  };

  // UI handlers
  const handleCenterZoom = () => setZoomContainerVisible(true);
  const handleCloseZoom = () => setZoomContainerVisible(false);

  // Render
  return (
    <div className="container">
      <div className="left-panel">
        <CameraControls
          onConnect={connectCamera}
          onTogglePreview={togglePreview}
          onTakeShots={takeShots}
          onTestShot={takeTestShot}
          cameraName={camera ? `Connected: ${manufacturer} ${model}` : "Not connected"}
          statusColor={statusColor}
          buttonsDisabled={buttonsDisabled}
        />
        <CameraSettings
          imgFormatValue={imgFormatValue}
          imgFormatChoices={imgFormatChoices}
          onImgFormatChange={handleImgFormatChange}
          isoValue={isoValue}
          isoChoices={isoChoices}
          onIsoChange={handleIsoChange}
          apertureValue={apertureValue}
          apertureChoices={apertureChoices}
          onApertureChange={handleApertureChange}
          shutterSpeedValue={shutterSpeedValue}
          shutterSpeedChoices={shutterSpeedChoices}
          onShutterSpeedChange={handleShutterSpeedChange}
          numShots={numShots}
          onNumShotsChange={e => setNumShots(Number(e.target.value))}
          actionsVisible={actionsVisible}
        />
      </div>
      {logsPanelVisible && <LogsPanel logs={logs} />}
      <PreviewPanel
        previewImg={previewImg}
        onCenterZoom={handleCenterZoom}
        onZoom={previewZoom}
        visible={previewPanelVisible}
      />
      <ZoomPanel
        zoomImg={zoomImg}
        onClose={handleCloseZoom}
        visible={zoomContainerVisible}
      />
    </div>
  );
}

// Import global CSS in the custom layout or _app file, not here.
