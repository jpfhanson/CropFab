/*
 * spa.imagelist.model.js
 * Keeps track of all the images boxes and changes to them
 *
 * John Paul Hanson
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global spa, classes */

classes.imagelistmodel = class {
  constructor() {
    this.mainCanvasWidth = 0;
    this.mainCanvasHeight = 0;
    this.cropWidth = null;
    this.cropHeight = null;
    this.images = Array();

    this.configMap = {
      settable_map : {
        show_crop_size : true,
        add_image_frontend : true,
      },
      show_crop_size : null,
      add_image_frontend : null,
    }
  }
  //---------------- BEGIN MODULE SCOPE METHODS --------------
    // handleResize, addImagebox, imagesDoneLoading,
    // setCropSize,  resizeCanvas
  //----------------- END MODULE SCOPE METHODS ---------------
    

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /configModule/
  // Purpose    : Adjust configuration of allowed keys
  // Arguments  : A map of settable keys and values
  //   * color_name - color to use
  // Settings   :
  //   * configMap.settable_map declares allowed keys
  // Returns    : true
  // Throws     : none
  //
  configModule( input_map ) {
    spa.util.setConfigMap({
      input_map    : input_map,
      settable_map : this.configMap.settable_map,
      config_map   : this.configMap
    });
    return true;
  }
  // End public method /configModule/

  // Begin public method /addImagebox/
  // Purpose    : Add an imagebox to the imagelist
  // Arguments  : 
  //     * name             - the filename of the image
  //     * lastModifiedDate - The date the file was last modified
  //     * image            - The actual image (an html img)
  // Returns    : none
  // Throws     : none
  //
  addImagebox(name,lastModifiedDate,image) {

    // set the crop size if it is not set
    if(this.cropWidth == null) {
      if(this.cropHeight != null) {throw new Error();}
      this.cropWidth  = image.naturalWidth/3;
      this.cropHeight = image.naturalHeight/3;
      this.configMap.show_crop_size(this.cropWidth,
                                   this.cropHeight);
    } else if(this.cropHeight == null) {throw new Error();}
      
    var backend = new classes.ImageModel(name,lastModifiedDate,image,
                          this.cropWidth,this.cropHeight);
    let frontend = this.configMap.add_image_frontend(backend);
    this.images.push(backend);

    // make sure the main canvas width is the maximum size of any image
    if(this.mainCanvasWidth < image.naturalWidth) {
      this.mainCanvasWidth = image.naturalWidth;
    }
    if(this.mainCanvasHeight < image.naturalHeight) {
      this.mainCanvasHeight = image.naturalHeight;
    }
  }
  // End public method /addImagebox/

  // Begin public method /imagesDoneLoading/
  // Purpose     : Called when a batch of images is finished loading
  //               Currently it just adjusts the sizes of all the canvases
  // Arguments   : none
  // Returns     : none
  // Throws      : none
  imagesDoneLoading() {
    this.resizeCanvas(this.mainCanvasWidth,this.mainCanvasHeight);
  }
  // End public method /addImagebox/

  // Begin public method /resizeCanvas/
  // Purpose     : Change the size of the main image canvas
  // Arguments   :
  //    * width,height   - the new width and height
  // Returns     : none
  // Throws      : none
  resizeCanvas(width,height) {
    this.mainCanvasWidth = width;
    this.mainCanvasHeight = height;
    for(let image of this.images) {
      image.resizeCanvas(this.mainCanvasWidth,
                         this.mainCanvasHeight);
    }
  }
  // End public method /resizeCanvas/
    
  // Begin public method /changeCropSize/
  // Purpose    : Change the size of the cropping boxes
  // Arguments  : width,height
  // Returns    : none
  // Throws     : none
  changeCropSize(width,height) {
    if(width <= 0 || height >= this.mainCanvasWidth) {
      return;
    }
    if(height <= 0 || height >= this.mainCanvasHeight) {
      return;
    }
    this.cropWidth = Math.floor(width);
    this.cropHeight = Math.floor(height);
    for(let image of this.images) {
      image.changeCropSize(this.cropWidth,this.cropHeight);
    }
    this.configMap.show_crop_size(this.cropWidth,this.cropHeight);
  }
  // End public method /addToCropSize/

  // Begin public method /addToCropSize/
  // Purpose    : Add a vector to the crop box size
  // Arguments  : vw,vh
  // Returns    : none
  // Throws     : none
  addToCropSize(vw,vh) {
    this.changeCropSize(vw+this.cropWidth,vh+this.cropHeight);
  }

  // Begin public async method saveImages()
  // Purpose    : Save the processed images
  // Arguments  : none
  // Returns    : none
  // Throws     : none
  async saveImages() {
    let zip = new JSZip();
    for(let image of this.images) {
      let result = await image.getFinalImage();
      zip.file(result.name,result.blob,{base64:true});
    }
    zip.generateAsync({type:"blob"}).then((content) => {
        let fakeLink = document.createElement("a");
        let dataURL= URL.createObjectURL(content);
        fakeLink.href = dataURL;
        fakeLink.download = "cropped_images.zip";
        fakeLink.click();
        setTimeout(() => {window.URL.revokeObjectURL(dataURL);});
      });
  }

  // Begin public method /handleResize/
  // Purpose    : handles resize events
  // Arguments  :
  //  * event
  // Returns    : false? TODO
  // Throws     : none
  //
  handleResize() {
    for(let image of this.stateMap.image_array) {
      image.resizeExternal();
    }
    return false;
  }
  // End public method /handleResize/
  //------------------- END PUBLIC METHODS ---------------------
};

spa.imagelistmodel = new classes.imagelistmodel();
