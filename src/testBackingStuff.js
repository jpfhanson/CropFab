"use strict";

// makeMain and makePreview are for testing
function makeCanvases(containerDiv,imageBacking,makeMain=true,makePreview=true) {
  // note: if you deside to give the canvas padding, the geomotry things using clientHeight and clientWidth will have to be changed to take it into acount
  let mainCanvas = document.createElement('canvas');
  mainCanvas.style.width = "100%";
  // height is changed dynamicly in ImagePanel.resizeExternal
  if(makeMain) {
    imageBacking.setMainCanvas(mainCanvas);
  }

  // initiate the preview canvas
  let previewCanvas = document.createElement('canvas');
  previewCanvas.style.width = "100%";
  if(makePreview) {
    imageBacking.setPreviewCanvas(previewCanvas);
  }

  // initiate the div itself
  let div = document.createElement('div');
  div.appendChild(mainCanvas);
  div.appendChild(previewCanvas);
  containerDiv.appendChild(div);
}
