/*
 * spa.shell.js
 * Shell module for SPA
 *
 * Ted Morin fyodrpetrovichiv
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

classes.shell = class {
  // 'use strict';
  constructor() {
    this.configMap = {
      anchor_schema_map : {
        toolbox  : { opened : true, closed : true }
      },
      resize_interval : 200,
      main_html : String()
        + '<div class="spa-shell-menubar"></div>'
        + '<div class="spa-shell-imagelist"></div>'
    };
    this.stateMap = {
      $container  : undefined,
      anchor_map  : {},
      resize_idto : undefined
    };
    this.jqueryMap = {};
  }
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    // copyAnchorMap,    setJqueryMap,   changeAnchorPart,
    // onResize,         onHashchange,
    // // onTapAcct,        onLogin,        onLogout,
    // setToolboxAnchor, loadImages,  handleImageLoad,  initModule;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // Returns copy of stored anchor map; minimizes overhead
  copyAnchorMap() {
    return $.extend( true, {}, this.stateMap.anchor_map );
  }
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap() {
    var $container = this.stateMap.$container;

    this.jqueryMap = {
      $container : $container,
      $menubar : $container.find('.spa-shell-menubar'),
      $imagelist : $container.find('.spa-shell-imagelist'),
      // $toolbox   : $container.find('.spa-shell-toolbox'),
      $footer : $container.find('.spa-shell-footer')
    };
  }
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
  changeAnchorPart( arg_map ) {
    var
      anchor_map_revise = this.copyAnchorMap(),
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
      $.uriAnchor.setAnchor( this.stateMap.anchor_map,null,true );
      bool_return = false;
    }
    // End attempt to update URI...

    return bool_return;
  }
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
  onHashchange( event ) {
    var
      _s_toolbox_previous, _s_toolbox_proposed, s_toolbox_proposed,
      anchor_map_proposed,
      is_ok = true,
      anchor_map_previous = this.copyAnchorMap();

    // attempt to parse anchor
    try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
    catch ( error ) {
      $.uriAnchor.setAnchor( anchor_map_previous, null, true );
      return false;
    }
    this.stateMap.anchor_map = anchor_map_proposed;

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
        this.stateMap.anchor_map = anchor_map_previous;
      }
      else {
        delete anchor_map_proposed.toolbox;
        $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
    // End revert anchor if toolbox change denied

    return false;
  }
  // End Event handler /onHashchange/

  // Begin Event handler /onResize/
  onResize() {
    if ( this.stateMap.resize_idto ) { return true; }

    // spa.menubar.handleResize();
    // spa.imagelist.handleResize();
    // spa.toolbox.handleResize();
    // spa.footer.handleResize();
    this.stateMap.resize_idto = setTimeout(() => { 
      this.stateMap.resize_idto = undefined; },
      configMap.resize_interval
    );

    return true;
  }
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
  setToolboxAnchor( position_type ) {
    return this.changeAnchorPart({ toolbox : position_type });
  }
  // End callback method /setToolboxAnchor/

  // Begin callback method /loadImages/
  // Purpose    : function called WHENEVER images should be loaded
  // Arguments  :
  //   * input - whatever the file input gives on change
  // Returns    : Boolean
  //   * true  - image(s) were loaded
  //   * false - image(s) were not loaded
  // Throws     : none
  //
  loadImages(input) {
    // load images via backend
    // shellcallback on image load is spa.shell.onImageLoad
    spa.imagecolumn.loadImages(input);

    // tell loaderbox that images are being loaded
    spa.loaderbox.handleLoad();
  }
  // End callback method /loadImages/


  // Begin callback method /handleImageLoad/
  // Purpose    : function called WHENEVER image has been loaded
  // Arguments  :
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  handleImageLoad(imagebox_back) {
    // pass the newly made made imagebox backend to a new imagebox
    var imagebox = spa.imagelist.addImagebox(
      imagebox_back,
      {} // settingMap
    );

    // maybe do something with the new imagebox?
    console.log("image added: id = " + imagebox.stateMap.id);

    return true;
  }
  // End callback method /handleImageLoad/
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
  initModule( $container ) {
    // load HTML and map jQuery collections
    this.stateMap.$container = $container;
    $container.html( this.configMap.main_html );
    this.setJqueryMap();

    // configure uriAnchor to use our schema
    $.uriAnchor.configModule({
      schema_map : this.configMap.anchor_schema_map
    });

    // configure and initialize feature modules
    // spa.menubar.configModule({
    //   toolbox_model   : spa.model.toolbox,
    //   people_model : spa.model.people
    // });
    spa.menubar.initModule( this.jqueryMap.$menubar );

    spa.imagelist.configModule({
      cropper_model   : spa.model,
      on_load         : () => {this.loadImages();},
      on_drop         : () => {this.handleImageLoad();} 
                                        // ted: purely to shut up jslint
                                        // ted: find a better solution!
    });
    spa.imagelist.initModule( this.jqueryMap.$imagelist );

    // configure and initialize feature modules
    spa.toolbox.configModule({
      set_toolbox_anchor   : (position) => {this.setToolboxAnchor(position);},
      on_load              : () => {this.loadImages();}, // fix this
      on_crop              : console.log,
      on_save              : console.log,
      cropper_model        : console.log
    });
    spa.toolbox.initModule( this.jqueryMap.$container );

    spa.footer.initModule( this.jqueryMap.$container );

    // Handle URI anchor change events.
    // This is done /after/ all feature modules are configured
    // and initialized, otherwise they will not be ready to handle
    // the trigger event, which is used to ensure the anchor
    // is considered on-load
    //
    $(window)
      .bind( 'resize',     () => {this.onResize();} )
      .bind( 'hashchange', () => {this.onHashchange();} )
      .trigger( 'hashchange' );
  }
  //------------------- END PUBLIC METHODS ---------------------
};

spa.shell = new classes.shell();
