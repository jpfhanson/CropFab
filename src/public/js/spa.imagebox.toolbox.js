/*
 * spa.imagebox.toolbox.js
 * module to control imagebox toolbox features in CropFab
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

spa.imagebox.toolbox = class {

  // Begin constructor
  // Purpose    : Create an imagebox toolbox object.
  // Arguments  :
  //  * $imagebox  - the master imagelist in charge of this imagebox
  //  * backend    - the imagebox model that will provide data
  //  * settingMap - any additional settings for the imagebox
  // Returns    : the imagebox toolbox object
  // Throws     : none
  constructor( $imagebox, backend, settingMap ) {
    this.configMap = {
      settable_map : {
        // settables - TODO
      },
      // settables - TODO
      main_html : String()
        + '<div class="spa-imagebox-toolbox">'
          + '<div class="spa-imagebox-toolbox-top">'
            + '<span class="spa-imagebox-toolbox-orig-filename-title">Source: </span>'
            + '<input type="text" '
              + 'class="spa-imagebox-toolbox-orig-filename" disabled />'
            + '<span class="spa-imagebox-toolbox-crop-filename-title">Destination:</span>'
            + '<input type="text" '
              + 'class="spa-imagebox-toolbox-crop-filename" disabled />'
            + '<input type="button" '
              + 'class="spa-imagebox-toolbox-toggle" />'
            + '<input type="button" value="Remove Image"'
              + 'class="spa-imagebox-toolbox-remove" />'
          + '</div><br/>'
          + '<form class="spa-imagebox-toolbox-bottom">'
          + '</form>'
        + '</div>',
      prescale_html : String()
        + '<div class="spa-imagebox-toolbox-inputgroup">'
          + '<div>'
            + '<span class="spa-toolbox-percent">'
              + '<input type="number" class="spa-imagebox-toolbox-prescale" disabled />%</span>'
            + '<div '
              + 'class="spa-imagebox-toolbox-prescale-title"> Prescale </div>'
              + '<div class="hovertext">Click Title to Toggle!"></div>'
          + '</div>'
          + '<div>'
            + '<input type="button" value="Save"'
              + 'class="spa-imagebox-toolbox-save" />'
            + '<div '
              + 'class="spa-imagebox-toolbox-save-title"> Save Image </div>'
          + '</div>'
        + '</div>',
      orig_dimensions_html : String()
        + '<div class="spa-imagebox-toolbox-inputgroup">'
          + '<div>'
            + '<input type="number" '
              + 'class="spa-imagebox-toolbox-orig-width" disabled />'
            + '<div '
              + 'class="spa-imagebox-toolbox-orig-width-title"> Original Width </div>'
          + '</div>'
          + '<div>'
            + '<input type="number" '
              + 'class="spa-imagebox-toolbox-orig-height" disabled />'
            + '<div '
              + 'class="spa-imagebox-toolbox-orig-height-title"> Original Height </div>'
          + '</div>'
        + '</div>',
      crop_dimensions_html : String()
        + '<div class="spa-imagebox-toolbox-inputgroup">'
          + '<div>'
            + '<input type="number" '
              + ' class="spa-imagebox-toolbox-crop-width" disabled />'
            + '<div '
              + 'class="spa-imagebox-toolbox-crop-width-title"> Crop Width </div>'
            + '<div class="hovertext">Click Title to Toggle!</div>'
          + '</div>'
          + '<div>'
            + '<input type="number" '
              + 'class="spa-imagebox-toolbox-crop-height" disabled />'
            + '<div '
              + 'class="spa-imagebox-toolbox-crop-height-title"> Crop Height </div>'
            + '<div class="hovertext">Click Title to Toggle!</div>'
          + '</div>'
        + '</div>',
      crop_offset_html : String()
        + '<div class="spa-imagebox-toolbox-inputgroup">'
          + '<div>'
            + '<input type="number" class="spa-imagebox-toolbox-x" disabled />'
            + '<div '
              + 'class="spa-imagebox-toolbox-x-title"> Crop X Offset </div>'
            + '<div class="hovertext">Click Title to Toggle!</div>'
          + '</div>'
          + '<div>'
            + '<input type="number" class="spa-imagebox-toolbox-y" disabled />'
            + '<div '
              + 'class="spa-imagebox-toolbox-y-title"> Crop Y Offset </div>'
            + '<div class="hovertext">Click Title to Toggle!</div>'
          + '</div>'
        + '</div>',
      aspect_ratio_html : String()
        + '<div class="spa-imagebox-toolbox-inputgroup">'
          + '<div>'
            + '<input type="number" '
              + 'class="spa-imagebox-toolbox-orig-aspect" disabled/>'
            + '<div '
              + 'class="spa-imagebox-toolbox-orig-aspect-title"> Original Aspect Ratio</div>'
            + '<div class="hovertext">Click Title to Toggle!</div>'
          + '</div>'
          + '<div>'
            + '<input type="checkbox" '
              + 'class="spa-imagebox-toolbox-crop-aspect" disabled />'
            + '<div '
              + 'class="spa-imagebox-toolbox-crop-aspect-title"> Cropped Aspect Ratio</div>'
            + '<div class="hovertext">Click Title to Toggle!</div>'
          + '</div>'
        + '</div>',
      toggle_text_visible : 'Hide Menu',
      toggle_text_invisible : 'Show Menu',
    };
    this.stateMap  = {
      $imagebox       : $imagebox,
      backend         : backend,
      toolbox_visible : false,
    };
    this.jqueryMap = {};

    // create the html
    $imagebox.prepend(this.configMap.main_html);
    $imagebox.find('.spa-imagebox-toolbox-bottom').html(
      this.configMap.prescale_html +
      this.configMap.orig_dimensions_html +
      this.configMap.crop_dimensions_html +
      this.configMap.crop_offset_html +
      this.configMap.aspect_ratio_html);

    this.setJqueryMap();

    // apply settings
    console.log("Implement settingMap usage, TODO: " + settingMap);
    this.jqueryMap.$toggle.val(this.configMap.toggle_text_invisible);

    // initial values from backend
    this.setConfig(backend);

    // bind callbacks
    this.jqueryMap.$toggle.on('click',
      () => {this.toggleToolbox();});
    this.jqueryMap.$remove.on('click',
      () => {this.remove();});
    this.jqueryMap.$save.on('click',
      () => {this.save();});
    this.jqueryMap.$crop_filename.on('change',
      () => {this.onInputChange();});
    this.jqueryMap.$inputs.on('change',
      () => {this.onInputChange();});

    this.jqueryMap.$prescale_title.on('click',
      () => {this.onTitleClick("prescale");});
    this.jqueryMap.$crop_filename_title.on('click',
      () => {this.onTitleClick("crop_filename");});
    this.jqueryMap.$crop_width_title.on('click',
      () => {this.onTitleClick("crop_width");});
    this.jqueryMap.$crop_height_title.on('click',
      () => {this.onTitleClick("crop_height");});
    this.jqueryMap.$x_offset_title.on('click',
      () => {this.onTitleClick("x_offset");});
    this.jqueryMap.$y_offset_title.on('click',
      () => {this.onTitleClick("y_offset");});
    this.jqueryMap.$crop_aspect_title.on('click',
      () => {this.onTitleClick("crop_aspect");});
  }
  // End /constructor/

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    // getEmSize, setPxSizes, 
    // // setJqueryMap, 
    // configModule, makeImagebox;
  //----------------- END MODULE SCOPE VARIABLES ---------------

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
    var $imagebox = this.stateMap.$imagebox;

    this.jqueryMap = { 
      $imagebox      : $imagebox,
      $container     : $imagebox.find('.spa-imagebox-toolbox'),
      $top           : $imagebox.find('.spa-imagebox-toolbox-top'),
      $toggle        : $imagebox.find('.spa-imagebox-toolbox-toggle'),
      $remove        : $imagebox.find('.spa-imagebox-toolbox-remove'),
      $inputs        : $imagebox.find('.spa-imagebox-toolbox-bottom'),

      $prescale      : $imagebox.find('.spa-imagebox-toolbox-prescale'),
      $save          : $imagebox.find('.spa-imagebox-toolbox-save'),
      $orig_filename : $imagebox.find('.spa-imagebox-toolbox-orig-filename'),
      $crop_filename : $imagebox.find('.spa-imagebox-toolbox-crop-filename'),
      $orig_width    : $imagebox.find('.spa-imagebox-toolbox-orig-width'),
      $orig_height   : $imagebox.find('.spa-imagebox-toolbox-orig-height'),
      $crop_width    : $imagebox.find('.spa-imagebox-toolbox-crop-width'),
      $crop_height   : $imagebox.find('.spa-imagebox-toolbox-crop-height'),
      $x_offset      : $imagebox.find('.spa-imagebox-toolbox-x'),
      $y_offset      : $imagebox.find('.spa-imagebox-toolbox-y'),
      $orig_aspect   : $imagebox.find('.spa-imagebox-toolbox-orig-aspect'),
      $crop_aspect   : $imagebox.find('.spa-imagebox-toolbox-crop-aspect'),

      $prescale_title      : $imagebox.find('.spa-imagebox-toolbox-prescale-title'),
      $save_title          : $imagebox.find('.spa-imagebox-toolbox-save-title'),
      $orig_filename_title : $imagebox.find('.spa-imagebox-toolbox-orig-filename-title'),
      $crop_filename_title : $imagebox.find('.spa-imagebox-toolbox-crop-filename-title'),
      $orig_width_title    : $imagebox.find('.spa-imagebox-toolbox-orig-width-title'),
      $orig_height_title   : $imagebox.find('.spa-imagebox-toolbox-orig-height-title'),
      $crop_width_title    : $imagebox.find('.spa-imagebox-toolbox-crop-width-title'),
      $crop_height_title   : $imagebox.find('.spa-imagebox-toolbox-crop-height-title'),
      $x_offset_title      : $imagebox.find('.spa-imagebox-toolbox-x-title'),
      $y_offset_title      : $imagebox.find('.spa-imagebox-toolbox-y-title'),
      $orig_aspect_title   : $imagebox.find('.spa-imagebox-toolbox-orig-aspect-title'),
      $crop_aspect_title   : $imagebox.find('.spa-imagebox-toolbox-crop-aspect-title'),
    };
  }
  // End DOM method /setJqueryMap/

  // Begin DOM method /setPxSizes/
  setPxSizes() {
    var px_per_em = this.getEmSize( this.jqueryMap.$container.get(0) );

    this.stateMap.px_per_em     = px_per_em;
    this.stateMap.box_height_px = this.configMap.box_height_em * px_per_em;
    this.stateMap.box_height_px = this.configMap.box_height_em * px_per_em;
  }
  // End DOM method /setPxSizes/

  // Begin DOM/EVENT HANDLER method /toggleToolbox/
  // Example   : spa.imagebox.toolbox.toggleToolbox();
  // Purpose   : Lock or unlock imagebox
  // Returns   : false
  // Throws    : none
  toggleToolbox() {
    if (this.stateMap.toolbox_visible) {
      // adjust setting and notify model
      this.stateMap.toolbox_visible = false;

      // hide inputs and relabel toggle
      this.jqueryMap.$toggle.val(this.configMap.toggle_text_invisible);
      this.jqueryMap.$inputs.css('display', 'none');
      this.jqueryMap.$remove.css('display', 'none');
    } else {
      // adjust setting
      this.stateMap.toolbox_visible = true;

      // display inputs and relabel toggle
      this.jqueryMap.$toggle.val(this.configMap.toggle_text_visible);
      this.jqueryMap.$inputs.css('display', 'inline');
      this.jqueryMap.$remove.css('display', 'inline');
    }
    return false;
  }
  // End DOM/EVENT HANDLER method /toggleToolbox/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin EVENT HANLDER method /onInputChange/
  // Purpose    : Respond to change event on the local inputs
  // Returns    : false
  // Throws     : none
  onInputChange() {
    console.log("Changing inputs!");
    let config = new classes.OpConfig(
      this.jqueryMap.$orig_width.val(),
      this.jqueryMap.$orig_height.val(),
      this.jqueryMap.$x_offset.val(),
      this.jqueryMap.$y_offset.val(),
      this.jqueryMap.$crop_width.val(),
      this.jqueryMap.$crop_height.val(),
      // this.jqueryMap.$filename.val(),
      // this.jqueryMap.$crop_aspect.val(),
      // this.jqueryMap.$prescale.val(),
    );
    this.stateMap.backend.updateConfig(config);
    return false;
  }
  // End EVENT HANLDER method /onInputChange/

  // Begin EVENT HANLDER method /onTitleClick/
  // Purpose    : Adjust configuration of allowed keys
  // Returns    : false
  // Throws     : none
  onTitleClick( input_type ) {
    console.log("Unlocked " + input_type +"!");
    // this.stateMap.backend.toggleLock( input_type ); // TODO

    var input;
    switch (input_type) {
      case "crop_filename" :
        input = this.jqueryMap.$crop_filename; break;
      case "x_offset" :
        input = this.jqueryMap.$x_offset; break;
      case "y_offset" :
        input = this.jqueryMap.$y_offset; break;
      case "crop_width" :
        input = this.jqueryMap.$crop_width; break;
      case "crop_height" :
        input = this.jqueryMap.$crop_height; break;
      case "crop_aspect" :
        input = this.jqueryMap.$crop_aspect; break;
      case "prescale" :
        input = this.jqueryMap.$prescale; break;
      default :
        console.log("Invalid input_type: " + input_type);
        return false;
    }
    input.prop('disabled', !input.prop('disabled'));
    return false;
  }
  // End EVENT HANLDER method /onTitleClick/

  // Begin EVENT HANLDER method /save/
  // Purpose    : save the cropped image
  // Arguments  : none
  // Action     : triggers the save function in imagebox.model
  // Returns    : true (should return false if there is a fail case?)
  // Throws     : none
  save() {
    console.log("Saving image!");

    // // first clean up the backend
    this.stateMap.backend.saveSingle();

    return true;
  }

  // Begin EVENT HANLDER method /remove/
  // Purpose    : remove this image from the imagelist
  // Returns    : true (should return false if there is a fail case?)
  // Throws     : none
  remove() {
    console.log("Removing image!");

    // // first clean up the backend
    this.stateMap.backend.remove();

    // then clean up the frontend
    this.jqueryMap.$imagebox.remove();

    return true;
  }
  // End EVENT HANLDER method /remove/
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
  configModule( input_map ) {
    spa.util.setConfigMap({
      input_map    : input_map,
      settable_map : this.configMap.settable_map,
      config_map   : this.configMap
    });
    return true;
  }
  // End public method /configModule/

  // Begin public method /setConfig/
  // Purpose    : Set up and configure the toolbox values
  // Arguments  : 
  //   * backend - the backend that should supply the values
  // Returns    : true
  // Throws     : none
  //
  setConfig( backend ) {
    // set initial input values
    this.jqueryMap.$orig_filename.val(backend.name);
    this.jqueryMap.$orig_width.val(backend.originalImage.naturalWidth);
    this.jqueryMap.$orig_height.val(backend.originalImage.naturalHeight);
    // this.jqueryMap.$orig_aspect.val(valueMap.orig_aspect);
    this.updateConfig( backend.config );
    return true;
  }
  // End public method /setConfig/

  // Begin public method /updateConfig/
  // Purpose    : Update changeable values in the bottom of the toolbox
  // Arguments  : A map of values for the bottom of the toolbox
  //   * crop_filename, x_offset,    y_offset, 
  //     crop_width,    crop_height, crop_aspect, prescale
  // Returns    : true
  // Throws     : none
  //
  updateConfig( config ) {
    // this.jqueryMap.$crop_filename.val(valueMap.crop_filename);
    this.jqueryMap.$x_offset.val(config.cropLeft);
    this.jqueryMap.$y_offset.val(config.cropTop);
    this.jqueryMap.$x_offset.val(config.cropLeft);
    this.jqueryMap.$y_offset.val(config.cropTop);
    this.jqueryMap.$crop_width.val(config.cropWidth);
    this.jqueryMap.$crop_height.val(config.cropHeight);
    // this.jqueryMap.$crop_aspect.val(valueMap.crop_aspect);
    // this.jqueryMap.$prescale.val(valueMap.prescale);
    return true;
  }
  //------------------- END PUBLIC METHODS ---------------------
};
