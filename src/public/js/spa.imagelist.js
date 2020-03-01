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
      },
      columns   : 1,

      cropper_model : null,
      on_load       : null,
    };
    this.stateMap  = { 
      $container : null,
      columns    : 1,
      next_id    : 0,
    };
    this.jqueryMap = {};
  }
  //---------------- BEGIN MODULE SCOPE METHODS --------------
    // setJqueryMap, configModule, initModule,
    // handleResize, 
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
    });
    spa.loaderbox.initModule($container);
    return true;
  }
  // End public method /initModule/

  // Begin public method /addImagebox/
  // Purpose    : Add an imagebox to the imagelist
  // Arguments  : none
  // Returns    : 
  //     * imagebox   - the new imagebox
  // Throws     : none
  //
  addImagebox(backend) {
    var imagebox = spa.imagebox.makeImagebox(this.jqueryMap.$container,backend);

    imagebox.stateMap.id = this.stateMap.next_id;
    backend.setId(this.stateMap.next_id);
    this.stateMap.next_id += 1;

    return imagebox;
  }
  // End public method /addImagebox/

  // Begin public method /handleResize/
  // Purpose    : handles resize events
  // Arguments  :
  //  * event
  // Returns    : false? TODO
  // Throws     : none
  //
  handleResize() {
    return false;
  }
  // End public method /handleResize/
  //------------------- END PUBLIC METHODS ---------------------
};

spa.imagelist = new classes.imagelist();
