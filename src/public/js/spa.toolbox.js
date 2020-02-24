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

/*global $, spa, getComputedStyle */

spa.toolbox = (function () {

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
        + '<div class="spa-toolbox">'
          + '<button class="spa-toolbox-togglebutton">'
          + '<b>-</b></button>'
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
          + 'SHAMELESS ADVERT HERE</div>'
        + '</div>',
      settable_map : {
        toolbox_open_time    : true,
        toolbox_close_time   : true,
        toolbox_opened_em    : true,
        toolbox_closed_em    : true,

        set_toolbox_anchor   : true,
        on_load              : true,
        on_crop              : true,
        on_save              : true,
        cropper_model        : true
      },

      toolbox_open_time     : 250,
      toolbox_close_time    : 250,
      toolbox_opened_em     : 16,
      toolbox_closed_em     : 2,
      toolbox_opened_min_em : 10,
      window_height_min_em  : 20,

      set_toolbox_anchor   : null,
      on_load              : null,
      on_crop              : null,
      on_save              : null,
      cropper_model        : null
    },
    stateMap  = {
      $append_target    : null,
      position_type     : 'closed',
      px_per_em         : 0,
      toolbox_hidden_px : 0,
      toolbox_closed_px : 0,
      toolbox_opened_px : 0,
      image_selecteed  : null,
    },
    jqueryMap = {},

    setJqueryMap, getEmSize, setPxSizes, setToolboxPosition,
    onToggleClick, onLoadClick, onCropClick, onSaveClick,
    onCropLimitChange, handleCropLimitChange,
    configModule, initModule, handleResize;
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
    var
      $append_target = stateMap.$append_target,
      $container     = $append_target.find( '.spa-toolbox' );

    jqueryMap = { 
      $container     : $container,
      $togglebutton  : $container.find('.spa-toolbox-togglebutton'),
      $loadbutton    : $container.find('.spa-toolbox-loadbutton'),
      $cropbutton    : $container.find('.spa-toolbox-cropbutton'),
      $savebutton    : $container.find('.spa-toolbox-savebutton'),
      $croplimit     : $container.find('.spa-toolbox-croplimits'),
      $cropleft      : $container.find('.spa-toolbox-cropleft'),
      $cropright     : $container.find('.spa-toolbox-cropright'),
      $croptop       : $container.find('.spa-toolbox-croptop'),
      $cropbottom    : $container.find('.spa-toolbox-cropbottom'), 
      $advert        : $container.find('.spa-toolbox-advert')};
  };
  // End DOM method /setJqueryMap/

  // Begin DOM method /setPxSizes/
  setPxSizes = function () {
    var px_per_em, window_height_em, opened_height_em;

    px_per_em = getEmSize( jqueryMap.$container.get(0) );
    window_height_em = Math.floor(
      ( $(window).height() / px_per_em ) + 0.5
    );

    opened_height_em
      = window_height_em > configMap.window_height_min_em
      ? configMap.toolbox_opened_em
      : configMap.toolbox_opened_min_em;

    stateMap.px_per_em         = px_per_em;
    stateMap.toolbox_closed_px = configMap.toolbox_closed_em * px_per_em;
    stateMap.toolbox_opened_px = opened_height_em * px_per_em;
    // jqueryMap.$container.css({
    //   height : ( opened_height_em - 2 ) * px_per_em
    // });
  };
  // End DOM method /setPxSizes/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin EVENT HANDLER method /onToggleClick/
  onToggleClick = function (){
    console.log("Toggled!");
    var set_toolbox_anchor = configMap.set_toolbox_anchor;
    if ( stateMap.position_type === 'opened' ) {
      set_toolbox_anchor( 'closed' );
    }
    else if ( stateMap.position_type === 'closed' ){
      set_toolbox_anchor( 'opened' );
    }
    return false;
  };
  // End EVENT HANDLER method /onToggleClick/

  // Begin EVENT HANDLER method /onLoadClick/
  onLoadClick = function () {
    console.log("Loading!");
    configMap.on_load();
    return false;
  };
  // End EVENT HANDLER method /onLoadClick/

  // Begin EVENT HANDLER method /onCropClick/
  onCropClick = function () {
    console.log("Cropping!");
    configMap.on_crop();
    return false;
  };
  // End EVENT HANDLER method /onCropClick/

  // Begin EVENT HANDLER method /onSaveClick/
  onSaveClick = function () {
    console.log("Saving!");
    configMap.on_save();
    return false;
  };
  // End EVENT HANDLER method /onSaveClick/

  // Begin EVENT HANDLER method /onCropLimitChange/
  onCropLimitChange = function () {
    console.log("Changing crop limits!");
    var croplimits = {
      top    : jqueryMap.$croptop.val,
      left   : jqueryMap.$cropleft.val,
      right  : jqueryMap.$cropright.val,
      bottom : jqueryMap.$cropbottom.val
    };
    configMap.cropper_model.updateCropLimits(croplimits);
    return false;
  };
  // End EVENT HANDLER method /onCropLimitChange/

  //-------------------- END EVENT HANDLERS --------------------

  // Begin public method /setToolboxPosition/
  // Example   : spa.toolbox.setToolboxPosition( 'closed' );
  // Purpose   : Move the toolbox slider to the requested position
  // Arguments :
  //   * position_type - enum('closed', 'opened', or 'hidden')
  //   * callback - optional callback to be run end at the end
  //     of slider animation.  The callback receives a jQuery
  //     collection representing the toolbox div as its single
  //     argument
  // Action    :
  //   This method moves the toolbox into the requested position.
  //   If the requested position is the current position, it
  //   returns true without taking further action
  // Returns   :
  //   * true  - The requested position was achieved
  //   * false - The requested position was not achieved
  // Throws    : none
  //
  setToolboxPosition = function ( position_type, callback ) {
    var
      height_px, animate_time, toggle_text;

    // return true if slider already in requested position
    if ( stateMap.position_type === position_type ){
      return true;
    }

    // prepare animate parameters
    switch ( position_type ){
      case 'opened' :
        height_px     = stateMap.toolbox_opened_px;
        animate_time  = configMap.toolbox_open_time;
        toggle_text   = '-';
      break;

      case 'hidden' :
        height_px     = 0;
        animate_time  = configMap.toolbox_open_time;
        toggle_text   = '+';
      break;

      case 'closed' :
        height_px     = stateMap.toolbox_closed_px;
        animate_time  = configMap.toolbox_close_time;
        toggle_text   = '+';
      break;

      // bail for unknown position_type
      default : return false;
    }

    // animate toolbox position change
    stateMap.position_type = '';
    jqueryMap.$container.animate(
      { height : height_px },
      animate_time,
      function () {
        jqueryMap.$togglebutton.text( toggle_text );
        stateMap.position_type = position_type;
        if ( callback ) { callback( jqueryMap.$container ); }
      }
    );
    return true;
  };
  // End public DOM method /setToolboxPosition/

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /configModule/
  // Example   : spa.toolbox.configModule({ slider_open_em : 18 });
  // Purpose   : Configure the module prior to initialization
  // Arguments :
  //   * set_toolbox_anchor - a callback to modify the URI anchor to
  //     indicate opened or closed state. This callback must return
  //     false if the requested state cannot be met
  //   * on_load - a callback for the load button
  //   * on_crop - a callback for the crop button
  //   * on_save - a callback for the save button
  //   * cropper_model - the chat model object provides methods
  //       to interact with our instant messaging
  //   * slider_* settings. All these are optional scalars.
  //       See mapConfig.settable_map for a full list
  //       Example: slider_open_em is the open height in em's
  // Action    :
  //   The internal configuration data structure (configMap) is
  //   updated with provided arguments. No other actions are taken.
  // Returns   : true
  // Throws    : JavaScript error object and stack trace on
  //             unacceptable or missing arguments
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
  initModule = function ( $append_target ) {
    stateMap.$append_target = $append_target;
    $append_target.append( configMap.main_html );
    setJqueryMap();
    handleResize();

    // bind user input events
    jqueryMap.$togglebutton.bind('click', onToggleClick);
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

  // Begin public method /handleResize/
  // Purpose    :
  //   Given a window resize event, adjust the presentation
  //   provided by this module if needed
  // Actions    :
  //   If the window height or width falls below
  //   a given threshold, resize the toolbox for the
  //   reduced window size.
  // Returns    : Boolean
  //   * false - resize not considered
  //   * true  - resize considered
  // Throws     : none
  //
  handleResize = function () {
    // don't do anything if we don't have a toolbox container
    if ( ! jqueryMap.$container ) { return false; }

    setPxSizes();
    if ( stateMap.position_type === 'opened' ){
      jqueryMap.$container.css({ height : stateMap.toolbox_opened_px });
      jqueryMap.$togglebutton.text( '-' );
    } else {
      jqueryMap.$container.css({ height : stateMap.toolbox_closed_px });
      jqueryMap.$togglebutton.text( '+' );
    }
    return true;
  };
  // End public method /handleResize/

  // return public methods
  return {
    handleCropLimitChange : handleCropLimitChange,
    handleResize          : handleResize,
    configModule          : configModule,
    setToolboxPosition    : setToolboxPosition,
    initModule            : initModule
  };
  //------------------- END PUBLIC METHODS ---------------------
}());