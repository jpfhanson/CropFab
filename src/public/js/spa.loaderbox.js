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

/*global $, spa, getComputedStyle */

spa.loaderbox = (function () {

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      settable_map : {
        image_width     : true,
        image_height    : true, 
        alone_height_em : true,
        other_height_em : true,

        cropper_model   : true,
        on_load         : true,
        on_drop         : true,
      },
      image_width : 560,
      image_height: 420,
      alone_height_em : 50,
      other_height_em : 10,

      cropper_model : null,
      on_load       : null,
      on_drop       : null,

      main_html : String()
        + '<div class="spa-loaderbox"></div>',
      alone_html : String()
        + '<h2>Load images here!</h2>',
      other_html : String()
        + '<h2>Load more images here!</h2>'
    },
    stateMap  = { 
      $container : null,

      alone_height_px : 0,
      other_height_px : 0,

      alone : true,
    },
    jqueryMap = {},

    getEmSize, setJqueryMap, configModule, initModule,
    setPxSizes, onLoadClick, handleLoad, 
    handleResize;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  getEmSize = function ( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  };
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

  // Begin DOM method /setPxSizes/
  setPxSizes = function () {
    var px_per_em = getEmSize( jqueryMap.$container.get(0) );

    stateMap.px_per_em         = px_per_em;
    stateMap.alone_height_px = configMap.alone_height_em * px_per_em;
    stateMap.other_height_px = configMap.other_height_em * px_per_em;
  };
  // End DOM method /setPxSizes/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin event handler /onLoadClick/
  onLoadClick = function () {
    console.log("Load fired by loaderbox!");
    configMap.on_load();
  };
  // End event handler /onLoadClick/
  //-------------------- END EVENT HANDLERS --------------------



  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /handleLoad/
  // Purpose    : Respond when loading is completed
  // Arguments  : none
  // Returns    : Boolean
  //   * false - images loaded previously
  //   * true  - first images loaded (resized)
  //
  handleLoad = function () {
    if (!stateMap.alone) { return false; }

    stateMap.alone = false;
    handleResize();
    console.log('Loaded!');
    return true;
  };
  // End public method /handleLoad/

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

    // bind user input events
    jqueryMap.$container.bind('click', onLoadClick);

    // update the depending according to imagelist content
    if (stateMap.alone) {
      jqueryMap.$container.css('height', configMap.image_height);
      jqueryMap.$container.html(configMap.alone_html);
    } else {
      jqueryMap.$container.css('height', configMap.image_height*0.5);
      jqueryMap.$container.html(configMap.other_html);
    }
    return true;
  };
  // End public method /initModule/

  // Begin public method /handleResize/
  // Purpose    : handles resize events
  // Arguments  :
  //  * event
  // Returns    : Boolean
  //   * false - resize not considered
  //   * true  - resize considered
  // Throws     : none
  //
  handleResize = function () {
    // don't do anything if we don't have a container
    if ( ! jqueryMap.$container ) { return false; }

    setPxSizes();
    if ( stateMap.alone ){
      jqueryMap.$container.css('height', stateMap.alone_height_px);
      jqueryMap.$container.html(configMap.alone_html);
    } else {
      jqueryMap.$container.css('height', stateMap.other_height_px);
      jqueryMap.$container.html(configMap.other_html);
    }
    return true;
  };
  // End public method /handleResize/

  // return public methods
  return {
    handleLoad   : handleLoad,
    configModule : configModule,
    initModule   : initModule,
    handleResize : handleResize
  };
  //------------------- END PUBLIC METHODS ---------------------
}());