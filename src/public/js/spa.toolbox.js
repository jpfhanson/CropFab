/*
 * spa.toolbox.js
 * A module to control the toolbox in CROPFAB
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

classes.toolbox = class {
  // constructor method for the toolbox
  constructor () {
    this.configMap = {
      main_html : String()
        + '<div class="spa-toolbox">'
          + '<button class="spa-toolbox-togglebutton">'
          + '<b>-</b></button>'
          + '<button class="spa-toolbox-loadbutton">'
            + 'Load</button>'
          + '<input type="file" class="spa-toolbox-load" '
            + 'accept="image/*" multiple />'
          + '<button class="spa-toolbox-savebutton">'
          + 'Save</button>'
          + '<form class="spa-toolbox-inputs">'
          + '</form>'
          + '<div class="spa-toolbox-advert"></div>'
        + '</div>',
      filename_html : String()
        + '<div class="spa-toolbox-inputgroup">'
          + '<div>'
            + '<input type="text" value="%n_cropped.jpeg" '
              + 'class="spa-toolbox-filename" />'
            + '<div class="spa-toolbox-filename-title">'
              + ' Filename</div>'
          + '</div>'
          + '<div>'
            + '<div>(%n = source,</div>'
            + '<div>   %d = id num)</div>'
          + '</div>'
        + '</div>',
      max_dimensions_html : String()
        + '<div class="spa-toolbox-inputgroup">'
          + '<div>'
            + '<input type="number" '
              + 'class="spa-toolbox-max-width" disabled />'
            + '<div class="spa-toolbox-max-width-title">'
              + ' Greatest Width </div>'
          + '</div>'
          + '<div>'
            + '<input type="number" '
              + 'class="spa-toolbox-max-height" disabled />'
            + '<div class="spa-toolbox-max-height-title">'
              + ' Greatest Height </div>'
          + '</div>'
        + '</div>',
      crop_dimensions_html : String()
        + '<div class="spa-toolbox-inputgroup">'
          + '<div>'
            + '<div class="hovertext">Click Title to Lock All!</div>'
            + '<input type="number" '
              + ' class="spa-toolbox-crop-width" />'
            + '<div class="spa-toolbox-crop-width-title">'
              + ' Global Crop Width </div>'
          + '</div>'
          + '<div>'
            + '<div class="hovertext">Click Title to Lock All!</div>'
            + '<input type="number" '
              + 'class="spa-toolbox-crop-height" />'
            + '<div class="spa-toolbox-crop-height-title">'
              + ' Global Crop Height </div>'
          + '</div>'
        + '</div>',
      crop_offset_html : String()
        + '<div class="spa-toolbox-inputgroup">'
          + '<div>'
            + '<div class="hovertext">Click Title to Lock All!</div>'
            + '<input type="number" class="spa-toolbox-x" />'
            + '<div class="spa-toolbox-x-title">'
              + ' Global Crop X Offset </div>'
          + '</div>'
          + '<div>'
            + '<div class="hovertext">Click Title to Lock All!</div>'
            + '<input type="number" class="spa-toolbox-y" />'
            + '<div class="spa-toolbox-y-title">'
              + ' Global Crop Y Offset </div>'
          + '</div>'
        + '</div>',
      aspect_prescale_html : String()
        + '<div class="spa-toolbox-inputgroup">'
          + '<div>'
            + '<div class="hovertext">Click Title to Lock All!</div>'
            + '<input type="checkbox" '
              + 'class="spa-toolbox-aspect" />'
            + '<div class="spa-toolbox-aspect-title">'
              + ' Global Aspect Ratio </div>'
          + '</div>'
          + '<div>'
            + '<div class="hovertext">Click Title to Lock All!</div>'
            + '<span class="spa-toolbox-percent">'
              + '<input type="number" class="spa-toolbox-prescale" />%</span>'
            + '<div class="spa-toolbox-prescale-title">'
              + ' Global Prescale </div>'
          + '</div>'
        + '</div>',
      advert_text : 'YOUR AD HERE\nCONTACT\nads (at) TBD.com',
      settable_map : {
        toolbox_open_time    : true,
        toolbox_close_time   : true,
        toolbox_opened_em    : true,
        toolbox_closed_em    : true,

        set_toolbox_anchor   : true,
        on_load              : true,
        on_save              : true,
        on_input_change      : true,
        lock_all             : true,
        update_config        : true,

        advert_text          : true
      },

      toolbox_open_time     : 250,
      toolbox_close_time    : 250,
      toolbox_opened_em     : 25,
      toolbox_closed_em     : 2,
      toolbox_opened_min_em : 10,
      window_height_min_em  : 20,

      set_toolbox_anchor   : null,
      on_load              : null,
      on_save              : null,
      on_input_change      : null,
      lock_all             : null,
      update_config        : null
    };
    this.stateMap  = {
      $append_target    : null,
      position_type     : 'closed',
      px_per_em         : 0,
      toolbox_hidden_px : 0,
      toolbox_closed_px : 0,
      toolbox_opened_px : 0,
      image_selecteed   : null,
    };
    this.jqueryMap = {};
  }
    // handleCropLimitChange : handleCropLimitChange,
    // handleResize          : handleResize,
    // configModule          : configModule,
    // setToolboxPosition    : setToolboxPosition,
    // initModule            : initModule

  //----------------- BEGIN MODULE SCOPE METHODS ----------------
    // setJqueryMap, getEmSize, setPxSizes, setToolboxPosition,
    // onToggleClick, onLoadClick, onSaveClick,
    // onCropWidthChange, onCropHeightChange, handleCropLimitChange,
    // configModule, initModule, handleResize;
  //------------------ END MODULE SCOPE METHODS -----------------

  //------------------- BEGIN UTILITY METHODS ------------------
  getEmSize( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  }
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap() {
    var
      $append_target = this.stateMap.$append_target,
      $container     = $append_target.find( '.spa-toolbox' );

    this.jqueryMap = { 
      // controls
      $container     : $container,
      $togglebutton  : $container.find('.spa-toolbox-togglebutton'),
      $loadbutton    : $container.find('.spa-toolbox-loadbutton'),
      $load          : $container.find('.spa-toolbox-load'),
      $savebutton    : $container.find('.spa-toolbox-savebutton'),
      $inputs        : $container.find('.spa-toolbox-inputs'),

      // inputs
      $filename       : $container.find('.spa-toolbox-filename'),
      $max_width      : $container.find('.spa-toolbox-max-width'),
      $max_height     : $container.find('.spa-toolbox-max-height'),
      $crop_width     : $container.find('.spa-toolbox-crop-width'),
      $crop_height    : $container.find('.spa-toolbox-crop-height'),
      $x_offset       : $container.find('.spa-toolbox-x'),
      $y_offset       : $container.find('.spa-toolbox-y'),
      $aspect_ratio   : $container.find('.spa-toolbox-aspect'),
      $prescale       : $container.find('.spa-toolbox-prescale'),

      // titles
      $filename_title       : $container.find('.spa-toolbox-filename-title'),
      $max_width_title      : $container.find('.spa-toolbox-max-width-title'),
      $max_height_title     : $container.find('.spa-toolbox-max-height-title'),
      $crop_width_title     : $container.find('.spa-toolbox-crop-width-title'),
      $crop_height_title    : $container.find('.spa-toolbox-crop-height-title'),
      $x_offset_title       : $container.find('.spa-toolbox-x-title'),
      $y_offset_title       : $container.find('.spa-toolbox-y-title'),
      $aspect_ratio_title   : $container.find('.spa-toolbox-aspect-title'),
      $prescale_title       : $container.find('.spa-toolbox-prescale-title'),

      $advert         : $container.find('.spa-toolbox-advert')};
  }
  // End DOM method /setJqueryMap/

  // Begin DOM method /setPxSizes/
  setPxSizes() {
    var px_per_em, window_height_em, opened_height_em;

    px_per_em = this.getEmSize( this.jqueryMap.$container.get(0) );
    window_height_em = Math.floor(
      ( $(window).height() / px_per_em ) + 0.5
    );

    opened_height_em
      = window_height_em > this.configMap.window_height_min_em
      ? this.configMap.toolbox_opened_em
      : this.configMap.toolbox_opened_min_em;

    this.stateMap.px_per_em         = px_per_em;
    this.stateMap.toolbox_closed_px = this.configMap.toolbox_closed_em * px_per_em;
    this.stateMap.toolbox_opened_px = opened_height_em * px_per_em;
    // jqueryMap.$container.css({
    //   height : ( opened_height_em - 2 ) * px_per_em
    // });
  }
  // End DOM method /setPxSizes/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin EVENT HANDLER method /onToggleClick/
  onToggleClick(){
    console.log("Toggled!");
    var set_toolbox_anchor = this.configMap.set_toolbox_anchor;
    if ( this.stateMap.position_type === 'opened' ) {
      set_toolbox_anchor( 'closed' );
    }
    else if ( this.stateMap.position_type === 'closed' ){
      set_toolbox_anchor( 'opened' );
    }
    return false;
  }
  // End EVENT HANDLER method /onToggleClick/

  // Begin EVENT HANDLER method /onLoadClick/
  onLoadClick() {
    console.log("Toolbox Load Button Clicked!");
    this.jqueryMap.$load.click();
    return false;
  }
  // End EVENT HANDLER method /onLoadClick/

  // Begin EVENT HANDLER method /onLoadChange/
  onLoadChange() {
    console.log("Images loading!");
    this.configMap.on_load(this.jqueryMap.$load.get(0).files);
    return false;
  }
  // End EVENT HANDLER method /onLoadChange/

  // Begin EVENT HANDLER method /onSaveClick/
  onSaveClick() {
    console.log("Saving!");
    this.configMap.on_save();
    return false;
  }
  // End EVENT HANDLER method /onSaveClick/

  // Begin EVENT HANDLER method /onTitleClick/input
  onTitleClick(input_type) {
    console.log("Locking all " +input_type+ " inputs!");
    this.configMap.lock_all(input_type);
    return false;
  }
  // End EVENT HANDLER method /onTitleClick/input
   
  // Begin EVENT HANDLER method /onCropSizeChange/
  onCropSizeChange() {
    console.log("Changing crop dimensions!");
    this.configMap.cropper_model.changeCropSize(
            this.jqueryMap.$crop_width.get(0).value,
            this.jqueryMap.$crop_height.get(0).value);
    return false;
  }
  // End EVENT HANDLER method /onCropSizeChange/
   
  // Begin EVENT HANDLER method /onInputChange/
  onInputChange() {
    console.log("Changing inputs!");
    let config = new classes.OpConfig(
      this.jqueryMap.$filename.val(),
      Math.floor(this.jqueryMap.$max_width.val()),
      Math.floor(this.jqueryMap.$max_height.val()),
      Math.floor(this.jqueryMap.$x_offset.val()),
      Math.floor(this.jqueryMap.$y_offset.val()),
      Math.floor(this.jqueryMap.$crop_width.val()),
      Math.floor(this.jqueryMap.$crop_height.val()),
      Number(this.jqueryMap.$prescale.val())/100,
      // this.jqueryMap.$aspect_ratio.val(),
    );
    this.configMap.on_input_change(config);
    return false;
  }
  // End EVENT HANDLER method /onInputChange/

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
  setToolboxPosition( position_type, callback ) {
    var
      height_px, animate_time, toggle_text;

    // return true if slider already in requested position
    if ( this.stateMap.position_type === position_type ){
      return true;
    }

    // prepare animate parameters
    switch ( position_type ){
      case 'opened' :
        height_px     = this.stateMap.toolbox_opened_px;
        animate_time  = this.configMap.toolbox_open_time;
        toggle_text   = '-';
      break;

      case 'hidden' :
        height_px     = 0;
        animate_time  = this.configMap.toolbox_open_time;
        toggle_text   = '+';
      break;

      case 'closed' :
        height_px     = this.stateMap.toolbox_closed_px;
        animate_time  = this.configMap.toolbox_close_time;
        toggle_text   = '+';
      break;

      // bail for unknown position_type
      default : return false;
    }

    // animate toolbox position change
    this.stateMap.position_type = '';
    this.jqueryMap.$container.animate(
      { height : height_px },
      animate_time,
      () => {
        this.jqueryMap.$togglebutton.text( toggle_text );
        this.stateMap.position_type = position_type;
        if ( callback ) { callback( this.jqueryMap.$container ); }
      }
    );
    return true;
  }
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
  configModule( input_map ) {
    spa.util.setConfigMap({
      input_map    : input_map,
      settable_map : this.configMap.settable_map,
      config_map   : this.configMap
    });
    return true;
  }
  // End public method /configModule/

  // Begin public method /updateConfig/
  // Purpose    : Sets the inputs to reflect the model
  // Arguments  : config
  // Returns    : none
  // Throws     : none
  updateConfig(config) {
    this.jqueryMap.$max_width.val(config.mainCanvasWidth);
    this.jqueryMap.$max_height.val(config.mainCanvasHeight);
    this.jqueryMap.$crop_width.val(config.cropWidth);
    this.jqueryMap.$crop_height.val(config.cropHeight);
    this.jqueryMap.$x_offset.val(config.cropLeft);
    this.jqueryMap.$y_offset.val(config.cropTop);
    this.jqueryMap.$prescale.val(config.scale*100);
  }
  // End public method /setCropSize/

  // Begin public method /updateInputs/
  // Purpose    : Sets the inputs to reflect the model state
  // Arguments  : valueMap - map of the values for the form
  //   * useable keys:
  //         max_width      max_height
  //         crop_width     crop_height
  //         x_offset       y_offset
  //         aspect_ratio   prescale     filename
  // Returns    : true
  // Throws     : none
  updateInputs( valueMap ) {
    if ( 'max_width' in valueMap ){
      this.jqueryMap.$max_width.val(valueMap.max_width);}
    if ( 'max_height' in valueMap ){
      this.jqueryMap.$max_height.val(valueMap.max_height);}
    if ( 'crop_width' in valueMap ){
      this.jqueryMap.$crop_width.val(valueMap.crop_width);}
    if ( 'crop_height' in valueMap ){
      this.jqueryMap.$crop_height.val(valueMap.crop_height);}
    if ( 'x_offset' in valueMap ){
      this.jqueryMap.$x_offset.val(valueMap.x_offset);}
    if ( 'y_offset' in valueMap ){
      this.jqueryMap.$y_offset.val(valueMap.y_offset);}
    if ( 'aspect_ratio' in valueMap ){
      this.jqueryMap.$aspect_ratio.val(valueMap.aspect_ratio);}
    if ( 'scale' in valueMap ){
      this.jqueryMap.$prescale.val(100*valueMap.scale);}
    if ( 'filename' in valueMap ){
      this.jqueryMap.$filename.val(valueMap.filename);}
    return true;
  }
  // End public method /updateInputs/

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * $append_target the jquery element to which toolbox will be added
  // Returns    : true
  // Throws     : none
  //
  initModule( $append_target ) {
    this.stateMap.$append_target = $append_target;
    $append_target.append( this.configMap.main_html );
    $append_target.find('.spa-toolbox-inputs').html(
      this.configMap.filename_html +
      this.configMap.max_dimensions_html +
      this.configMap.crop_dimensions_html +
      this.configMap.crop_offset_html +
      this.configMap.aspect_prescale_html);
    this.setJqueryMap();
    this.jqueryMap.$advert.text(this.configMap.advert_text);
    this.handleResize();

    // bind user input events
    this.jqueryMap.$togglebutton.bind('click', 
      () => {this.onToggleClick();});
    this.jqueryMap.$loadbutton.bind('click', 
      () => {this.onLoadClick();});
    this.jqueryMap.$load.bind('change', 
      () => {this.onLoadChange();});
    this.jqueryMap.$savebutton.bind('click', 
      () => {this.onSaveClick();});

    this.jqueryMap.$filename_title.bind('click',
      () => {this.onTitleClick('filename');});
    this.jqueryMap.$crop_width_title.bind('click',
      () => {this.onTitleClick('crop_width');});
    this.jqueryMap.$crop_height_title.bind('click',
      () => {this.onTitleClick('crop_height');});
    this.jqueryMap.$x_offset_title.bind('click',
      () => {this.onTitleClick('x_offset');});
    this.jqueryMap.$y_offset_title.bind('click',
      () => {this.onTitleClick('y_offset');});
    this.jqueryMap.$aspect_ratio_title.bind('click',
      () => {this.onTitleClick('aspect_ratio');});
    this.jqueryMap.$prescale_title.bind('click',
      () => {this.onTitleClick('prescale');});

    this.jqueryMap.$inputs.bind('change',
      () => {this.onInputChange();});
    this.jqueryMap.$filename.bind('change',
      () => {this.onInputChange();});
    return true;
  }
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
  handleResize() {
    // don't do anything if we don't have a toolbox container
    if ( ! this.jqueryMap.$container ) { return false; }

    this.setPxSizes();
    if ( this.stateMap.position_type === 'opened' ){
      this.jqueryMap.$container.css({ height : this.stateMap.toolbox_opened_px });
      this.jqueryMap.$togglebutton.text( '-' );
    } else {
      this.jqueryMap.$container.css({ height : this.stateMap.toolbox_closed_px });
      this.jqueryMap.$togglebutton.text( '+' );
    }
    return true;
  }
  // End public method /handleResize/
  //------------------- END PUBLIC METHODS ---------------------
};

spa.toolbox = new classes.toolbox();
