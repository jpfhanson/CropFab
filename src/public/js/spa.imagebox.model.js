"use strict";

/*
 * back.imagebox.js
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
  // note: the main canvas may be larger than the image, but the co-ordinates
  // used in cropBox are relative to the image, not the canvas
  
  // Begin constructor
  // Arguments
  //   * name             - the file name of the image
  //   * lastModifiedDate - the date from the file the image came from
  //   * originalImage    - an html image
  //   * mainCanvasWidth  - the internal width of the canvas
  //                        (must be >= the width of the image)
  //   * mainCanvasHeight - the internal height of the canvas
  //                        (must be >= the height of the image)
  constructor(name,lastModifiedDate,originalImage,crop_width,crop_height,
                startCropResizeCallback) {
    // after construction, resizeExternal and resizeCanvas must be called to finish setting up
    this.name = name;
    this.lastModifiedDate = lastModifiedDate;
    this.originalImage = originalImage;
    this.startCropResizeCallback = startCropResizeCallback;
    this.mainCanvasWidth = undefined;
    this.mainCanvasHeight = undefined;
    this.mainCanvas = null;
    this.previewCanvas = null;

    this.cropBox = this.Box.fromCenter(this.originalImage.naturalWidth/2,
                    this.originalImage.naturalHeight/2,
                    crop_width,crop_height);

    this.mouseMode = "none";
    // these are needed so we can add and remove the listeners
    this.mouseDownListener = (event) => {this.onMouseDown(event)};
    this.mouseMoveListener = (event) => {this.onMouseMove(event)};
  }
  // Begin public method setMainCanvas
  // Purpose   : Set and set up the main canvas
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
      this.mainCanvas.removeEventListener('mousemove',this.mouseMoveListener);
    }
    this.mainCanvas = canvas;
    this.mainCanvas.addEventListener('mouseDown',this.mouseDownListener);
    this.mainCanvas.addEventListener('mousemove', this.mouseMoveListener);
    this.mainCanvas.onmousedown = this.mouseDownListener;
    this.mainCanvas.onmousemove = this.mouseUpListener;
    this.resizeExternal();
    this.redraw();
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
    this.redraw();
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
  // Begin public method resizeCanvas
  // Purpose   : Set the width and height of the main canvas
  // Arguemnts :
  //    * width, height - The new width and height of the main canvas
  // Returns   : none
  // Actions   : Set the canvases size internally and externally and redraw
  resizeCanvas(width,height) {
    // this is for setting the size if the main canvas is changed with
    // setMainCanvas
    console.log(width+','+height);
    console.trace();
    this.mainCanvasWidth = width;
    this.mainCanvasHeight = height;
    if(this.mainCanvas != null) {
      this.mainCanvas.width = this.mainCanvasWidth;
      this.mainCanvas.height = this.mainCanvasHeight;
    }
    this.resizeExternal();
    this.redraw();
  }
  // Begin public method changeCropSize
  // Purpose   : Set the crop width and height
  // Arguments : width, height - the width and height
  // Returns   : none
  // Actions   : Set the crop size
  changeCropSize(width,height) {
    // this function is untested
    this.cropBox.width = width;
    this.cropBox.height = height;
  }
  // Begin public method changeCropWidth
  // Purpose   : Set the croping width
  // Arguments : width  - the new width
  // Returns   : none
  // Actions   : set the crop size
  changeCropWidth(width) {
    this.cropBox.setWidth(width);
    this.redraw();
  }
  // Begin public method changeCropHeight
  // Purpose   : Set the croping height
  // Arguments : height  - the new height
  // Returns   : none
  // Actions   : set the crop height
  changeCropHeight(height) {
    this.cropBox.setHeight(height);
    this.redraw();
  }

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

      // draw the croping rectangle
      this.cropBox.drawRectOn(ctx,this.xOffset,this.yOffset);
    }
    if(this.previewCanvas != null) {
      // draw the preview
      this.cropBox.cropImageTo(this.previewCanvas,this.originalImage);
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
      const x = this.clientToCanvasX(event.offsetX)-this.xOffset;
      const y = this.clientToCanvasY(event.offsetY)-this.yOffset;
      // if user clicks an edge, tell shell to start resizing the crop box
      // x and y direction are multiplied by mouse movements to see how much
      // to resize
      let xdirection = 0;
      let ydirection = 0;
      if(this.cropBox.onLeftEdge(x,y)) {
        xdirection = -1;
      } else if(this.cropBox.onRightEdge(x,y)) {
        xdirection = 1;
      }
      if(this.cropBox.onTopEdge(x,y)) {
        ydirection = -1;
      } else if(this.cropBox.onBottomEdge(x,y)) {
        ydirection = 1;
      }
      if(xdirection != 0 || ydirection != 0) {
        this.startCropResizeCallback(xdirection,ydirection);
      } else if(this.cropBox.contains(x,y)) {
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
    this.mouseMode = "none";
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
        let vx = this.clientToCanvasX(event.movementX);
        let vy = this.clientToCanvasY(event.movementY);
        this.cropBox.move(vx,vy);
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
            name : this.name};
  }
  
  // helper methods
  // cause errors if mainCanvas is not defined
  // Change from html coordinates to internal canvas coordinates
  clientToCanvasX(x) {
    return x*this.mainCanvas.width/this.mainCanvas.clientWidth;
  }
  clientToCanvasY(y) {
    return y*this.mainCanvas.height/this.mainCanvas.clientHeight;
  }
  // How far from the topleft of the main canvas the image will be drawn
  get xOffset() {
    return (this.mainCanvas.width-this.originalImage.naturalWidth)/2;
  }
  get yOffset() {
    return(this.mainCanvas.height-this.originalImage.naturalHeight)/2;
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
  // Begin private helper class Box
  // Purpose : Wraps a rectangle used for image cropping
  Box = class {
    // Begin constructor
    // Arguments :
    //   * x, y - the position of the boxes upper left corner
    //   * width, height - the demensions of the box
    constructor(x,y,width,height) {
      this.left = x;
      this.top = y;
      // when width and height are modified, x and y are moved
      this.width = width;
      this.height = height;
      this.edgeClickWidth = 75;
    }
    // Begin static public method fromCenter
    // Purpose   : construct a Box from a given center point
    // Arguments :
    //    * centerX, centerY - the point at the center of the box
    //    * width, height    - the demensions of the box
    // Returns   : A new Box with the given specifications
    // Actions   : none
    static fromCenter(centerX,centerY,width,height) {
      return new this(centerX-width/2,centerY-height/2,width,height);
    }
    // Begin public method drawRectOn
    // Purpose   : Make a line drawing of the Box on a canvas context.
    // Arguments :
    //     * canvasCtx        - the canvas context to draw on
    //     * xOffset, yOffset - offset to add to the rects position
    // Returns   : none
    // Actions   : Changes the contexts lineWidth and draws a rectagle on the canvas
    drawRectOn(canvasCtx,xOffset=0,yOffset=0) {
      canvasCtx.lineWidth = 10;
      canvasCtx.strokeRect(this.left+xOffset,this.top+yOffset,
                  this.width,this.height);
    }
    // Begin public method cropImageTo
    // Purpose   : Draw a section of the image designated by this box on a canvas
    // Arguments :
    //     * canvas - The html canvas to draw on
    //     * image  - The html image to draw on the canvas
    // Returns   : none
    // Actions   :
    //     * Resize the canvas to mach this Box's size internally (rather
    //             than change its css size)
    //     * Draw the section of the image on the canvas       
    cropImageTo(canvas,image) {
      canvas.width = this.width;
      canvas.height = this.height;
      canvas.style.height = canvas.clientWidth*this.height/this.width;
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(image,-this.left,-this.top);
    }
    // Begin public method moveToWithin
    // Purpose   : Ensure the Box is fully in the specified area
    // Arguments :
    //     * left, top, right, bottom: specify the area the Box must be in
    // Returns   : none
    // Actions   : Moves the box to the edge of the specified area if it has gone out
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
    // Begin public method setWidth
    // Purpose   : Set the Boxes width, not changing the center point
    // Arugments :
    //     * width - the new width
    // Returns   : none
    // Actions   : Set the Boxes width, not changing the center point
    setWidth(width) {
      this.left += (this.width-width)/2;
      this.width = width;
    }
    // Begin public method setHeight
    // Purpose   : Set the Boxes height, not changing the center point
    // Arugments :
    //     * height - the new height
    // Returns   : none
    // Actions   : Set the Boxes height, not changing the center point
    setHeight(height) {
      this.top += (this.height-height)/2;
      this.height = height;
    }
    // Begin public method contains
    // Purpose   : Check if a point is in this Box
    // Arguments :
    //    * x,y - the point
    // Returns   :
    //    * true if the point is in this
    //    * false if it is not
    // Actions   : none
    contains(x,y) {
      if(this.left <= x && x <= this.right) {
        if(this.top <= y && y <= this.bottom) {
          return true;
        }
      }
      return false;
    }

    // Begin public method onLeftEdge
    // Purpose   : Determain if a point is on the left edge
    // Arguments :
    //    * x,y - the point
    // Returns   :
    //    * true if the point is on the endge
    //    * false otherwise
    // Actions   : none
    onLeftEdge(x,y) {
      console.log("checking left endge");
      console.log(this.left);
      console.log(x);
      console.log(Math.abs(this.left-x));
      console.log(this.edgeClickWidth);
      if(Math.abs(this.left-x) <= this.edgeClickWidth) {
        console.log("valid x");
        if(this.top-this.edgeClickWidth <= y <= this.bottom+this.edgeClickWidth) {
          console.log("on left edge");
          return true;
        }
      }
      return false;
    }
    
    // Begin public method onRightEdge
    // Purpose   : Determain if a point is on the right edge
    // Arguments :
    //    * x,y - the point
    // Returns   :
    //    * true if the point is on the endge
    //    * false otherwise
    // Actions   : none
    onRightEdge(x,y) {
      if(Math.abs(this.right-x) <= this.edgeClickWidth) {
        if(this.top-this.edgeClickWidth <= y <= this.bottom+this.edgeClickWidth) {
          return true;
        }
      }
      return false;
    }

    // Begin public method onTopEdge
    // Purpose   : Determain if a point is on the left edge
    // Arguments :
    //    * x,y - the point
    // Returns   :
    //    * true if the point is on the endge
    //    * false otherwise
    // Actions   : none
    onTopEdge(x,y) {
      if(Math.abs(this.top-y) <= this.edgeClickWidth) {
        if(this.left-this.edgeClickWidth <= x <= this.right+this.edgeClickWidth) {
          return true;
        }
      }
      return false;
    }

    // Begin public method onBottomEdge
    // Purpose   : Determain if a point is on the left edge
    // Arguments :
    //    * x,y - the point
    // Returns   :
    //    * true if the point is on the endge
    //    * false otherwise
    // Actions   : none
    onBottomEdge(x,y) {
      if(Math.abs(this.bottom-y) <= this.edgeClickWidth) {
        if(this.left-this.edgeClickWidth <= x <= this.right+this.edgeClickWidth) {
          return true;
        }
      }
      return false;
    }

    // Begin public method move
    // Purpose   : Move the box
    // Arguments : vx,vy - How far to move it
    // Returns   : none
    // Actions   : Moves the position of the box
    move(vx,vy) {
      this.left += vx;
      this.top += vy;
    }

    // Begin private getters and setters
    // Returns the location of the right side of the box
    get right() {
      return this.left+this.width;
    }
    // Moves the box so its right side is at x
    set right(x) {
      this.left = x-this.width;
    }
    // Returns the location of the bottom of the box
    get bottom() {
      return this.top+this.height;
    }
    // Moves the box so its bottom is here
    set bottom(y) {
      this.top = y-this.height;
    }
  }
}
