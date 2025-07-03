import React from "react";

type CameraControlsProps = {
  onConnect: () => void;
  onTogglePreview: () => void;
  onTakeShots: () => void;
  onTestShot: () => void;
  cameraName: string;
  statusColor: string;
  buttonsDisabled: Record<string, boolean>;
};

const CameraControls: React.FC<CameraControlsProps> = ({
  onConnect,
  onTogglePreview,
  onTakeShots,
  onTestShot,
  cameraName,
  statusColor,
  buttonsDisabled,
}) => (
  <div className="panel">
    <div className="title">Astro Camera</div>
    <div className="connection-status">
      <div id="status" className="status-indicator" style={{ background: statusColor }}></div>
      <div id="cameraName">{cameraName}</div>
    </div>
    <button id="connectBtn" onClick={onConnect} style={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}>Connect to Camera</button>
    <button style={{ marginTop: "1rem", marginBottom: "0.5rem", marginRight: "0.5rem" }} id="previewBtn" onClick={onTogglePreview} disabled={buttonsDisabled.previewBtn}>
      Toggle Preview
    </button>
    <button id="takeShotsBtn" onClick={onTakeShots} disabled={buttonsDisabled.takeShotsBtn} style={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}>Take Shots</button>
    <button id="testShotBtn" onClick={onTestShot} disabled={buttonsDisabled.testShotBtn} style={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}>Test Shot</button>
  </div>
);

export default CameraControls; 