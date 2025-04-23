import { Camera } from "https://unpkg.com/web-gphoto2@0.4.1/build/camera.js";

let camera;
let previewEnabled = false;

document.getElementById("connectBtn").onclick = async () => {
  try {
    await Camera.showPicker();
    camera = new Camera();
    await camera.connect();

    // const supportedOps = await camera.getSupportedOps();
    // console.log("Connected:", supportedOps);

    const config = await camera.getConfig();
    console.log("Current configuration tree:", JSON.stringify(config, null, 2));

    // document.getElementById("iso").innerText =
    //   config.children.imgsettings.children.iso.value;

    const manufacturer = config.children.status.children.manufacturer.value;
    const model = config.children.status.children.cameramodel.value;

    document.getElementById(
      "cameraName"
    ).innerText = `${manufacturer} ${model}`;

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

    // document.getElementById("shutterSpeed").innerText =
    //   config.children.capturesettings.children.shutterspeed.value;

    document.getElementById("previewBtn").disabled = false;
    document.getElementById("takeShotsBtn").disabled = false;
    document.getElementById("actions").style.display = "block";
  } catch (e) {
    console.error(e);
    alert("Failed to connect to camera.");
  }
};

function togglePreview() {
  if (!previewEnabled) {
    previewEnabled = true;
    setInterval(async () => {
      if (previewEnabled) {
        const blob = await camera.capturePreviewAsBlob();
        document.getElementById("previewImg").src = URL.createObjectURL(blob);
      }
    }, 500); // Capture preview every second
  } else {
    previewEnabled = false;
    clearInterval(); // Stop capturing preview
    document.getElementById("previewImg").src = "";
  }
}

document.getElementById("previewBtn").onclick = async () => {
  togglePreview();
};

document.getElementById("takeShotsBtn").onclick = async () => {
  if (previewEnabled) {
    togglePreview();
  }
  document.getElementById("previewBtn").disabled = true;
  document.getElementById("takeShotsBtn").disabled = true;
  const numOfShots = parseInt(document.getElementById("numShots").value, 10);
  for (let i = 0; i < numOfShots; i++) {
    document.getElementById("numShots").innerText = `Taking shot ${
      i + 1
    } of ${numOfShots}`;
    await camera.captureImageAsFile();
    // wait 2 seconds before next shot
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  document.getElementById("numShots").innerText = "Capture finished.";
  document.getElementById("previewBtn").disabled = false;
  document.getElementById("takeShotsBtn").disabled = false;
};

document.getElementById("imgFormat").onchange = async (e) => {
  const imgFormatValue = e.target.value;
  await camera.setConfigValue("imageformat", imgFormatValue);
  console.log("Image Format set to:", imgFormatValue);
};

document.getElementById("iso").onchange = async (e) => {
  const isoValue = e.target.value;
  await camera.setConfigValue("iso", isoValue);
  console.log("ISO set to:", isoValue);
};

document.getElementById("aperture").onchange = async (e) => {
  const apertureValue = e.target.value;
  await camera.setConfigValue("f-number", apertureValue);
  console.log("Aperture set to:", apertureValue);
};

document.getElementById("shutterSpeed").onchange = async (e) => {
  const ssValue = e.target.value;
  await camera.setConfigValue("shutterspeed", ssValue);
  console.log("Shutter speed set to:", ssValue);
};
