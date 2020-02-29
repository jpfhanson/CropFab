/*
 * spa.opconfig.js
 * Provides convinient access to the configurations of the operations 
 * to be done on an image
 *
 * John Paul Hanson
*/

/*jshint          browser   : true, regexp   : true,
  devel   : true, indent    : 2,    maxerr   : 50,
  newcap  : true, nomen     : true, plusplus : true,
  white   : true, esversion : 6,    laxbreak : true
*/

/*global spa, classes */

classes.OpConfig = class {
  constructor(mainCanvasWidth,mainCanvasHeight,
              cropLeft,cropTop,cropWidth,cropHeight) {
    this.mainCanvasWidth = mainCanvasWidth;
    this.mainCanvasHeight = mainCanvasHeight;
    this.cropLeft = cropLeft;
    this.cropTop = cropTop;
    this.cropWidth = cropWidth;
    this.cropHeight = cropHeight;
  }
  setDefaultIfNull(mainCanvasWidth,mainCanvasHeight) {
    if(this.mainCanvasWidth == null) {
      this.mainCanvasWidth = mainCanvasWidth;
    }
    if(this.mainCanvasHeight == null) {
      this.mainCanvasHeight = mainCanvasHeight;
    }
    if(this.cropWidth == null) {
      this.cropWidth = this.mainCanvasWidth/3;
    }
    if(this.cropHeight == null) {
      this.cropHeight = this.mainCanvasHeight/3;
    }
    if(this.cropLeft == null) {
      this.cropLeft = this.mainCanvasWidth/2-this.cropWidth/2;
    }
    if(this.cropTop == null) {
      this.cropTop = this.mainCanvasHeight/2-this.cropHeight/2;
    }
  }
  clone() {
    return new classes.OpConfig(this.mainCanvasWidth,this.mainCanvasHeight,
                            this.cropLeft,this.cropTop,
                            this.cropWidth,this.cropHeight);
  }
  update(config) {
    // the order is important
    // each method modifies the things set before it, so, if only
    // one thing has changed in config, that will affect the other values
    // correctly
    this.cropLeft = config.cropLeft;
    this.cropTop = config.cropTop;
    this.setCropSize(config.cropWidth,config.cropHeight);
    this.setMainCanvasSize(config.mainCanvasWidth,config.mainCanvasHeight);
    this.moveCropWithinMainCanvas();
  }
  get cropRight() {
    return this.cropLeft+this.cropWidth;
  }
  get cropBottom() {
    return this.cropTop+this.cropHeight;
  }
  set cropRight(x) {
    this.cropLeft = x-this.cropWidth;
  }
  set cropBottom(y) {
    this.cropTop = y-this.cropHeight;
  }
  setCropSize(width,height) {
    this.cropLeft -= (width-this.cropWidth)/2;
    this.cropWidth = width;
    this.cropTop -= (height-this.cropHeight)/2;
    this.cropHeight = height;
  }
  setMainCanvasSize(width,height) {
    this.cropLeft -= (width-this.mainCanvasWidth)/2;
    this.cropTop -= (height-this.mainCanvasHeight)/2;
    this.mainCanvasWidth = width;
    this.mainCanvasHeight = height;
    this.moveCropWithinMainCanvas();
  }
  increaseMainCanvasSize(width,height) {
    if(this.mainCanvasWidth > width) {
      width = this.mainCanvasWidth;
    }
    if(this.mainCanvasHeight > height) {
      height = this.mainCanvasHeight;
    }
    this.setMainCanvasSize(width,height);
  }
  get cropEdgeColisionWidth() {
    // the denominator is just a magic number that feels good
    // for detecting when the user has clicked the edge of the crop box
    return Math.max(this.mainCanvasWidth,this.mainCanvasHeight)/100;
  }

  onCropTopEdge(x,y) {
    if(Math.abs(this.cropTop-y) <= this.cropEdgeColisionWidth) {
      if(this.cropLeft-this.cropEdgeColisionWidth <= x &&
          x <= this.cropRight+this.cropEdgeColisionWidth) {
        return true;
      }
    }
    return false;
  }
  onCropBottomEdge(x,y) {
    return this.onCropTopEdge(x,y-this.cropHeight);
  }
  onCropLeftEdge(x,y) {
    if(Math.abs(this.cropLeft-x) <= this.cropEdgeColisionWidth) {
      if(this.cropTop-this.cropEdgeColisionWidth <= y &&
          x <= this.cropBottom+this.cropEdgeColisionWidth) {
        return true;
      }
    }
    return false;
  }
  onCropRightEdge(x,y) {
    return this.onCropLeftEdge(x-this.cropWidth,y);
  }
  onCropBox(x,y) {
    if(this.cropLeft < x < this.cropRight) {
      if(this.cropTop < y < this.cropBottom) {
        return true;
      }
    }
    return false;
  }
  moveCropWithinMainCanvas() {
    if(this.cropWidth < 1) {
      this.cropWidth = 1;
    } else if(this.cropWidth > this.mainCanvasWidth) {
      this.cropWidth = this.mainCanvasWidth;
    }
    if(this.cropHeight < 1) {
      this.cropHeight = 1;
    } else if(this.cropHeight > this.mainCanvasHeight) {
      this.cropHeight = this.mainCanvasHeight;
    }
    if(this.cropTop < 0) {this.cropTop = 0;}
    if(this.cropLeft < 0) {this.cropLeft = 0;}
    if(this.cropRight > this.mainCanvasWidth) {
      this.cropRight = this.mainCanvasWidth;
    }
    if(this.cropBottom > this.mainCanvasHeight) {
      this.cropBottom = this.mainCanvasHeight;
    }
  }
}
