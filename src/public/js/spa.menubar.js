/*
 * spa.menubar.js
 * A module to control the menubar in CROPFAB
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

classes.menubar = class {
  constructor() {
    this.configMap = {
      settable_map : {
        menubar_height: true,
        menubar_width : true
      },
      main_html : String()
        + '<div class="spa-menubar-logo">'
          + '<h1>PARALLEL IMAGE CROPPER</h1>'
        + '</div>'
        + '<div class="spa-menubar-menu">'
          + '<button class=spa-menubar-aboutbutton>'
          + 'About</button>'
          + '<br/>'
          + '<button class=spa-menubar-usagebutton>'
          + 'Usage</button>'
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
    };
    this.stateMap  = { $container : null };
    this.jqueryMap = {};
  }
  //---------------- BEGIN MODULE SCOPE METHODS --------------
    // getMarginLeft, setMenubarDimensions, setJqueryMap, 
    // handleResize, onAboutClick, onUsageClick,
    // configModule, initModule;
  //----------------- END MODULE SCOPE METHODS ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // Begin UTILITY method /setMenubarDimensions/
  setMenubarDimensions() {
    this.jqueryMap.$container.css('width', 
                      this.configMap.menubar_width);
    this.jqueryMap.$container.css('margin-left', spa.util.getMarginLeft(
                      this.configMap.menubar_width));
    this.jqueryMap.$container.css('height', 
                      this.configMap.menubar_height);
  }
  // End UTILITY method /setMenubarDimensions/

  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap() {
    var $container = this.stateMap.$container;

    this.jqueryMap = { 
      $container : $container,
      $logo  : $container.find('.spa-menubar-logo'),
      $usage : $container.find('.spa-menubar-usagebutton'),
      $about : $container.find('.spa-menubar-aboutbutton'),
    };
  }
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------

  onAboutClick() {
    spa.announcement.announce('About', this.configMap.about_text);
  }

  onUsageClick() {
    spa.announcement.announce('Usage', this.configMap.usage_text);
  }

  //-------------------- END EVENT HANDLERS --------------------



  //------------------- BEGIN PUBLIC METHODS -------------------

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  initModule( $container ) {
    this.stateMap.$container = $container;
    $container.html( this.configMap.main_html );
    this.setJqueryMap();
    this.setMenubarDimensions();

    // bind user input events
    this.jqueryMap.$usage.bind('click', () => {this.onUsageClick();});
    this.jqueryMap.$about.bind('click', () => {this.onAboutClick();});

    return true;
  }
  // End public method /initModule/

  // Begin public method /handleResize/
  // Purpose    : handles resize events
  // Arguments  :
  //  * event
  // Returns    : false? TODO
  // Throws     : none
  //
  handleResize( event ) {
    return false;
  }
  // End public method /handleResize/
  //------------------- END PUBLIC METHODS ---------------------
};

spa.menubar = new classes.menubar();