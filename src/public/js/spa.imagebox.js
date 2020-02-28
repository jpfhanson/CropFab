/*
 * spa.imagebox.js
 * module to control imagebox features in CropFab
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

classes.imagebox = class {
  constructor() {
    this.configMap = {
      settable_map : {
        image_width     : true,
        image_height    : true,
        box_width_em    : true, 
        box_height_em   : true,

        cropper_model   : true,
        on_load         : true,
        on_drop         : true,
      },
      image_width     : 560,
      image_height    : 420,
      box_width_em    : 10,
      box_height_em   : 50,

      main_html : String()
        + '<div class="spa-imagebox">'
          + '<div class="spa-imagebox-panel">'
            + '<canvas class="spa-imagebox-previewcanvas"></canvas>'
            + '<div class="spa-imagebox-toolbox"></div>'
          + '</div>'
          + '<canvas class="spa-imagebox-maincanvas"></canvas>'
        + '</div>'
    };
    this.stateMap  = { 
      $container : null,

      box_width_px  : 0,
      box_height_px : 0,
    };
    this.jqueryMap = {};
  }
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    // getEmSize, setPxSizes, 
    // // setJqueryMap, 
    // configModule, makeImagebox;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  getEmSize( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  }
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap() {
    var $imagelist = this.stateMap.$imagelist,
        $container = $('.spa-imagebox').last(this.stateMap.$imagelist);


    this.jqueryMap = { 
      $imagelist     : $imagelist,
      $container     : $container,
      $maincanvas    : $container.find('.spa-imagebox-maincanvas'),
      $previewcanvas : $container.find('.spa-imagebox-previewcanvas'),
      $toolbox       : $container.find('.spa-imagebox-toolbox'),
    };
  }
  // End DOM method /setJqueryMap/

  // Begin DOM method /setPxSizes/
  setPxSizes() {
    var px_per_em = this.getEmSize( this.jqueryMap.$container.get(0) );

    this.stateMap.px_per_em     = px_per_em;
    this.stateMap.box_height_px = this.configMap.box_height_em * px_per_em;
    this.stateMap.box_height_px = this.configMap.box_height_em * px_per_em;
  }
  // End DOM method /setPxSizes/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
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

  // Begin public method /makeImagebox/
  // Purpose    : Create an imagebox object.
  // Arguments  :
  //  * $imagelist - the master imagelist in charge of this imagebox
  //  * imagedata  - the data needed to display the image
  //  * settingMap - any additional settings for the imagebox
  // Returns    : the imagebox object
  // Throws     : none
  //
  makeImagebox( $imagelist, backend, settingMap) {
    var imagebox = Object.create(this);
    imagebox.stateMap  = {
      $imagelist : $imagelist,
    };
    imagebox.jqueryMap = {};
    $imagelist.find(".spa-loaderbox").before(this.configMap.main_html);
    imagebox.setJqueryMap = this.setJqueryMap;
    imagebox.setJqueryMap();

    // apply settings
    console.log("Implement settingMap usage, TODO: " + settingMap);

    // initialize backend
    console.log(imagebox.jqueryMap.$maincanvas.get(0));
    backend.setMainCanvas(
          imagebox.jqueryMap.$maincanvas.get(0));
    backend.setPreviewCanvas(
          imagebox.jqueryMap.$previewcanvas.get(0));

    // // initialize toolbox
    // spa.imagebox.backend.makeToolbox( imagebox.jqueryMap.$toolbox );

    return imagebox;
  }
  // End public method /makeImagebox/

  // return public methods
  //------------------- END PUBLIC METHODS ---------------------
};

spa.imagebox = new classes.imagebox();
