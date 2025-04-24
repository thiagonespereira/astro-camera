import { Camera } from "https://unpkg.com/web-gphoto2@0.4.1/build/camera.js";

let camera;
let previewEnabled = false;

function appendLog(message) {
  const logContainer = document.getElementById("logs-panel");
  const p = document.createElement("p");
  p.innerText = message;
  logContainer.appendChild(p);
  logContainer.scrollTop = logContainer.scrollHeight; // Scroll to the bottom
}

document.getElementById("connectBtn").onclick = async () => {
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
    const manufacturer = config.children.status.children.manufacturer.value;
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

    document.getElementById("previewBtn").disabled = false;
    document.getElementById("takeShotsBtn").disabled = false;
    document.getElementById("actions").style.display = "block";
    document.getElementById("status").style.background = "green";
  } catch (e) {
    console.error(e);
    document.getElementById("status").style.background = "red";
    alert("Failed to connect to camera.");
  }
};

function togglePreview() {
  if (!previewEnabled) {
    appendLog(`[${new Date().toLocaleTimeString()}] Starting preview...`);
    previewEnabled = true;
    setInterval(async () => {
      if (previewEnabled) {
        const blob = await camera.capturePreviewAsBlob();
        document.getElementById("previewImg").src = URL.createObjectURL(blob);
        document.getElementById("preview-panel").style.display = "block";
        document.getElementById("logs-panel").style.display = "none";
      }
    }, 500); // Capture preview every half a second
  } else {
    appendLog(`[${new Date().toLocaleTimeString()}] Stopping preview...`);
    previewEnabled = false;
    clearInterval(); // Stop capturing preview
    document.getElementById("previewImg").src = "";
    document.getElementById("preview-panel").style.display = "none";
    document.getElementById("logs-panel").style.display = "block";
  }
}

document.getElementById("previewBtn").onclick = async () => {
  togglePreview();
};

document.getElementById("takeShotsBtn").onclick = async () => {
  if (previewEnabled) {
    togglePreview();
  }
  document.getElementById("status").style.background = "gold";

  document.getElementById("previewBtn").disabled = true;
  document.getElementById("takeShotsBtn").disabled = true;
  const numOfShots = parseInt(document.getElementById("numShots").value, 10);
  appendLog(
    `[${new Date().toLocaleTimeString()}] Taking ${numOfShots} shots...`
  );
  for (let i = 0; i < numOfShots; i++) {
    appendLog(`[${new Date().toLocaleTimeString()}] Taking shot ${i + 1}...`);
    await camera.captureImageAsFile();
    // wait 2 seconds before next shot
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  document.getElementById("numShots").innerText = "Capture finished.";
  document.getElementById("previewBtn").disabled = false;
  document.getElementById("takeShotsBtn").disabled = false;
  document.getElementById("status").style.background = "green";
  appendLog(`[${new Date().toLocaleTimeString()}] Capture finished.`);
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
