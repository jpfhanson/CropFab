/*
 * spa.toolbox.js
 * A module to control the toolbox in CROPFAB
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

spa.toolbox = (function () {

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
        + '<button class="spa-toolbox-hide">'
        + '  -</button>'
        + '<button class="spa-toolbox-loadbutton">'
        + 'Load</button>'
        + '<button class="spa-toolbox-cropbutton">'
        + 'Crop</button>'
        + '<button class="spa-toolbox-savebutton">'
        + 'Save</button>'
        + '<div class="spa-toolbox-croplimits">'
          + '<div>'
            + '<input type="number" class="spa-toolbox-croptop" />'
            + 'Top'
          + '</div>'
          + '<br/>'
          + '<div>'
            + '<input type="number" class="spa-toolbox-cropleft" />'
            + 'Left'
          + '</div>'
          + '<div>'
            + '<input type="number" class="spa-toolbox-cropright" />'
            + 'Right'
          + '</div>'
          + '<br/>'
          + '<div>'
            + '<input type="number" class="spa-toolbox-cropbottom" />'
            + 'Bottom'
          + '</div>'
        + '</div>'
        + '<div class="spa-toolbox-advert">'
        + 'SHAMELESS ADVERT HERE</div>',
    },
    stateMap  = { 
      $container     : null,
      image_selected : null
    },
    jqueryMap = {},

    setJqueryMap, onHideClick, onLoadClick, onCropClick, onSaveClick,
    onCropLimitChange, handleCropLimitChange, initModule;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // example : getTrimmedString
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = { 
      $container : $container,
      $hidebutton  : $container.find('.spa-toolbox-hidebutton'),
      $loadbutton  : $container.find('.spa-toolbox-loadbutton'),
      $cropbutton  : $container.find('.spa-toolbox-cropbutton'),
      $savebutton  : $container.find('.spa-toolbox-savebutton'),
      $croplimit   : $container.find('.spa-toolbox-croplimits'),
      $cropleft    : $container.find('.spa-toolbox-cropleft'),
      $cropright   : $container.find('.spa-toolbox-cropright'),
      $croptop     : $container.find('.spa-toolbox-croptop'),
      $cropbottom  : $container.find('.spa-toolbox-cropbottom'), 
      $advert      : $container.find('.spa-toolbox-advert')};
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------

  // Begin EVENT HANDLER method /onLoadClick/
  onHideClick = function () {
    console.log("Hiding the toolbox!");
    // TODO
  };
  // End EVENT HANDLER method /onLoadClick/

  // Begin EVENT HANDLER method /onLoadClick/
  onLoadClick = function () {
    console.log("Loading!");
    // // TODO get image
    // var image_data = null;
    // spa.model.load(image_data);
  };
  // End EVENT HANDLER method /onLoadClick/

  // Begin EVENT HANDLER method /onCropClick/
  onCropClick = function () {
    console.log("Cropping!");
    // TODO spa.model.crop();
  };
  // End EVENT HANDLER method /onCropClick/

  // Begin EVENT HANDLER method /onSaveClick/
  onSaveClick = function () {
    console.log("Saving!");
    // TODO spa.model.save();
  };
  // End EVENT HANDLER method /onSaveClick/

  // Begin EVENT HANDLER method /onCropLimitChange/
  onCropLimitChange = function () {
    console.log("Changing crop limits!");
    // // TODO
    // croplimits = {
    //   top    : jqueryMap.$croptop.val,
    //   left   : jqueryMap.$cropleft.val,
    //   right  : jqueryMap.$cropright.val,
    //   bottom : jqueryMap.$cropbottom.val
    // };
    // spa.model.updateCropLimits(croplimits);
  };
  // End EVENT HANDLER method /onCropLimitChange/

  //-------------------- END EVENT HANDLERS --------------------



  // Begin public method /handleCropLimitChange/
  // Purpose    : Updates inputs to reflect new crop limits
  // Arguments  :
  //  * croplimits - a map to the new top, bottom, left, right limits
  // Returns    : true
  // Throws     : none
  //
  handleCropLimitChange = function ( croplimits ) {
    console.log("Updating Crop Limits!");
    jqueryMap.$cropleft.value   = croplimits.left;
    jqueryMap.$cropright.value  = croplimits.right; 
    jqueryMap.$croptop.value    = croplimits.top;
    jqueryMap.$cropbottom.value = croplimits.bottom;
    return true;
  };
  // End public method /handleCropLimitChange/

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

    // bind user input events
    jqueryMap.$hidebutton.bind('click', onHideClick);
    jqueryMap.$loadbutton.bind('click', onLoadClick);
    jqueryMap.$cropbutton.bind('click', onCropClick);
    jqueryMap.$savebutton.bind('click', onSaveClick);
    jqueryMap.$cropleft.bind('change', onCropLimitChange);
    jqueryMap.$cropright.bind('change', onCropLimitChange);
    jqueryMap.$croptop.bind('change', onCropLimitChange);
    jqueryMap.$cropbottom.bind('change', onCropLimitChange);
    return true;
  };
  // End public method /initModule/

  // return public methods
  return {
    handleCropLimitChange : handleCropLimitChange,
    initModule            : initModule
  };
  //------------------- END PUBLIC METHODS ---------------------
}());