/*
 * spa.announcement.js
 * A module to control the announcement system in CROPFAB
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

classes.announcement = class {
  constructor() {
    this.configMap = {
      settable_map : {
        textbox_width_em : true
      },
      main_html : String()
        + '<div class="spa-announcement">'
          + '<div class="spa-announcement-textbox">'
            + '<div class= "spa-announcement-topbar">'
              + '<h2 class="spa-announcement-title">'
              + '</h2>'
            + '</div><br/>' 
            + '<div class="spa-announcement-text">'
            + '</div>'
          + '</div>'
        + '</div>',
      textbox_width_em : 50
    };
    this.stateMap  = {
      $container : null,
      is_visible : false,
      textbox_width_px : 0
    };
    this.jqueryMap = {};
  }

  //---------------- BEGIN MODULE SCOPE METHODS --------------
    // setJqueryMap, 
    // configModule, initModule, handleResize;
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
      $container : $append_target.find('.spa-announcement'),
      $textbox   : $append_target.find('.spa-announcement-textbox'),
      $topbar    : $append_target.find('.spa-announcement-topbar'),
      $title     : $append_target.find('.spa-announcement-title'),
      $text      : $append_target.find('.spa-announcement-text')
    };
  }
  // End DOM method /setJqueryMap/

  // Begin DOM method /setPxSizes/
  setPxSizes() {
    var px_per_em = this.getEmSize( this.jqueryMap.$container.get(0) );

    this.stateMap.px_per_em     = px_per_em;
    this.stateMap.textbox_width_px = this.configMap.textbox_width_em * px_per_em;
    this.stateMap.textbox_width_px = this.configMap.textbox_width_em * px_per_em;
  }
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin EVENT METHOD /onExitClick/
  onExitClick( event ) {
    // only act if the container div is responsible
    // c.o. https://stackoverflow.com/questions/9183381/how-to-have-click-event-only-fire-on-parent-div-not-children
    // maybe a better way?
    if (event.target != event.currentTarget) {return false;}

    // close out the announcement
    console.log('Announcement over!');
    this.jqueryMap.$container.css('display', 'none');
    this.stateMap.is_visible = false;
  }
  // End EVENT METHOD /onExitClick/
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

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * $container the jquery the feature will be added to
  // Returns    : true
  // Throws     : none
  //
  initModule( $append_target ) {

    // load html and jquery
    this.stateMap.$append_target = $append_target;
    $append_target.append( this.configMap.main_html );
    this.setJqueryMap();

    // callbacks and handlers
    this.jqueryMap.$container.bind('click', (e) => {this.onExitClick(e);});

    return true;
  }
  // End public method /initModule/

  // Begin public method /announce/
  // Purpose    : displays announcement passed as args
  // Arguments  :
  //  * title - the title to display
  //  * text  - the text to display
  // Returns    : true
  // Throws     : none
  //
  announce( title, text ) {
    console.log('Announcing!');

    // set the html
    this.jqueryMap.$title.text(title);
    this.jqueryMap.$text.text(text);

    // make visible
    this.stateMap.is_visible = true;
    this.jqueryMap.$container.css('display', 'inline-block');
    this.handleResize();

    return true;
  }
  // End public method /announce/

  // Begin public method /handleResize/
  // Purpose    : handles resize events
  // Arguments  :
  //  * event
  // Returns    : Boolean
  //   * false - resize not considered
  //   * true  - resize considered
  // Throws     : none
  //
  handleResize( event ) {
    // don't do anything if we don't have a container
    if ( ! this.jqueryMap.$container ) { return false; }
    // don't do anything if we are not visible
    if ( ! this.stateMap.is_visible ) { return false; }

    this.setPxSizes();
    this.jqueryMap.$textbox.css('width', 
            this.stateMap.textbox_width_px);
    return true;
  }
  // End public method /handleResize/
  //------------------- END PUBLIC METHODS ---------------------
};

spa.announcement = new classes.announcement();