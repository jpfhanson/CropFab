/*
 * spa.footer.js
 * A module to control the footer in CROPFAB
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

spa.footer = (function () {

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
        + '<div class="spa-footer">'
          + '<p>Frontend by Ted Morin</p>'
          + '<p>Backend by JP Hanson</p>'
        + '</div>'
    },
    stateMap  = {
      $container : null
    },
    jqueryMap = {},

    setJqueryMap, 
    configModule, initModule, handleResize;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $append_target = stateMap.$append_target;

    jqueryMap = { 
      $append_target : $append_target,
      $container : $append_target.find('.spa-footer')
    };
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
  // configModule = function ( input_map ) {
  //   spa.util.setConfigMap({
  //     input_map    : input_map,
  //     settable_map : configMap.settable_map,
  //     config_map   : configMap
  //   });
  //   return true;
  // };
  // End public method /configModule/

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * $container the jquery the feature will be added to
  // Returns    : true
  // Throws     : none
  //
  initModule = function ( $append_target ) {

    // load chat slider html and jquery cache
    stateMap.$append_target = $append_target;
    $append_target.append( configMap.main_html );
    setJqueryMap();

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
  handleResize = function ( event ) {
    // don't do anything if we don't have a container
    if ( ! jqueryMap.$container ) { return false; }
    return true;
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