"use strict";

class Box {
  constructor(x,y,width,height) {
    this.left = x;
    this.top = y;
    this._width = width;
    this._height = height;
  }
  static fromCenter(centerX,centerY,width,height) {
    return new Box(centerX-width/2,centerY-height/2,width,height);
  }
  drawRectOn(canvasCtx,xOffset=0,yOffset=0) {
    canvasCtx.lineWidth = 10;
    canvasCtx.strokeRect(this.left+xOffset,this.top+yOffset,
                this.width,this.height);
  }
  cropImageTo(canvas,image) {
    canvas.width = this.width;
    canvas.height = this.height;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(image,-this.left,-this.top);
  }
  moveToWithin(left,top,right,bottom) {
    if(this.left < left) {
      this.left = left;
    } else if(this.right > right) {
      this.right = right;
    }
    if(this.top < top) {
      this.top = top;
    } else if(this.bottom > bottom) {
      this.bottom = bottom;
    }
  }
  get right() {
    return this.left+this.width;
  }
  set right(x) {
    this.left = x-this.width;
  }
  get bottom() {
    return this.top+this.height;
  }
  set bottom(y) {
    this.top = y-this.height;
  }
  get width() {return this._width}
  get height() {return this._height}
  // width and height setters are untested
  set width(width) {
    this.x += (this._width-width)/2;
  }
  set height(height) {
    this.y += (this._height-height)/2;
  }
}

class ImageBox {
  constructor(name,lastModified,originalImage,mainCanvasWidth,mainCanvasHeight) {
    // after construction, resizeExternal and resizeCanvas must be called to finish setting up
    this.name = name;
    this.lastModified = lastModified;
    this.originalImage = originalImage;
    this.mainCanvasWidth = mainCanvasWidth;
    this.mainCanvasHeight = mainCanvasHeight;
    this.mainCanvas = null;
    this.previewCanvas = null;

    this.cropBox = Box.fromCenter(this.originalImage.naturalWidth/2,
                    this.originalImage.naturalHeight/2,
                    500,500);

    this.mouseMode = "none";
    //this.initDiv(containerDiv);
  }
  setMainCanvas(canvas) {
    this.mainCanvas = canvas;
    console.log(canvas);
    this.mainCanvas.onmousedown = (event) => {this.onMouseDown(event)};
    this.mainCanvas.onmousemove = (event) => {this.onMouseMove(event)};
    this.resizeCanvas();
  }
  setPreviewCanvas(canvas) {
    this.previewCanvas = canvas;
    this.resizeCanvas();
  }

  // methods for modifying the canvases
  resizeExternal() {
    // when the width of the canvases changes, maintain the aspect ratio
    // also called when the aspect ratio changes
    if(this.mainCanvas != null) {
      this.mainCanvas.style.height = Math.ceil(this.mainCanvas.clientWidth*this.mainCanvas.height/this.mainCanvas.width);
    }
    if(this.previewCanvas != null) {
      this.previewCanvas.style.height = Math.ceil(this.previewCanvas.clienWidth*this.cropBox.height/this.cropBox.width);
    }
  }
  resizeCanvas(width,height) {
    if(width == null) {width = this.mainCanvasWidth;}
    if(height == null) {height = this.mainCanvasHeight;}
    if(this.mainCanvas != null) {
      this.mainCanvas.width = width;
      this.mainCanvas.height = height;
    }
    this.resizeExternal();
    this.redraw();
  }
  changeCropSize(width,height) {
    // this function is untested
    this.cropBox.width = width;
    this.cropBox.height = height;
    resizeExternal();
  }
  changeCropWidth(width) {
    // untested
    this.cropBox.width = width;
    resizeExternal();
  }
  changeCropHeight(width) {
    // untested
    this.cropBox.height = height;
    resizeExternal();
  }

  redraw() {
    if(this.mainCanvas != null) {
      let ctx = this.mainCanvas.getContext('2d');

      // blank out the canvas
      ctx.clearRect(0,0,this.mainCanvas.width,this.mainCanvas.height);

      // draw the image
      ctx.drawImage(this.originalImage,this.xOffset,this.yOffset);

      // draw the croping rectangle
      this.cropBox.drawRectOn(ctx,this.xOffset,this.yOffset);
    }
    if(this.previewCanvas != null) {
      // draw the preview
      this.cropBox.cropImageTo(this.previewCanvas,this.originalImage);
    }
  }
  
  // event handling methods
  onMouseDown(event) {
    if(this.mainCanvas != null) {
      // calculate the mouse posision in the canvases coordinate system
      const x = this.clientToCanvasX(event.offsetX);
      const y = this.clientToCanvasY(event.offsetY);
      // if the mouse is in the crop box
      if(this.cropBox.left+this.xOffset <= x && x <= this.cropBox.right+this.xOffset) {
        if(this.cropBox.top+this.yOffset <= y && y <= this.cropBox.bottom+this.yOffset) {
          // get ready to move the box
          this.mouseMode = "move";
        }
      }
    }
  }
  onMouseEnd(event) {
    // the mouse button has been released
    // For some reason, mouseup events don't always get here, so
    // whether the button is still pressed is checked before taking action
    // in other methods. This is called if it is not still pressed.
    this.mouseMode = "none";
  }
  onMouseMove(event) {
    if(this.mainCanvas != null) {
      // if the mouse was released at some point and no one told us
      if(this.mouseMode != "none" && event.which == 0) {
        this.onMouseEnd(event);
        return;
      }
      if(this.mouseMode == "move") {
        this.cropBox.left += this.clientToCanvasX(event.movementX);
        this.cropBox.top += this.clientToCanvasY(event.movementY);
        this.cropBox.moveToWithin(-this.xOffset,-this.yOffset,
                      this.mainCanvas.width-this.xOffset,
                      this.mainCanvas.height-this.yOffset);
        this.redraw();
      }
    }
  }
  /*
  saveImage() {
    let resultURL = this.preview.toDataURL("image/"+this.imageType).replace("image/"+this.imageType,"image/octet-stream").replace("image/png","image/octet-stream");
    saveFile(resultURL,this.name);
  }
  */
  async addToZip(zip) {
    // make a canvas momentarily if one is not there
    let eraseCanvas = false;
    if(this.previewCanvas == null) {
      this.previewCanvas = document.createElement("canvas");
      this.redraw();
      eraseCanvas = true;

    }
    let blob = await new Promise((resolve) => {this.previewCanvas.toBlob(resolve,'image/'+this.imageType)});
    zip.file(this.name,blob,{base64:true});
    if(eraseCanvas) {
      this.previewCanvas = null;
    }
    return null;
  }
  
  // helper methods
  // raise errors if mainCanvas is not defined
  clientToCanvasX(x) {
    return x*this.mainCanvas.width/this.mainCanvas.clientWidth;
  }
  clientToCanvasY(y) {
    return y*this.mainCanvas.height/this.mainCanvas.clientHeight;
  }
  get xOffset() {
    return (this.mainCanvas.width-this.originalImage.naturalWidth)/2;
  }
  get yOffset() {
    return(this.mainCanvas.height-this.originalImage.naturalHeight)/2;
  }
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
      imageType = 'png';
    }
  }

}
