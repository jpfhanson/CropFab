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
  constructor( $imagebox, backend, settingMap) {
    this.configMap = {
      settable_map : {
        // TODO
      },
      // TODO

      main_html : String()
        + '<div class="spa-imagebox-toolbox">'
          + '<div class="spa-imagebox-toolbox-top">'
            + '<button class="spa-imagebox-toolbox-remove">'
              + 'Remove</button>'
            + '<div class="spa-imagebox-toolbox-orig-filename"></div>'
            + '<input type="text" '
              + 'class="spa-imagebox-toolbox-crop-filename" disabled/>'
            + '<button class="spa-imagebox-toolbox-toggle">'
              + 'Unlock</button>'
          + '</div><br/>'
          + '<div class="spa-imagebox-toolbox-bottom">'
          + '</div>'
        + '</div>',
      orig_dimensions_html : String()
        + '<div class="spa-imagebox-toolbox-inputpair">'
          + '<div>'
            + '<div>Original Width: </div>'
            + '<input type="number" '
              + 'class="spa-imagebox-toolbox-orig-width" disabled />'
          + '</div>'
          + '<div>'
            + '<div>Original Height: </div>'
            + '<input type="number" '
              + 'class="spa-imagebox-toolbox-orig-height" disabled />'
          + '</div>'
        + '</div>',
      crop_dimensions_html : String()
        + '<div class="spa-imagebox-toolbox-inputpair">'
          + '<div>'
            + '<div>Crop Width: </div>'
            + '<input type="number" '
              + ' class="spa-imagebox-toolbox-crop-width" /><br/>'
          + '</div>'
          + '<div>'
            + '<div>Crop Height: </div>'
            + '<input type="number" '
              + 'class="spa-imagebox-toolbox-crop-height" />'
          + '</div>'
        + '</div>',
      crop_offset_html : String()
        + '<div class="spa-imagebox-toolbox-inputpair">'
          + '<div>'
            + '<div>Crop X Offset: </div>'
            + '<input type="number" class="spa-imagebox-toolbox-x" /><br/>'
          + '</div>'
          + '<div>'
            + '<div>Crop Y Offset: </div>'
            + '<input type="number" class="spa-imagebox-toolbox-y" />'
          + '</div>'
        + '</div>',
      aspect_ratio_html : String()
        + '<div class="spa-imagebox-toolbox-inputpair">'
          + '<div>'
            + '<div>Original Aspect Ratio: </div>'
            + '<input type="number" '
              + 'class="spa-imagebox-toolbox-orig-aspect" disabled/>'
          + '</div>'
          + '<div>'
            + '<div>Cropped Aspect Ratio: </div>'
            + '<input type="number" '
              + 'class="spa-imagebox-toolbox-crop-aspect" />'
          + '</div>'
        + '</div>'
    };
    this.stateMap  = {
      $imagebox : $imagebox,
      backend   : backend,

      locked    : true
    };
    this.jqueryMap = {};

    // create the html
    $imagebox.prepend(this.configMap.main_html);
    $imagebox.find('.spa-imagebox-toolbox-bottom').html(
      this.configMap.orig_dimensions_html +
      this.configMap.crop_dimensions_html +
      this.configMap.crop_offset_html +
      this.configMap.aspect_ratio_html);

    this.setJqueryMap();
    console.log(this.jqueryMap);
    console.log(this.jqueryMap.$bottom);

    // apply settings
    console.log("Implement settingMap usage, TODO: " + settingMap);

    // // initialize backend (backend must call this.initTop)
    // this.stateMap.backend.initToolbox(this);

    // set original filename
    // (is this kosher? needs a getter?)
    console.log(this.stateMap.backend);
    this.jqueryMap.$orig_filename.text(this.stateMap.backend.name);
      this.jqueryMap.$crop_filename.val("target filename.png");

    // bind callbacks
    this.jqueryMap.$toggle.bind('click', 
      () => {this.toggleLocked();});
    this.jqueryMap.$remove.bind('click',
      () => {this.remove();});
    this.jqueryMap.$crop_filename.bind('change',
      () => {this.onChange();});
    this.jqueryMap.$crop_width.bind('change',
      () => {this.onChange();});
    this.jqueryMap.$crop_height.bind('change',
      () => {this.onChange();});
    this.jqueryMap.$crop_aspect.bind('change',
      () => {this.onChange();});
    this.jqueryMap.$x_offset.bind('change',
      () => {this.onChange();});
    this.jqueryMap.$y_offset.bind('change',
      () => {this.onChange();});
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
      $remove        : $imagebox.find('.spa-imagebox-toolbox-remove'),
      $toggle        : $imagebox.find('.spa-imagebox-toolbox-toggle'),

      $bottom        : $imagebox.find('.spa-imagebox-toolbox-bottom'),
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

  // Begin DOM/EVENT HANDLER method /toggleLocked/
  // Example   : spa.imagebox.toolbox.toggleLocked();
  // Purpose   : Lock or unlock imagebox
  // Returns   : false
  // Throws    : none
  toggleLocked() {
    if (this.stateMap.locked) {
      // adjust setting
      this.stateMap.locked = false;

      // // notify the model (backend must call this.initBottom)
      // this.stateMap.backend.handleImageboxUnlock(this); // TODO
      this.initBottom({
        crop_filename : "hypothetical cropping",
        x_offset      : 1,
        y_offset      : 1,
        crop_width    : 1,
        crop_height   : 1,
        crop_aspect   : 1,
        orig_width    : 1,
        orig_height   : 1,
        orig_aspect   : 1,
        filename      : "hypothetical file.png"
      });

      // display unlocked-mode features and relabel toggle
      this.jqueryMap.$toggle.text('Lock');
      this.jqueryMap.$toggle.css('background-color', 'red');
      this.jqueryMap.$crop_filename.prop('disabled', false);
      this.jqueryMap.$remove.css('display', 'inline');
      this.jqueryMap.$bottom.css('display', 'inline');
      // this.jqueryMap.$remove.animate({'display': 'inline'}, 10,
      //   function () {console.log("it appears!");});
      // this.jqueryMap.$bottom.animate({'display': 'inline'}, 10);
    } else {
      // adjust setting and notify model
      this.stateMap.locked = true;

      // // notify the model
      // this.stateMap.backend.handleImageboxLock(); // TODO

      // hide unlocked-mode features and relabel toggle
      this.jqueryMap.$toggle.text('Unlock');
      this.jqueryMap.$toggle.css('background-color', 'initial');
      this.jqueryMap.$crop_filename.prop('disabled', true);
      this.jqueryMap.$remove.css('display', 'none');
      this.jqueryMap.$bottom.css('display', 'none');
      // this.jqueryMap.$remove.animate({'display': 'none'}, 10);
      // this.jqueryMap.$bottom.animate({'display': 'none'}, 10);
    }
    return false;
  }
  // End DOM/EVENT HANDLER method /toggleLocked/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin EVENT HANLDER method /onChange/
  // Purpose    : Adjust configuration of allowed keys
  // Returns    : false
  // Throws     : none
  onChange() {
    console.log("Something changed!");
    var parameters = {
      crop_filename : $crop_filename.val(),
      x_offset      : $x_offset.val(),
      y_offset      : $y_offset.val(),
      crop_width    : $crop_width.val(),
      crop_height   : $crop_height.val(),
      crop_aspect   : $crop_aspect.val()
    };
    this.stateMap.backend.update(parameters);
    return false;
  }
  // End EVENT HANLDER method /onChange/

  // Begin EVENT HANLDER method /remove/
  // Purpose    : remove
  // Returns    : true (should return false if there is a fail case?)
  // Throws     : none
  remove() {
    console.log("Image removed!");

    // // first clean up the backend
    // this.stateMap.backend.remove();

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

  // Begin public method /initBottom/
  // Purpose    : Update all values in the bottom of the toolbox
  // Arguments  : A map of values to be set
  //   * x_offset,    y_offset, 
  //     crop_width,    crop_height, crop_aspect,
  //     orig_width,    orig_height, orig_aspect,
  // Returns    : true
  // Throws     : none
  //
  initBottom( valueMap ) {
      this.jqueryMap.$orig_aspect.val(valueMap.orig_aspect);
      this.jqueryMap.$orig_width.val(valueMap.orig_width);
      this.jqueryMap.$orig_height.val(valueMap.orig_height);
      this.updateBottom( valueMap );
      return true;
  }
  // End public method /initBottom/

  // Begin public method /updateBottom/
  // Purpose    : Update changeable values in the bottom of the toolbox
  // Arguments  : A map of values for the bottom of the toolbox
  //   * crop_filename, x_offset,    y_offset, 
  //     crop_width,    crop_height, crop_aspect,
  // Returns    : true
  // Throws     : none
  //
  updateBottom( valueMap ) {
      this.jqueryMap.$x_offset.val(valueMap.x_offset);
      this.jqueryMap.$y_offset.val(valueMap.y_offset);
      this.jqueryMap.$crop_width.val(valueMap.crop_width);
      this.jqueryMap.$crop_height.val(valueMap.crop_height);
      this.jqueryMap.$crop_aspect.val(valueMap.crop_aspect);
      return true;
  }
  //------------------- END PUBLIC METHODS ---------------------
};
