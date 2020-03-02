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
    this.config = new classes.OpConfig("%n_cropped.jpeg",null,null,null,null,null,null,null);
    this.images = Array();

    this.configMap = {
      settable_map : {
        show_config : true,
        add_image_frontend : true,
      },
      show_config : null,
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
    this.config.setDefaultIfNull(image.naturalWidth,image.naturalHeight);
    this.config.increaseMainCanvasSize(image.naturalWidth,image.naturalHeight);
      
    var backend = new classes.ImageModel(name,lastModifiedDate,image,
                                          this.config.clone());
    this.configMap.add_image_frontend(backend);
    this.images.push(backend);
  }
  // End public method /addImagebox/

  deployMainCanvasSize() {
    for(let image of this.images) {
      if (image === undefined) {continue;}
      image.setMainCanvasSize(this.config.mainCanvasWidth,
                              this.config.mainCanvasHeight);
    }
    this.configMap.show_config(this.config);
  }

  /*
  // Begin public method /updateConfig/
  // Purpose     : Change the op config and tell the images and toolbox about
  //                the change.
  // Arguments   : config
  // Returns     : none
  // Throws      : none
  updateConfig(config) {
    this.config.update(config);
    this.deployConfig();
  }
  // End public method /resizeCanvas/
  */

  // Begin public method /setSaveName/
  // Purpose     : Change filename
  // Arguments   : savename  - the new filename
  // Returns     : none
  // Throws      : none
  setSavename(savename) {
    this.config.savename = savename;
    for(let image of this.images) {
      image.setSavename(savename);
    }
    this.configMap.show_config(this.config);
  }

  // End public method /setScale/

  // Begin public method /setCropSize/
  // Purpose     : Change the crop size
  // Arguments   : w,h  - the new crop size
  // Returns     : none
  // Throws      : none
  setCropSize(w,h) {
    this.config.setCropSize(w,h);
    for(let image of this.images) {
      image.trySetCropSize(w,h);
    }
    this.configMap.show_config(this.config);
  }
  // End public method /setCropSize/

    
  // Begin public method /setCropPosition/
  // Purpose     : Change the position of the crop box
  // Arguments   : x,y  - the new position
  // Returns     : none
  // Throws      : none
  setCropPosition(x,y) {
    this.setCropPosition(x,y);
    for(let image of this.images) {
      image.trySetCropPosition(x,y);
    }
    this.configMap.show_config(this.config);
  }
  // End public method /setCropPosition/

  // Begin public method /setScale/
  // Purpose     : Change scale
  // Arguments   : scale - the new scale
  // Returns     : none
  // Throws      : none
  setScale(scale) {
    this.config.setScale(scale)
    for(let image of this.images) {
      image.trySetScale(scale);
    }
    this.configMap.show_config(this.config);
  }
  // End public method /setScale/

  // Begin public method /addToCropSize/
  // Purpose    : Add a vector to the crop box size
  // Arguments  : vw,vh
  // Returns    : none
  // Throws     : none
  addToCropSize(vw,vh) {
    this.config.dragCropSize(vw,vh);
    for(let image of this.images) {
      image.trySetCropSize(this.config.cropWidth,this.config.cropHeight);
    }
    this.configMap.show_config(this.config);
  }

  // Begin public method /moveCropBox/
  // Purpose    : Add a vector to the crop box position
  // Arguments  : vx,vy
  // Returns    : none
  // Throws     : none
  moveCropBox(vx,vy) {
    this.config.dragCropPosition(vx,vy);
    for(let image of this.images) {
      image.trySetCropPosition(this.config.cropLeft,this.config.cropTop);
    }
    this.configMap.show_config(this.config);
  }

  // Begin public async method saveImages()
  // Purpose    : Save the processed images
  // Arguments  : none
  // Returns    : none
  // Throws     : none
  async saveImages() {
    let zip = new JSZip();
    for(let image of this.images) {
      if (image === undefined) {continue;}
      let result = await image.getFinalImage();
      zip.file(result.name,result.blob,{base64:true});
    }
    zip.generateAsync({type:"blob"}).then((content) => {
      spa.util.saveFile(content,"cropped_images.zip");
    });
    /*
        let fakeLink = document.createElement("a");
        let dataURL= URL.createObjectURL(content);
        fakeLink.href = dataURL;
        fakeLink.download = "cropped_images.zip";
        fakeLink.click();
        setTimeout(() => {window.URL.revokeObjectURL(dataURL);});
      });
    */
  }

  // Begin public methdo /lockAll/
  // Purpose    : Locks all images to the global settings
  // Arguments  : none
  // Returns    : none
  // Throws     : none
  lockAll() {
    console.log("TODO: implement lockAll");
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
