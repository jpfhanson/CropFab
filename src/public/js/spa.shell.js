/*
 * spa.shell.js
 * Shell module for SPA
 *
 * Ted Morin fyodrpetrovichiv
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */

spa.shell = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      anchor_schema_map : {
        toolbox  : { opened : true, closed : true }
      },
      resize_interval : 200,
      main_html : String()
        + '<div class="spa-shell-menubar"></div>'
        + '<div class="spa-shell-imagelist"></div>'
        // + '<div class="spa-shell-toolbox"></div>'
        // + '<div class="spa-shell-modal"></div>'
    },
    stateMap = {
      $container  : undefined,
      anchor_map  : {},
      resize_idto : undefined
    },
    jqueryMap = {},

    copyAnchorMap,    setJqueryMap,   changeAnchorPart,
    onResize,         onHashchange,
    // onTapAcct,        onLogin,        onLogout,
    setToolboxAnchor,    initModule;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // Returns copy of stored anchor map; minimizes overhead
  copyAnchorMap = function () {
    return $.extend( true, {}, stateMap.anchor_map );
  };
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = {
      $container : $container,
      $menubar : $container.find('.spa-shell-menubar'),
      $imagelist : $container.find('.spa-shell-imagelist'),
      // $toolbox   : $container.find('.spa-shell-toolbox'),
      $footer : $container.find('.spa-shell-footer')
    };
  };
  // End DOM method /setJqueryMap/

  // Begin DOM method /changeAnchorPart/
  // Purpose    : Changes part of the URI anchor component
  // Arguments  :
  //   * arg_map - The map describing what part of the URI anchor
  //     we want changed.
  // Returns    :
  //   * true  - the Anchor portion of the URI was updated
  //   * false - the Anchor portion of the URI could not be updated
  // Actions    :
  //   The current anchor rep stored in stateMap.anchor_map.
  //   See uriAnchor for a discussion of encoding.
  //   This method
  //     * Creates a copy of this map using copyAnchorMap().
  //     * Modifies the key-values using arg_map.
  //     * Manages the distinction between independent
  //       and dependent values in the encoding.
  //     * Attempts to change the URI using uriAnchor.
  //     * Returns true on success, and false on failure.
  //
  changeAnchorPart = function ( arg_map ) {
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return       = true,
      key_name, key_name_dep;

    // Begin merge changes into anchor map
    KEYVAL:
    for ( key_name in arg_map ) {
      if ( arg_map.hasOwnProperty( key_name ) ) {

        // skip dependent keys during iteration
        if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

        // update independent key value
        anchor_map_revise[key_name] = arg_map[key_name];

        // update matching dependent key
        key_name_dep = '_' + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        }
        else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }
    // End merge changes into anchor map

    // Begin attempt to update URI; revert if not successful
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    }
    catch ( error ) {
      // replace URI with existing state
      $.uriAnchor.setAnchor( stateMap.anchor_map,null,true );
      bool_return = false;
    }
    // End attempt to update URI...

    return bool_return;
  };
  // End DOM method /changeAnchorPart/
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin Event handler /onHashchange/
  // Purpose    : Handles the hashchange event
  // Arguments  :
  //   * event - jQuery event object.
  // Settings   : none
  // Returns    : false
  // Actions    :
  //   * Parses the URI anchor component
  //   * Compares proposed application state with current
  //   * Adjust the application only where proposed state
  //     differs from existing and is allowed by anchor schema
  onHashchange = function ( event ) {
    var
      _s_toolbox_previous, _s_toolbox_proposed, s_toolbox_proposed,
      anchor_map_proposed,
      is_ok = true,
      anchor_map_previous = copyAnchorMap();

    // attempt to parse anchor
    try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
    catch ( error ) {
      $.uriAnchor.setAnchor( anchor_map_previous, null, true );
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;

    // convenience vars
    _s_toolbox_previous = anchor_map_previous._s_toolbox;
    _s_toolbox_proposed = anchor_map_proposed._s_toolbox;

    // Begin adjust toolbox component if changed
    if ( ! anchor_map_previous
     || _s_toolbox_previous !== _s_toolbox_proposed
    ) {
      s_toolbox_proposed = anchor_map_proposed.toolbox;
      switch ( s_toolbox_proposed ) {
        case 'opened' :
          is_ok = spa.toolbox.setToolboxPosition( 'opened' );
        break;
        case 'closed' :
          is_ok = spa.toolbox.setToolboxPosition( 'closed' );
        break;
        default :
          spa.toolbox.setToolboxPosition( 'closed' );
          delete anchor_map_proposed.toolbox;
          $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
    // End adjust toolbox component if changed

    // Begin revert anchor if toolbox change denied
    if ( ! is_ok ) {
      if ( anchor_map_previous ) {
        $.uriAnchor.setAnchor( anchor_map_previous, null, true );
        stateMap.anchor_map = anchor_map_previous;
      }
      else {
        delete anchor_map_proposed.toolbox;
        $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
    // End revert anchor if toolbox change denied

    return false;
  };
  // End Event handler /onHashchange/

  // Begin Event handler /onResize/
  onResize = function () {
    if ( stateMap.resize_idto ) { return true; }

    // spa.menubar.handleResize();
    // spa.imagelist.handleResize();
    // spa.toolbox.handleResize();
    // spa.footer.handleResize();
    stateMap.resize_idto = setTimeout(
      function () { stateMap.resize_idto = undefined; },
      configMap.resize_interval
    );

    return true;
  };
  // End Event handler /onResize/

  //-------------------- END EVENT HANDLERS --------------------

  // ---------------------- BEGIN CALLBACKS ---------------------
  // Begin callback method /setToolboxAnchor/
  // Example  : setToolboxAnchor( 'closed' );
  // Purpose  : Change the toolbox component of the anchor
  // Arguments:
  //   * position_type - may be 'closed' or 'opened'
  // Action   :
  //   Changes the URI anchor parameter 'toolbox' to the requested
  //   value if possible.
  // Returns  :
  //   * true  - requested anchor part was updated
  //   * false - requested anchor part was not updated
  // Throws   : none
  //
  setToolboxAnchor = function ( position_type ) {
    return changeAnchorPart({ toolbox : position_type });
  };
  // End callback method /setToolboxAnchor/
  // ----------------------- END CALLBACKS ----------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Public method /initModule/
  // Example   : spa.shell.initModule( $('#app_div_id') );
  // Purpose   :
  //   Directs the Shell to offer its capability to the user
  // Arguments :
  //   * $container (example: $('#app_div_id')).
  //     A jQuery collection that should represent 
  //     a single DOM container
  // Action    :
  //   Populates $container with the shell of the UI
  //   and then configures and initializes feature modules.
  //   The Shell is also responsible for browser-wide issues
  //   such as URI anchor and cookie management
  // Returns   : none 
  // Throws    : none
  //
  initModule = function ( $container ) {
    // load HTML and map jQuery collections
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();

    // configure uriAnchor to use our schema
    $.uriAnchor.configModule({
      schema_map : configMap.anchor_schema_map
    });

    // spa.menubar.configModule({
    //   toolbox_model   : spa.model.toolbox,
    //   people_model : spa.model.people
    // });
    spa.menubar.initModule( jqueryMap.$menubar );

    // configure and initialize feature modules
    // spa.imagelist.configModule({
    //   set_toolbox_anchor : setToolboxAnchor,
    //   toolbox_model      : spa.model.toolbox,
    //   people_model    : spa.model.people
    // });
    spa.imagelist.initModule( jqueryMap.$imagelist );

    // configure and initialize feature modules
    spa.toolbox.configModule({

      set_toolbox_anchor   : setToolboxAnchor,
      on_load              : console.log,
      on_crop              : console.log,
      on_save              : console.log,
      cropper_model        : console.log
    });
    spa.toolbox.initModule( jqueryMap.$container );

    spa.footer.initModule( jqueryMap.$container );

    // Handle URI anchor change events.
    // This is done /after/ all feature modules are configured
    // and initialized, otherwise they will not be ready to handle
    // the trigger event, which is used to ensure the anchor
    // is considered on-load
    //
    $(window)
      .bind( 'resize',     onResize )
      .bind( 'hashchange', onHashchange )
      .trigger( 'hashchange' );
  };
  // End PUBLIC method /initModule/

  return { initModule : initModule };
  //------------------- END PUBLIC METHODS ---------------------
}());
