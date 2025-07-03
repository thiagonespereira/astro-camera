import React from "react";

type PreviewPanelProps = {
  previewImg: string;
  onCenterZoom: () => void;
  onZoom: () => void;
  visible: boolean;
};

const PreviewPanel: React.FC<PreviewPanelProps> = ({ previewImg, onCenterZoom, onZoom, visible }) => {
  if (!visible) return null;
  return (
    <div id="preview-panel" className="panel preview" style={{ maxHeight: "100%", height: "100%", overflow: "auto", display: "flex", flexDirection: "column" }}>
      <div className="title">Preview</div>
      <div className="img-container" style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {previewImg && <img id="previewImg" src={previewImg} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />}
        <div className="img-overlay"></div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button id="centerZoomBtn" onClick={onCenterZoom}>Center Zoom</button>
        <button id="testZoomBtw" onClick={onZoom}>Zoom</button>
      </div>
    </div>
  );
};

export default PreviewPanel; 