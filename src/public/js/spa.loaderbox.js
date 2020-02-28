/*
 * spa.loaderbox.js
 * module to control the loaderbox in CROPFAB
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

classes.loaderbox = class {
  constructor() {
    this.configMap = {
      settable_map : {
        image_width     : true,
        image_height    : true, 
        alone_height_em : true,
        other_height_em : true,

        cropper_model   : true,
        on_load         : true,
        on_drop         : true,
      },
      image_width : 560,
      image_height: 420,
      alone_height_em : 25,
      other_height_em : 10,

      cropper_model : null,
      on_load       : null,
      on_drop       : null,

      main_html : String()
        + '<div class="spa-loaderbox">'
        + '</div>',
      alone_html : String()
        + '<h2>Load images here!</h2>',
      other_html : String()
        + '<h2>Load more images here!</h2>'
    };
    this.stateMap  = { 
      $container : null,

      alone_height_px : 0,
      other_height_px : 0,

      alone : true,
    };
    this.jqueryMap = {};

  }
  //---------------- BEGIN MODULE SCOPE METHODS --------------
    // getEmSize, setJqueryMap, configModule, initModule,
    // setPxSizes, handleLoad, 
    // handleResize;
  //----------------- END MODULE SCOPE METHODS ---------------

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
    var $append_target = this.stateMap.$append_target;

    this.jqueryMap = { 
      $append_target : $append_target,
      $container     : $append_target.find('.spa-loaderbox')
    };
  }
  // End DOM method /setJqueryMap/

  // Begin DOM method /setPxSizes/
  setPxSizes() {
    var px_per_em = this.getEmSize( this.jqueryMap.$container.get(0) );

    this.stateMap.px_per_em         = px_per_em;
    this.stateMap.alone_height_px = this.configMap.alone_height_em * px_per_em;
    this.stateMap.other_height_px = this.configMap.other_height_em * px_per_em;
  }
  // End DOM method /setPxSizes/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // // Begin event handler /onLoadClick/
  // onLoadClick = function () {
  //   console.log("Load fired by loaderbox!");
  //   configMap.on_load();
  // };
  // // End event handler /onLoadClick/
  //-------------------- END EVENT HANDLERS --------------------



  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /handleLoad/
  // Purpose    : Respond when loading is completed
  // Arguments  : none
  // Returns    : Boolean
  //   * false - images loaded previously
  //   * true  - first images loaded (resized)
  handleLoad() {
    if (!this.stateMap.alone) { return false; }

    this.stateMap.alone = false;
    this.handleResize();
    console.log('Loaded!');
    return true;
  }
  // End public method /handleLoad/

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

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  initModule( $append_target ) {
    this.stateMap.$append_target = $append_target;
    $append_target.append(this.configMap.main_html);
    this.setJqueryMap();
    this.jqueryMap.$container.get(0).addEventListener("click",
                                        this.configMap.on_load);

    // call the resize function to add correct-size content
    this.handleResize();

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
  handleResize() {
    // don't do anything if we don't have a container
    if ( ! this.jqueryMap.$container ) { return false; }

    this.setPxSizes();
    if ( this.stateMap.alone ){
      this.jqueryMap.$container.css('height', this.stateMap.alone_height_px);
      this.jqueryMap.$container.html(this.configMap.alone_html);
    } else {
      this.jqueryMap.$container.css('height', this.stateMap.other_height_px);
      this.jqueryMap.$container.html(this.configMap.other_html);
    }
    return true;
  }
  // End public method /handleResize/
  //------------------- END PUBLIC METHODS ---------------------
};

spa.loaderbox = new classes.loaderbox();
