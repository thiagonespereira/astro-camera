import React from "react";

type ZoomPanelProps = {
  zoomImg: string;
  onClose: () => void;
  visible: boolean;
};

const ZoomPanel: React.FC<ZoomPanelProps> = ({ zoomImg, onClose, visible }) => {
  if (!visible) return null;
  return (
    <div className="zoom-container" id="zoom-container">
      <div className="zoom-pannel">
        <div className="img-container-zoom">
          <img id="zoomImg" src={zoomImg} alt="Zoom" />
          <div className="img-overlay"></div>
        </div>
        <button id="closeZoomBtn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ZoomPanel; 