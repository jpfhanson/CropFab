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
      },
      image_width : 560,
      image_height: 420,
      alone_height_em : 25,
      other_height_em : 10,

      cropper_model : null,
      on_load       : null,

      main_html : String()
        + '<div class="spa-loaderbox">'
          + '<h2 class="spa-loaderbox-text"></h2>'
          + '<input type="file" class="spa-loaderbox-load" '
            + 'accept="image/*" multiple />'
        + '</div>',
      alone_html_nodrag : String()
        + 'Click here to load images!',
      other_html_nodrag : String()
        + 'Click here to load images!',

      alone_html_drag : String()
        + 'Click or drag here to load images!',
      other_html_drag : String()
        + 'Click or drag here to load more images!'
    };
    this.stateMap  = { 
      $container : null,

      alone_height_px : 0,
      other_height_px : 0,

      alone_html : null,
      other_html : null,

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
      $container     : $append_target.find('.spa-loaderbox'),
      $text          : $append_target.find('.spa-loaderbox-text'),
      $load          : $append_target.find('.spa-loaderbox-load')
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
  // Begin EVENT HANDLER method /onLoadButtonClick/
  onLoadButtonClick() {
    console.log("Loaderbox Clicked!");
    this.jqueryMap.$load.click();
    return false;
  }
  // End EVENT HANDLER method /onLoadButtonClick/

  // Begin EVENT HANDLER method /onLoadClick/
  onLoadInputClick(e) {
    console.log("Load input Clicked!");
    e.stopPropagation();
    return false;
  }
  // End EVENT HANDLER method /onLoadClick/

  // Begin EVENT HANDLER method /onLoadChange/
  onLoadChange(e) {
    console.log("Images loading!");
    this.configMap.on_load(this.jqueryMap.$load.get(0).files);
    return false;
  }
  // End EVENT HANDLER method /onLoadChange/
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

    // bind fixed user events
    this.jqueryMap.$container.on('click', () => {this.onLoadButtonClick();});
    this.jqueryMap.$load.on('click', (e) => {this.onLoadInputClick(e);});
    this.jqueryMap.$load.on('change', () => {this.onLoadChange();});

    // set up draggable uploading
    // credit to Osvaldas Valutis 2019-08-19
    // https://css-tricks.com/drag-and-drop-file-uploading/
    let isAdvancedUpload = (() => {
      let div = this.jqueryMap.$container.get(0);
      return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    })();

    if (isAdvancedUpload) {
      let $draggable = this.jqueryMap.$container
      $draggable.on('drag dragstart dragend dragover dragenter dragleave drop', 
        (e) => {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', () => {
        $draggable.addClass('spa-loaderbox-dragover');
      })
      .on('dragleave dragend drop', () => {
        $draggable.removeClass('spa-loaderbox-dragover');
      })
      .on('drop', (e) => {
        this.configMap.on_load(e.originalEvent.dataTransfer.files);
      });

      this.stateMap.alone_html = this.configMap.alone_html_drag;
      this.stateMap.other_html = this.configMap.other_html_drag;
    } else {
      this.stateMap.alone_html = this.configMap.alone_html_nodrag;
      this.stateMap.other_html = this.configMap.other_html_nodrag;
    }

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
      this.jqueryMap.$text.text(this.stateMap.alone_html);
    } else {
      this.jqueryMap.$container.css('height', this.stateMap.other_height_px);
      this.jqueryMap.$text.text(this.stateMap.other_html);
    }
    return true;
  }
  // End public method /handleResize/
  //------------------- END PUBLIC METHODS ---------------------
};

spa.loaderbox = new classes.loaderbox();
