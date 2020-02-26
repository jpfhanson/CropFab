/*
 * spa.imagelist.js
 * A module to control the imagelist in CROPFAB
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

classes.imagelist = class {
  constructor() {
    this.configMap = {
      settable_map : { 
        columns       : true,

        cropper_model : true,
        on_load       : true,
        on_drop       : true,
        set_crop_size : true
      },
      columns   : 1,

      cropper_model : null,
      on_load       : null,
      on_drop       : null,
      set_crop_size : null,
    };
    this.stateMap  = { 
      $container : null,
      columns    : 1,
      next_id    : 0,
      greatest_image_width : 0,
      greatest_image_height : 0,
      crop_width  : null,
      crop_height : null,
      image_array : new Array(),
    };
    this.jqueryMap = {};
  }
  //---------------- BEGIN MODULE SCOPE METHODS --------------
    // setJqueryMap, configModule, initModule,
    // handleResize, addImagebox, imagesDoneLoading,
    // changeCropWidth, changeCropHeight,
  //----------------- END MODULE SCOPE METHODS ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // example : getTrimmedString
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap() {
    var $container = this.stateMap.$container;

    this.jqueryMap = { $container : $container };
  }
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // example: onClickButton = ...
  //-------------------- END EVENT HANDLERS --------------------



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

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  initModule( $container ) {
    this.stateMap.$container = $container;
    this.setJqueryMap();

    spa.loaderbox.configModule({
      cropper_model   : spa.model,
      on_load         : this.configMap.on_load,
      on_drop         : this.configMap.on_drop
    });
    spa.loaderbox.initModule($container);
    return true;
  }
  // End public method /initModule/

  // Begin public method /addImagebox/
  // Purpose    : Add an imagebox to the imagelist
  // Arguments  : 
  //     * imagedata  - the image data
  //     * settingMap - additional settings for the imagebox
  // Returns    : 
  //     * imagebox   - the new imagebox
  // Throws     : none
  //
  addImagebox(name,lastModifiedDate,image) {
    if(this.stateMap.crop_width == null) {
      if(this.stateMap.crop_height != null) {throw new Error();}
      this.stateMap.crop_width = image.naturalWidth/3;
      this.stateMap.crop_height = image.naturalHeight/3;
      this.configMap.set_crop_size(this.stateMap.crop_width,
                                   this.stateMap.crop_height);
    } else if(this.stateMap.crop_height == null) {
      throw new Error();
    }
      
    var backend = new classes.ImageModel(name,lastModifiedDate,image,
                          this.stateMap.crop_width,this.stateMap.crop_height);
    var imagebox = spa.imagebox.makeImagebox( 
      this.jqueryMap.$container, backend
    );

    imagebox.stateMap.id = this.stateMap.next_id;
    this.stateMap.image_array.push(backend);
    this.stateMap.next_id += 1;
    if(this.stateMap.greatest_image_width < image.naturalWidth) {
      this.stateMap.greatest_image_width = image.naturalWidth;
    }
    if(this.stateMap.greatest_image_height < image.naturalHeight) {
      this.stateMap.greatest_image_height = image.naturalHeight;
    }

    return imagebox;
  }
  // End public method /addImagebox/

  // Begin public method /imagesDoneLoading/
  // Purpose     : Called when a batch of images is finished loading
  //               Currently it just adjusts the sizes of all the canvases
  // Arguments   : none
  // Returns     : none
  // Throws      : none
  imagesDoneLoading() {
    console.log("w,h: "+this.stateMap.greatest_image_width+','+this.stateMap.greatest_image_height);
    for(let image of this.stateMap.image_array) {
      image.resizeCanvas(this.stateMap.greatest_image_width,
                         this.stateMap.greatest_image_height);
    }
  }
  // End public method /addImagebox/
    
  // Begin public method /changeCropWidth/
  // Purpose    : Change the width of the cropping boxes
  // Arguments  : width
  // Returns    : none
  // Throws     : none
  changeCropWidth(width) {
    this.stateMap.crop_width = width;
    for(let image of this.stateMap.image_array) {
      image.changeCropWidth(width);
    }
  }
  // End public method /changeCropWidth/

  // Begin public method /changeCropHeight/
  // Purpose    : Change the height of the cropping boxes
  // Arguments  : height
  // Returns    : none
  // Throws     : none
  changeCropHeight(height) {
    this.stateMap.crop_height = height;
    for(let image of this.stateMap.image_array) {
      image.changeCropHeight(height);
    }
  }
  // End public method /changeCropHeight/

  // Begin public async method saveImages()
  // Purpose    : Save the processed images
  // Arguments  : none
  // Returns    : none
  // Throws     : none
  async saveImages() {
    let zip = new JSZip();
    for(let image of this.stateMap.image_array) {
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

spa.imagelist = new classes.imagelist();
