/*
 * spa.menubar.js
 * A module to control the menubar in CROPFAB
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

spa.menubar = (function () {

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      settable_map : {
        menubar_height: true,
        menubar_width : true
      },
      main_html : String()
        + '<div class="spa-menubar-logo">'
          + '<img src="/images/cropfablogo0200215a.svg" />'
        + '</div>'
        + '<div class="spa-menubar-menu">'
          + '<div class=spa-menubar-aboutbutton>'
          + '<img src="/images/aboutbutton0200215a.svg" />'
          + '</div>'
          + '<div class=spa-menubar-usagebutton>'
          + '<img src="/images/usagebutton0200215a.svg" />'
          + '</div>'
        + '</div>',
      about_text : String()
        + 'Welcome to CROPFAB!\n\n'
        + 'CROPFAB is an all-javascript, all-client-side webapp '
        + 'to let you crop many images simultaneously.\n\n'
        + 'A program called "BatchCrop" probably does a similar '
        + 'thing, but you have to download it, and we never tried it out.\n\n'
        + 'CROPFAB is protected by a creative commons license. '
        + 'We are open source, and you can view our source code '
        + 'and contribute at github.com/cropfab!',
      usage_text : String()
        + 'To crop several images at once, drag them into '
        + 'the loader box at the bottom of the image list.\n\n'
        + 'Then click and drag the cropping-corners on one '
        + 'image and watch the other images follow suit!\n\n'
        + 'When you have the right coordinates to crop, press '
        + '"CROP" in the toolbox on the right!\n\n'
        + 'Finally, inspect your images and save them, or undo '
        + 'and try again.\n\n'
        + 'Enjoy!',
      menubar_height : 73,
      menubar_width  : 780,
    },
    stateMap  = { $container : null },
    jqueryMap = {},

    getMarginLeft, setMenubarDimensions, setJqueryMap, 
    handleResize, onAboutClick, onUsageClick,
    configModule, initModule;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // Begin UTILITY method /setMenubarDimensions/
  setMenubarDimensions = function() {
    jqueryMap.$container.css('width', 
                      configMap.menubar_width);
    jqueryMap.$container.css('margin-left', spa.util.getMarginLeft(
                      configMap.menubar_width));
    jqueryMap.$container.css('height', 
                      configMap.menubar_height);
  };
  // End UTILITY method /setMenubarDimensions/

  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = { 
      $container : $container,
      $logo  : $container.find('.spa-menubar-logo'),
      $usage : $container.find('.spa-menubar-usagebutton'),
      $about : $container.find('.spa-menubar-aboutbutton'),
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------

  onAboutClick = function() {
    alert(configMap.about_text);
  };

  onUsageClick = function() {
    alert(configMap.usage_text);
  };

  //-------------------- END EVENT HANDLERS --------------------



  //------------------- BEGIN PUBLIC METHODS -------------------
  // // Begin public method /configModule/
  // // Purpose    : Adjust configuration of allowed keys
  // // Arguments  : A map of settable keys and values
  // //   * color_name - color to use
  // // Settings   :
  // //   * configMap.settable_map declares allowed keys
  // // Returns    : true
  // // Throws     : none
  // //
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
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  initModule = function ( $container ) {
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();
    setMenubarDimensions();

    // bind user input events
    jqueryMap.$usage.bind('click', onUsageClick);
    jqueryMap.$about.bind('click', onAboutClick);

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