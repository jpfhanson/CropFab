"use strict";

/*
 * spa.imagebox.model.js
 * Processes and displays individual images
 *
 * John Paul Hanson
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomem   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/* global spa */


// Begin public class ImageBox
// Purpose processes and draws an image
classes.ImageModel = class {
  // note: the main canvas may be larger than the image, so the co-ordinates
  // used in cropBox are relative to the canvas, not the image
  
  // Begin constructor
  // setMainCanvas, setPreviewCanvas, and updateConfig must
  // must be called after this
  // Arguments
  //   * name             - the file name of the image
  //   * lastModifiedDate - the date from the file the image came from
  //   * originalImage    - an html image
  constructor(name,lastModifiedDate,originalImage,config) {
    this.name = name;
    this.id = 0
    this.lastModifiedDate = lastModifiedDate;
    this.originalImage = originalImage;
    this.config = config;
    this.formatSaveName();
    this.mainCanvas = null;
    this.previewCanvas = null;
    this.toolbox = null;

    this.mouseMode = "none";
    this.xResizeVec = 0;
    this.yResizeVec = 0;
    // these are needed so we can add and remove the listeners
    this.mouseDownListener = (event) => {this.onMouseDown(event)};
    this.mouseMoveListener = (event) => {this.onMouseMove(event)};
  }
  // Begin public method setMainCanvas
  // Purpose   : Set and set up the main canvas
  //             resizeCanvas must be called at some point after this
  //             to finish the process
  // Arguments :
  //    * canvas - The main canvas
  // Returns   : none
  // Actions   :
  //    * Removes any listeners to an old canvas if there is one
  //    * Puts listeners on the canvas to call this's methods
  //    * Holds on to the canvas so other methods can modify it
  setMainCanvas(canvas) {
    if(this.mainCanvas != null) {
      this.mainCanvas.removeEventListener('mouseDown',this.mouseDownListener);
    }
    this.mainCanvas = canvas;
    this.mainCanvas.addEventListener('mouseDown',this.mouseDownListener);
    this.mainCanvas.onmousedown = this.mouseDownListener;
    this.mainCanvas.onmousemove = this.mouseUpListener;
  }
  // Begin public method setPreviewCanvas
  // Purpose   : Set and set up the preview canvas
  // Arguments :
  //    * canvas - the preview canvas
  // Returns   : none
  // Actions   :
  //    * Hold on the the canvas for use in other methods
  setPreviewCanvas(canvas) {
    this.previewCanvas = canvas;
  }

  // Begin public method setToolbox
  // Purpose   : Set and set up the preview toolbox
  // Arguments :
  //    * toolbox - the image toolbox
  // Returns   : none
  // Actions   :
  //    * Hold on the the toolbox for use in other methods
  setToolbox(toolbox) {
    this.toolbox = toolbox;
    this.toolbox.setConfig( this );
  }
  // Begin public method setId
  // Puprose   : set the id
  // Arguemnts : id  - the id
  // Returns   : none
  setId(id) {
    this.id = id;
  }

  // Begin public method resizeExternal
  // Purpose   : Keep the main canvas aspect ratio when it is resized
  // Arguments : none
  // Returns   : none
  // Actions   : Set the height of the canvas to get the right aspect ratio
  resizeExternal() {
    if(this.mainCanvas != null) {
      this.mainCanvas.style.height = Math.ceil(this.mainCanvas.clientWidth*this.mainCanvas.height/this.mainCanvas.width);
    }
  }
  /*
  // Begin public method setConfig
  // Purpose   : Set the config
  // Arguemnts : config
  // Returns   : none
  setConfig(config) {
    this.config = null
    this.updateConfig(config);
    this.formatSaveName();
  }
  // Begin public method updateConfig
  // Purpose   : Update this objects config to match a global one
  // Arguments : config
  // Returns   : none
  updateConfig(config) {
    if(this.config === null) {
      this.config = config.clone();
    } else {
      this.config.update(config);
    }
    this.formatSaveName();
    if(this.mainCanvas != null) {
      this.mainCanvas.width = this.config.mainCanvasWidth;
      this.mainCanvas.height = this.config.mainCanvasHeight;
    }
    if(this.toolbox !== null) {
      this.toolbox.updateConfig(this.config);
    }
    this.resizeExternal();
    this.redraw();
  }*/

  inputUpdateConfig(config) {
    // The order is important
    // each change affects the change after it
    this.config.saveName = config.saveName;
    this.config.setCropPosition(config.cropLeft,config.cropTop);
    this.config.setScale(config.scale);
    this.config.setCropSize(config.cropWidth,config.cropHeight);
    this.toolbox.setConfig(this);
    this.resizeExternal();
    this.redraw();
  }
  setSaveName(name) {
    this.config.saveName = name;
    this.formatSaveName();
    this.toolbox.setConfig(this);
  }
  trySetSaveName(name) {this.setSaveName(name);}

  setMainCanvasSize(w,h) {
    this.config.setMainCanvasSize(w,h);
    this.mainCanvas.width = w;
    this.mainCanvas.height = h;
    this.toolbox.setConfig(this);
    this.resizeExternal();
    this.redraw();
  }

  setCropPosition(x,y) {
    this.config.setCropPosition(x,y);
    this.toolbox.setConfig(this);
    this.redraw();
  }
  trySetCropPosition(x,y) {this.setCropPosition(x,y);}

  setCropSize(w,h) {
    this.config.setCropSize(w,h);
    this.toolbox.setConfig(this);
    this.redraw();
  }
  trySetCropSize(w,h) {this.setCropSize(w,h);}

  setScale(scale) {
    this.config.setScale(scale);
    this.toolbox.setConfig(this);
    this.redraw();
  }
  trySetScale(scale) {this.setScale(scale);}

  // Begin public method redraw
  // Purpose   : Redraw the images in the main canvas and the preview
  // Arguments : none
  // Returns   : none
  // Actions   : Redraws the images in the main canvas and the preview
  redraw() {
    if(this.mainCanvas != null) {
      let ctx = this.mainCanvas.getContext('2d');

      // blank out the canvas
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillRect(0,0,this.mainCanvas.width,this.mainCanvas.height);

      // draw the image
      ctx.drawImage(this.originalImage,this.xOffset,this.yOffset);

      if(this.previewCanvas != null) {
        // draw the preview
        this.previewCanvas.width = this.config.cropWidth;
        this.previewCanvas.height = this.config.cropHeight;
        this.previewCanvas.style.height = this.previewCanvas.clientWidth*
                                  this.config.cropHeight/this.config.cropWidth;
        let preview_ctx = this.previewCanvas.getContext('2d');
        preview_ctx.clearRect(0,0,this.previewCanvas.width,
                                  this.previewCanvas.height);
        preview_ctx.drawImage(this.mainCanvas,
                              -this.config.cropLeft,
                              -this.config.cropTop,
                              this.config.mainCanvasWidth*this.config.scale,
                              this.config.mainCanvasHeight*this.config.scale);
      }

      // draw the croping rectangle
      ctx.lineWidth = 10;
      ctx.strokeRect(this.config.scaledCropLeft,this.config.scaledCropTop,
                    this.config.scaledCropWidth,this.config.scaledCropHeight);
    }
  }
  
  // event handling methods
  // Begin public method onMouseDown
  // Purpose   : Handle the mouse buttons being pressed
  // Arguments : event - the html event
  // Returns   : none
  // Actions   : If the mouse was pressed on the cropping box, get ready to have
  //             it dragged around.
  onMouseDown(event) {
    if(this.mainCanvas != null && event.which == 1) {
      // calculate the mouse posision in the canvases coordinate system
      const x = this.clientToCanvasX(event.offsetX);
      const y = this.clientToCanvasY(event.offsetY);
      // if user clicks an edge, tell shell to start resizing the crop box
      // x and y direction are multiplied by mouse movements to see how much
      // to resize
      if(this.config.onCropLeftEdge(x,y)) {
        this.xResizeVec = -1;
      } else if(this.config.onCropRightEdge(x,y)) {
        this.xResizeVec = 1;
      }
      if(this.config.onCropTopEdge(x,y)) {
        this.yResizeVec = -1;
      } else if(this.config.onCropBottomEdge(x,y)) {
        this.yResizeVec = 1;
      }
      if(this.yResizeVec != 0 || this.xResizeVec != 0) {
        window.addEventListener('mousemove',this.mouseMoveListener)
        this.mouseMode = "resize"
      } else if(this.config.onCropBox(x,y)) {
        window.addEventListener('mousemove',this.mouseMoveListener)
        this.mouseMode = "move";
      }
    }
  }
  // Begin public method onMouseEnd
  // Purpose   : Kill any mouse related processes in progress.
  //             May be called more than once
  // Arguments : event - Ignored, makes this work as a callback
  // Returns   : none
  // Actions   : Stop moving the crop box around with the mouse
  onMouseEnd(event) {
    // the mouse button has been released
    // For some reason, mouseup events don't always get here, so
    // whether the button is still pressed is checked before taking action
    // in other methods. This is called if it is not still pressed.
    window.removeEventListener("mousemove",this.mouseMoveListener);
    this.mouseMode = "none";
    this.xResizeVec = 0;
    this.yResizeVec = 0;
  }
  // Begin public method onMouseMove
  // Purpose   : Handle mouse movements
  // Argumetns : event - the mouse movement event
  // Returns   : none
  // Actions   : If the mouse is being held down after being pressed in the crop
  //             box, move the crop box to follow the mouse.
  onMouseMove(event) {
    if(this.mainCanvas != null) {
      // if the mouse was released at some point and no one told us
      if(this.mouseMode != "none" && event.which == 0) {
        this.onMouseEnd(event);
        return;
      } else if(this.mouseMode == "move") {
        let vx = Math.floor(this.clientToCanvasX(event.movementX));
        let vy = Math.floor(this.clientToCanvasY(event.movementY));
        spa.imagelistmodel.moveCropBox(vx,vy)
      } else if(this.mouseMode == "resize") {
        let vw = Math.floor(this.clientToCanvasX(event.movementX)*this.xResizeVec*2);
        let vh = Math.floor(this.clientToCanvasY(event.movementY)*this.yResizeVec*2);
        spa.imagelistmodel.addToCropSize(vw,vh);
      }
    }
  }
  async saveImage() {
    let result = await this.getFinalImage();
    spa.util.saveFile(result.blob,result.name);
  }
  
  // Begin public method getFinalImage
  // Purpose   : Return the fully modified image
  // Arguments : none
  // Returns   : A blob of the fully modified image
  // Actions   : none
  async getFinalImage() {
    // make a canvas momentarily if one is not there
    let eraseCanvas = false;
    if(this.previewCanvas == null) {
      this.previewCanvas = document.createElement("canvas");
      this.redraw();
      eraseCanvas = true;

    }
    let blob = await new Promise((resolve) => {this.previewCanvas.toBlob(resolve,'image/'+this.imageType)});
    //zip.file(this.name,blob,{base64:true});
    if(eraseCanvas) {
      this.previewCanvas = null;
    }
    return {blob : blob,
            name : this.config.saveName};
  }
  
  // helper methods
  // cause errors if mainCanvas is not defined
  // Change from html coordinates to internal canvas coordinates
  clientToCanvasX(x) {
    return x*this.config.mainCanvasWidth/this.mainCanvas.clientWidth;
  }
  clientToCanvasY(y) {
    return y*this.config.mainCanvasHeight/this.mainCanvas.clientHeight;
  }
  // How far from the topleft of the main canvas the image will be drawn
  get xOffset() {
    return (this.config.mainCanvasWidth-this.originalImage.naturalWidth)/2;
  }
  get yOffset() {
    return(this.config.mainCanvasHeight-this.originalImage.naturalHeight)/2;
  }
  // work out the file type the image should be saved to
  get fileType() {
    let filenameParts = this.name.split('.')
    let imageType;
    if(filenameParts.length > 1) {
      if(filenameParts[-1] == "jpg") {
        return "jpeg";
      } else {
        return filenameParts[-1];
      }
    } else {
      return 'png';
    }
  }
  formatSaveName() {
    let name;
    let original_name_end = this.name.lastIndexOf('.');
    if(original_name_end == -1) {
      name = this.name;
    } else {
      name = this.name.slice(0,original_name_end);
    }
    name = this.config.saveName.replace(/%n/g,name);
    name = name.replace(/%d/g,this.id);
    if(name.search('.') == -1) {
      if(original_name_end == -1) {
        name += '.jpeg';
      } else {
        name += this.name.slice(orogian_name_ned);
      }
    }
    this.config.saveName = name;
  }
}
