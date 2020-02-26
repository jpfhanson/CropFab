/*
 * spa.footer.js
 * A module to control the footer in CROPFAB
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

classes.footer = class {
  constructor() {
    this.configMap = {
      main_html : String()
        + '<div class="spa-footer">'
          + '<p>Frontend by Ted Morin</p>'
          + '<p>Backend by JP Hanson</p>'
        + '</div>'
    };
    this.stateMap  = {
      $container : null
    };
    this.jqueryMap = {};
  }

  //---------------- BEGIN MODULE SCOPE METHODS --------------
    // setJqueryMap, 
    // configModule, initModule, handleResize;
  //----------------- END MODULE SCOPE METHODS ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap() {
    var $append_target = this.stateMap.$append_target;

    this.jqueryMap = { 
      $append_target : $append_target,
      $container : $append_target.find('.spa-footer')
    };
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
  initModule( $append_target ) {

    // load chat slider html and jquery cache
    this.stateMap.$append_target = $append_target;
    $append_target.append( this.configMap.main_html );
    this.setJqueryMap();

    return true;
  }
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
  handleResize( event ) {
    // don't do anything if we don't have a container
    if ( ! this.jqueryMap.$container ) { return false; }
    return true;
  }
  // End public method /handleResize/
  //------------------- END PUBLIC METHODS ---------------------
};

spa.footer = new classes.footer();