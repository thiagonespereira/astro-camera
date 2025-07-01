// import { Camera } from "https://unpkg.com/web-gphoto2@0.4.1/build/camera.js";
import { Camera } from "./scripts/camera.js";

let camera;
let previewEnabled = false;
let imgFormatValue = "";
let manufacturer = "";

function appendLog(message) {
  const logContainer = document.getElementById("logs-panel");
  const p = document.createElement("p");
  p.innerText = message;
  logContainer.appendChild(p);
  logContainer.scrollTop = logContainer.scrollHeight; // Scroll to the bottom
}

function getFileTypeByManufacturer() {
  if (manufacturer === "FUJIFILM") {
    return "raf";
  } else if (manufacturer === "Canon") {
    return "cr2";
  } else {
    return "jpg";
  }
}

async function takeTestShot() {
  if (previewEnabled) {
    togglePreview();
  }
  disableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
  appendLog(`[${new Date().toLocaleTimeString()}] Taking test shot...`);
  const file = await camera.captureImageAsFile();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = `${file.name}${
    imgFormatValue === "RAW" && getFileTypeByManufacturer()
  }`;
  a.click();
  appendLog(`[${new Date().toLocaleTimeString()}] Downloaded test shot.`);
  enableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
}

let choice = 0;
let valuesArray = ["1", "2", "4", "5", "17"];
async function previewZoom() {
  choice = choice === 4 ? 0 : choice + 1;
  let choiceValue = valuesArray[choice];
  await camera.setConfigValue("d01b", choiceValue);
}

async function connectCamera() {
  try {
    appendLog(`[${new Date().toLocaleTimeString()}] Starting application...`);
    await Camera.showPicker();
    camera = new Camera();
    await camera.connect();

    /**
     * CAMERA CONFIG
     */
    const config = await camera.getConfig();
    // console.log("Current configuration tree:", JSON.stringify(config, null, 2));

    appendLog(
      `[${new Date().toLocaleTimeString()}] Camera connected. Retrieving configuration...`
    );

    /**
     * CAMERA MODEL
     */
    manufacturer = config.children.status.children.manufacturer.value;
    const model = config.children.status.children.cameramodel.value;
    document.getElementById(
      "cameraName"
    ).innerText = `Connected: ${manufacturer} ${model}`;

    appendLog(
      `[${new Date().toLocaleTimeString()}] Camera model: ${manufacturer} ${model}`
    );
    /**
     * IMAGE FORMAT
     */
    const imageFormatChoicesTags = [];
    for (const imgFormat of config.children.imgsettings.children.imageformat
      .choices) {
      imageFormatChoicesTags.push(
        `<option value="${imgFormat}" ${
          imgFormat === config.children.imgsettings.children.imageformat.value
            ? "selected"
            : ""
        }>${imgFormat}</option>`
      );
    }
    imgFormatValue = config.children.imgsettings.children.imageformat.value;
    document.getElementById("imgFormat").innerHTML =
      imageFormatChoicesTags.join("");

    /**
     * ISO
     */
    const isoChoicesTags = [];
    for (const iso of config.children.imgsettings.children.iso.choices) {
      isoChoicesTags.push(
        `<option value="${iso}" ${
          iso === config.children.imgsettings.children.iso.value
            ? "selected"
            : ""
        }>${iso}</option>`
      );
    }
    document.getElementById("iso").innerHTML = isoChoicesTags.join("");

    /**
     * APERTURE
     */
    const apertureChoicesTags = [];
    for (const aperture of config.children.capturesettings.children["f-number"]
      .choices) {
      apertureChoicesTags.push(
        `<option value="${aperture}" ${
          aperture ===
          config.children.capturesettings.children["f-number"].value
            ? "selected"
            : ""
        }>${aperture}</option>`
      );
    }
    document.getElementById("aperture").innerHTML =
      apertureChoicesTags.join("");

    /**
     * SHUTTER SPEED
     */
    const ssChoicesTags = [];
    for (const ss of config.children.capturesettings.children.shutterspeed
      .choices) {
      ssChoicesTags.push(
        `<option value="${ss}" ${
          ss === config.children.capturesettings.children.shutterspeed.value
            ? "selected"
            : ""
        }>${ss}</option>`
      );
    }
    document.getElementById("shutterSpeed").innerHTML = ssChoicesTags.join("");

    enableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
    document.getElementById("actions").style.display = "block";
    document.getElementById("status").style.background = "green";
  } catch (e) {
    console.error(e);
    document.getElementById("status").style.background = "red";
    alert("Failed to connect to camera.");
  }
}

function disableButtons(buttonNames) {
  for (const btnName of buttonNames) {
    document.getElementById(btnName).disabled = true;
    document.getElementById(btnName).style.opacity = 0.5;
    document.getElementById(btnName).style.cursor = "not-allowed";
  }
}
function enableButtons(buttonNames) {
  for (const btnName of buttonNames) {
    document.getElementById(btnName).disabled = false;
    document.getElementById(btnName).style.opacity = 1;
    document.getElementById(btnName).style.cursor = "pointer";
  }
}

let intervalId;
function togglePreview() {
  previewEnabled = !previewEnabled;
  if (previewEnabled) {
    appendLog(`[${new Date().toLocaleTimeString()}] Starting preview...`);
    // previewEnabled = true;
    intervalId = setInterval(async () => {
      if (previewEnabled) {
        const blob = await camera.capturePreviewAsBlob();
        document.getElementById("previewImg").src = URL.createObjectURL(blob);
        document.getElementById("zoomImg").src = URL.createObjectURL(blob);
        document.getElementById("preview-panel").style.display = "block";
        document.getElementById("logs-panel").style.display = "none";
      }
    }, 250); // Capture preview every half a second
  } else {
    appendLog(`[${new Date().toLocaleTimeString()}] Stopping preview...`);
    // previewEnabled = false;
    clearInterval(intervalId); // Stop capturing preview
    document.getElementById("previewImg").src = "";
    document.getElementById("zoomImg").src = "";
    document.getElementById("preview-panel").style.display = "none";
    document.getElementById("logs-panel").style.display = "block";
  }
}

async function takeShots() {
  if (previewEnabled) {
    togglePreview();
  }
  document.getElementById("status").style.background = "gold";

  disableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
  const numShots = document.getElementById("numShots").value;
  appendLog(`[${new Date().toLocaleTimeString()}] Taking ${numShots} shots...`);

  // let nameNumber = document.getElementById("nameNumber").value || 1;

  for (let i = 0; i < numShots; i++) {
    /**
     * Capture image
     */
    appendLog(`[${new Date().toLocaleTimeString()}] Taking shot ${i + 1}...`);
    await camera.captureImageAsFile();

    // Wait 1 second before next shot
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  enableButtons(["previewBtn", "takeShotsBtn", "testShotBtn"]);
  document.getElementById("status").style.background = "green";
  appendLog(`[${new Date().toLocaleTimeString()}] Capture finished.`);
}

document.getElementById("takeShotsBtn").onclick = async () => {
  await takeShots();
};

document.getElementById("testShotBtn").onclick = async () => {
  await takeTestShot();
};

document.getElementById("previewBtn").onclick = async () => {
  togglePreview();
};

document.getElementById("connectBtn").onclick = async () => {
  await connectCamera();
};

document.getElementById("imgFormat").onchange = async (e) => {
  const imgFormatValue = e.target.value;
  appendLog(
    `[${new Date().toLocaleTimeString()}] Setting image format to ${imgFormatValue}...`
  );
  await camera.setConfigValue("imageformat", imgFormatValue);
};

document.getElementById("iso").onchange = async (e) => {
  const isoValue = e.target.value;
  appendLog(
    `[${new Date().toLocaleTimeString()}] Setting ISO to ${isoValue}...`
  );
  await camera.setConfigValue("iso", isoValue);
};

document.getElementById("aperture").onchange = async (e) => {
  const apertureValue = e.target.value;
  appendLog(
    `[${new Date().toLocaleTimeString()}] Setting aperture to ${apertureValue}...`
  );
  await camera.setConfigValue("f-number", apertureValue);
};

document.getElementById("shutterSpeed").onchange = async (e) => {
  const ssValue = e.target.value;
  appendLog(
    `[${new Date().toLocaleTimeString()}] Setting shutter speed to ${ssValue}...`
  );
  await camera.setConfigValue("shutterspeed", ssValue);
};

document.getElementById("centerZoomBtn").onclick = async () => {
  document.getElementById("zoom-container").style.display = "block";
};

document.getElementById("closeZoomBtn").onclick = async () => {
  document.getElementById("zoom-container").style.display = "none";
};

document.getElementById("testZoomBtw").onclick = async () => {
  await previewZoom();
};

/** DISABLED FUNCTIONS TO CONVERT TO FITS ON CAPTURE TIME */

// import LibRaw from "libraw-wasm";
// import * as UTIF from "utif";

// Goes inside take shot function

// Disable FITS conversion for now
// Not worth it to do on Fuji cameras on capture time
// const convertToFits = document.getElementById("fits").checked;
// if (convertToFits) {
//   /**
//    * Read RAW file
//    */
//   appendLog(
//     `[${new Date().toLocaleTimeString()}] Reading file ${
//       i + 1
//     } (takes a minute)...`
//   );
//   const arrayBuffer = await file.arrayBuffer();
//   const uint8Array = new Uint8Array(arrayBuffer);
//   const raw = new LibRaw();
//   await raw.open(uint8Array, {});
//   const imageData = await raw.imageData(); // This is slow

//   /**
//    * Convert RAW to TIFF
//    */
//   appendLog(
//     `[${new Date().toLocaleTimeString()}] Converting file (Step 1)...`
//   );
//   const tiffData = await convertImageDataToTIFF(
//     imageData.data,
//     imageData.width,
//     imageData.height
//   );

//   /**
//    * Convert TIFF to FITS
//    */
//   appendLog(
//     `[${new Date().toLocaleTimeString()}] Converting file (Step 2)...`
//   );
//   const fitsData = buildFitsFromRGBA(
//     tiffData,
//     imageData.width,
//     imageData.height
//   );

//   /**
//    * Download FITS file
//    */
//   appendLog(`[${new Date().toLocaleTimeString()}] Downloading file...`);
//   const blobFromFitsData = new Blob([fitsData], {
//     type: "application/octet-stream",
//   });
//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(blobFromFitsData);
//   a.download = `image-${stringifyNameNumber(nameNumber)}.fits`;
//   a.click();
//   nameNumber++;
// } else {
//   // wait 1 second before next shot
//   await new Promise((resolve) => setTimeout(resolve, 1000));
// }

// function stringifyNameNumber(nameNumber) {
//   if (nameNumber < 10) {
//     return `00${nameNumber}`;
//   } else if (nameNumber < 100) {
//     return `0${nameNumber}`;
//   } else {
//     return `${nameNumber}`;
//   }
// }

// function createStrictFitsHeader(width, height, bitpix = 8, naxis = 3) {
//   const lines = [];

//   const pad = (str) => str.padEnd(80, " ");

//   const keyword = (key, value, comment = "") => {
//     let valStr;

//     if (typeof value === "string") {
//       valStr = `'${value}'`.padEnd(20, " ");
//     } else if (typeof value === "boolean") {
//       valStr = value ? "T" : "F";
//       valStr = valStr.padStart(20, " ");
//     } else {
//       valStr = value.toString().padStart(20, " ");
//     }

//     const commentStr = comment ? ` / ${comment}` : "";
//     return pad(`${key.padEnd(8)}= ${valStr}${commentStr}`);
//   };

//   lines.push(keyword("SIMPLE", true, "Standard FITS format"));
//   lines.push(keyword("BITPIX", bitpix, "Bits per pixel")); // 8 or 16 usually
//   lines.push(keyword("NAXIS", naxis, "Number of data axes"));
//   lines.push(keyword("NAXIS1", width, "Width"));
//   lines.push(keyword("NAXIS2", height, "Height"));
//   if (naxis >= 3) lines.push(keyword("NAXIS3", 3, "RGB channels"));
//   lines.push(keyword("BZERO", 0));
//   lines.push(keyword("BSCALE", 1));
//   lines.push(pad("END")); // END line must be padded to 80 chars

//   // Convert to one long string
//   let headerStr = lines.join("");

//   // Pad header to a multiple of 2880 bytes
//   const padBytes = 2880 - (headerStr.length % 2880);
//   headerStr += " ".repeat(padBytes);

//   return new Uint8Array([...headerStr].map((c) => c.charCodeAt(0)));
// }

// function buildFitsFromRGBA(rgba, width, height) {
//   const header = createStrictFitsHeader(width, height, 8, 3);

//   const r = new Uint8Array(width * height);
//   const g = new Uint8Array(width * height);
//   const b = new Uint8Array(width * height);

//   // Flip vertically while extracting RGB channels
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const flippedY = height - y - 1;
//       const srcIndex = (flippedY * width + x) * 4;
//       const dstIndex = y * width + x;

//       r[dstIndex] = rgba[srcIndex];
//       g[dstIndex] = rgba[srcIndex + 1];
//       b[dstIndex] = rgba[srcIndex + 2];
//     }
//   }

//   // FITS stores data as [R plane][G plane][B plane]
//   const imageData = new Uint8Array(r.length + g.length + b.length);
//   imageData.set(r, 0);
//   imageData.set(g, r.length);
//   imageData.set(b, r.length + g.length);

//   // Concatenate header + image
//   const totalLength = header.length + imageData.length;
//   const fits = new Uint8Array(totalLength);
//   fits.set(header, 0);
//   fits.set(imageData, header.length);

//   return fits;
// }

// function rgbToRGBA(rgb, width, height) {
//   const rgba = new Uint8Array(width * height * 4);
//   for (let i = 0, j = 0; i < rgb.length; i += 3, j += 4) {
//     rgba[j] = rgb[i]; // R
//     rgba[j + 1] = rgb[i + 1]; // G
//     rgba[j + 2] = rgb[i + 2]; // B
//     rgba[j + 3] = 255; // A
//   }
//   return rgba;
// }

// async function convertImageDataToTIFF(imageData, width, height) {
//   const rgba = rgbToRGBA(imageData, width, height);

//   const tiffData = UTIF.encodeImage(rgba, width, height);

//   const ifds = UTIF.decode(tiffData); // parses header and finds IFDs
//   UTIF.decodeImage(tiffData, ifds[0]); // loads the image data into ifds[0]
//   const rgbaFromTiff = UTIF.toRGBA8(ifds[0]); // gives you a Uint8Array of RGBA pixels
//   return rgbaFromTiff;
// }
