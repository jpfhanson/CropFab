/*
 * spa.loaderbox.js
 * module to control the loaderbox in CROPFAB
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

spa.loaderbox = (function () {

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      settable_map : {
        image_width : true,
        image_height: true, },
      image_width : 560,
      image_height: 420,
      main_html : String()
        + '<div class="spa-loaderbox"></div>',
      alone_html : String()
        + '<h2>Upload an image here!</h2>',
      other_html : String()
        + '<h2>Upload more images here!</h2>'
    },
    stateMap  = { 
      $container : null,
      alone : true
    },
    jqueryMap = {},

    setJqueryMap, configModule, initModule,
    handleResize;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // example : getTrimmedString
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $append_target = stateMap.$append_target;

    jqueryMap = { 
      $append_target : $append_target,
      $container     : $append_target.find('.spa-loaderbox')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin event handler /onUpload/
  onUpload = function (event) {
    // TODO
    stateMap.alone = false;
    jqueryMap.$container.html(configMap.other_html);
    console.log('Uploaded successfully!');
  }
  // End event handler /onUpload/
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
  initModule = function ( $append_target ) {
    stateMap.$append_target = $append_target;
    $append_target.append(configMap.main_html);
    setJqueryMap();

    // update the depending according to imagelist content
    if (stateMap.alone) {
      jqueryMap.$container.css('height', configMap.image_height);
      jqueryMap.$container.html(configMap.alone_html);
    } else {
      jqueryMap.$container.css('height', configMap.image_height*.5);
      jqueryMap.$container.html(configMap.other_html);
    }
    return true;
  };
  // End public method /initModule/

  // Begin public method /handleResize/
  // Purpose    : handles resize events
  // Arguments  :
  //  * event
  // Returns    : false? TODO
  // Throws     : none
  //
  handleResize = function ( event ) {
    return false;
  };
  // End public method /handleResize/

  // return public methods
  return {
    configModule : configModule,
    initModule   : initModule,
    handleResize : handleResize
  };
  //------------------- END PUBLIC METHODS ---------------------
}());