import React from "react";

type CameraSettingsProps = {
  imgFormatValue: string;
  imgFormatChoices: string[];
  onImgFormatChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isoValue: string;
  isoChoices: string[];
  onIsoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  apertureValue: string;
  apertureChoices: string[];
  onApertureChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  shutterSpeedValue: string;
  shutterSpeedChoices: string[];
  onShutterSpeedChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  numShots: number;
  onNumShotsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  actionsVisible: boolean;
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
  actionsVisible,
}) => (
  <div id="actions" style={{ display: actionsVisible ? "block" : "none" }} className="panel settings">
    <label htmlFor="imgFormat">Image Format</label>
    <select id="imgFormat" value={imgFormatValue} onChange={onImgFormatChange}>
      {imgFormatChoices.map((choice) => (
        <option key={choice} value={choice}>{choice}</option>
      ))}
    </select>
    <label htmlFor="iso">ISO</label>
    <select id="iso" value={isoValue} onChange={onIsoChange}>
      {isoChoices.map((choice) => (
        <option key={choice} value={choice}>{choice}</option>
      ))}
    </select>
    <label htmlFor="aperture">Aperture</label>
    <select id="aperture" value={apertureValue} onChange={onApertureChange}>
      {apertureChoices.map((choice) => (
        <option key={choice} value={choice}>{choice}</option>
      ))}
    </select>
    <label htmlFor="shutterSpeed">Shutter Speed</label>
    <select id="shutterSpeed" value={shutterSpeedValue} onChange={onShutterSpeedChange}>
      {shutterSpeedChoices.map((choice) => (
        <option key={choice} value={choice}>{choice}</option>
      ))}
    </select>
    <label htmlFor="numShots">Number of shots</label>
    <input type="number" id="numShots" value={numShots} onChange={onNumShotsChange} />
  </div>
);

export default CameraSettings; 