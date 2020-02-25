/*
 * spa.imagebox.js
 * module to control imagebox features in CropFab
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa, getComputedStyle */

spa.imagebox = (function () {

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
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
          + '<h2>IMAGEBOX</h2>'
          + '<div class="spa-imagebox-toolbox"></div>'
          + '<div class="spa-imagebox-canvas"></div>'
        + '</div>'
    },
    stateMap  = { 
      $container : null,

      box_width_px  : 0,
      box_height_px : 0,
    },
    jqueryMap = {},

    // getEmSize, setPxSizes, 
    setJqueryMap, configModule, makeImagebox, onClick;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  // //------------------- BEGIN UTILITY METHODS ------------------
  // getEmSize = function ( elem ) {
  //   return Number(
  //     getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
  //   );
  // };
  // //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function (imagebox) {
    var $imagelist = imagebox.stateMap.$imagelist;

    jqueryMap = { 
      $imagelist     : $imagelist,
      $container     : $imagelist.last('.spa-imagebox')
    };
  };
  // End DOM method /setJqueryMap/

  // // Begin DOM method /setPxSizes/
  // setPxSizes = function () {
  //   var px_per_em = getEmSize( jqueryMap.$container.get(0) );

  //   stateMap.px_per_em     = px_per_em;
  //   stateMap.box_height_px = configMap.box_height_em * px_per_em;
  //   stateMap.box_height_px = configMap.box_height_em * px_per_em;
  // };
  // // End DOM method /setPxSizes/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin event handler /onLoadClick/
  onClick = function () {
    console.log("Imagebox clicked!");
  };
  // End event handler /onLoadClick/
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

  // Begin public method /makeImagebox/
  // Purpose    : Create an imagebox object.
  // Arguments  :
  //  * $imagelist - the master imagelist in charge of this imagebox
  //  * imagedata  - the data needed to display the image
  //  * settingMap - any additional settings for the imagebox
  // Returns    : the imagebox object
  // Throws     : none
  //
  makeImagebox = function ( $imagelist, imagedata, settingMap ) {
    var imagebox = {
      stateMap  : {},
      jqueryMap : {},
      imagedata : null,
      id        : null
    };
    imagebox.stateMap.$imagelist = $imagelist;
    console.log($imagelist);
    $imagelist.find(".spa-loaderbox").before(configMap.main_html);
    setJqueryMap(imagebox);
    console.log("Implement imagedata usage, TODO:  " + imagedata);
    console.log("Implement settingMap usage, TODO: " + settingMap);

    // bind user input events
    jqueryMap.$container.bind('click', function() {
      return onClick(imagebox.stateMap.id);
    });

    return imagebox;
  };
  // End public method /initModule/

  // return public methods
  return {
    configModule : configModule,
    makeImagebox : makeImagebox
  };
  //------------------- END PUBLIC METHODS ---------------------
}());