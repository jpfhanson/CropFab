/*
 * spa.model.js
 * module for connecting multiple imagebox objects
 *
 * Ted Morin - fyodrpetrovichiv@gmail.com
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa */

spa.model = (function () {

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      settable_map : { 
        image_width : true,
        image_height: true
      },
      display_width : 560,
      display_height: 420
    },
    stateMap  = {
      imagelist : null,
      image_count : 0,
      images : {},
      image_scales : {},
      loaderbox : null,
      scale_width    : 640,
      scale_height   : 480,
      crop_top_right_x : 1,
      crop_top_right_y : 1,
      crop_bottom_left_x : 0,
      crop_bottom_left_y : 0
    },

    configModule, initModule,
    handleImageMouseEvent, handleToolboxEvent, 
    handleNewImage, handleImageUpdate;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // example : getTrimmedString
  //-------------------- END UTILITY METHODS -------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // example: onClickButton = ...
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
  configModule = function ( input_map ) {
    spa.util.setConfigMap({
      input_map    : input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });
    return true;
  };
  // End public method /configModule/

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * None
  // Returns    : true
  // Throws     : none
  //
  initModule = function () {
    return true;
  };
  // End public method /initModule/

  // Begin public method /handleImageMouseEvent/
  // Purpose    : handles a mouse event passed up by an imagebox
  // Arguments  :
  //  * the mouse event (dictate behavior to all canvases)
  //  * the source's id number
  // Returns    : false
  // Throws     : none
  //
  handleImageMouseEvent = function ( event, image_num ) {
    console.log('Mouse event in ' + image_num); // TODO
    // broadcast to all images
    // broadcast to all toolbox
    return true;
  };
  // End public method /handleImageMouseEvent/

  // Begin public method /handleToolboxEvent/
  // Purpose    : handles a toolbox button push 
  // Arguments  :
  //  * the event
  //  * the tag of the of the toolbox originator
  // Returns    : true
  // Throws     : none
  //
  handleToolboxEvent = function ( event, esrc_tag ) {
    // determine which private function really needs to be called
    switch (esrc_tag) { // TODO
      case ('button1'):
        console.log('Button1 pressed!');
        break;
      case ('button2'):
        console.log('Button2 pressed!');
        break;
      case ('button3'):
        console.log('Button3 pressed!');
        break;
      case ('button4'):
        console.log('Button4 pressed!');
        break;
    }
    return true;
  };
  // End public method /handleToolboxEvent/

  // Begin public method /handleNewImage/
  // Purpose    : handles a toolbox button push 
  // Arguments  :
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  handleNewImage = function ( image_data ) {
    // NOTE: THIS FUNCTION COULD CAUSE A RACE CONDITION. FIX IT.
    // NOT COMPLETE TODO
    // create the new image object
    spa.imagebox.makeObject(stateMap.loaderbox, stateMap.image_num);

    // update the model's data
    stateMap.image_count++;
    stateMap.images.append(image_data.image);

    // if necessary, update the size and scaling of all images
    if ((image_data.width > stateMap.scale_width) ||
        (image_data.height > stateMap.scale_height)){
      // call utility function TODO
      console.log('new top dog!');
    }
    return true;
  };
  // End public method /handleNewImage/

  // Begin public method /handleImageUpdate/
  // Purpose    : handles a toolbox button push 
  // Arguments  :
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  handleImageUpdate = function ( image_data, image_num ) {
    // update the model's data
    // TODO
    // if necessary, update the size and scaling of all images
    if ((image_data.width > stateMap.scale_width) ||
        (image_data.height > stateMap.scale_height)){
      // call utility function TODO
      console.log('new top dog in town!');
    } else if ((image_data.old_width === stateMap.scale_width) ||
        (image_data.old_height === stateMap.scale_height)){
      // call utility function TODO
      console.log('top dog left town!');
    }
    return true;
  };
  // End public method /handleImageUpdate/

  // return public methods
  return {
    configModule          : configModule,
    initModule            : initModule,
    handleImageMouseEvent : handleImageMouseEvent,
    handleToolboxEvent    : handleToolboxEvent,
    handleNewImage        : handleNewImage,
    handleImageUpdate     : handleImageUpdate
  };
  //------------------- END PUBLIC METHODS ---------------------
}());