/*
 * spa.imagelist.js
 * A module to control the imagelist in CROPFAB
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa */

spa.imagelist = (function () {

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      settable_map : { 
        columns       : true,

        cropper_model : true,
        on_load       : true,
        on_drop       : true
      },
      columns   : 1,

      cropper_model : null,
      on_load       : null,
      on_drop       : null
    },
    stateMap  = { 
      $container : null,
      columns    : 1,
      next_id    : 0
    },
    jqueryMap = {},

    setJqueryMap, configModule, initModule,
    handleResize, addImagebox;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // example : getTrimmedString
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = { $container : $container };
  };
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
  configModule = function ( input_map ) {
    spa.util.setConfigMap({
      input_map    : input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });
    return true;
  };
  // End public method /configModule/

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  initModule = function ( $container ) {
    stateMap.$container = $container;
    setJqueryMap();

    spa.loaderbox.configModule({
      cropper_model   : spa.model,
      on_load         : configMap.on_load,
      on_drop         : configMap.on_drop
    });
    spa.loaderbox.initModule($container);
    return true;
  };
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
  addImagebox = function ( imagebox_back, settingMap ) {
    var imagebox = spa.imagebox.makeImagebox( 
      jqueryMap.$container, 
      imagebox_back,
      settingMap // configs
    );

    imagebox.stateMap.id = stateMap.next_id;
    stateMap.next_id++;

    return imagebox;
  };
  // End public method /addImagebox/

  // Begin public method /handleResize/
  // Purpose    : handles resize events
  // Arguments  :
  //  * event
  // Returns    : false? TODO
  // Throws     : none
  //
  handleResize = function () {
    return false;
  };
  // End public method /handleResize/

  // return public methods
  return {
    configModule : configModule,
    initModule   : initModule,
    addImagebox  : addImagebox,
    handleResize : handleResize
  };
  //------------------- END PUBLIC METHODS ---------------------
}());