/*
 * spa.util.js
 * General JavaScript utilities
 *
 * Michael S. Mikowski - mmikowski at gmail dot com
 * These are routines I have created, compiled, and updated
 * since 1998, with inspiration from around the web.
 *
 * (somewhat modified by Ted Morin)
 *
*/

/*jshint           browser   : true, regexp   : true,
  devel  : true,   indent    : 2,    maxerr   : 50,
  newcap : true,   nomen     : true, plusplus : true,
  white  : true,   esversion : 6,    laxbreak : true
*/

/*global $, spa, classes, getComputedStyle */

spa.util = (function () {
  var makeError, setConfigMap, 
    getMarginLeft;

  // Begin Public constructor /makeError/
  // Purpose: a convenience wrapper to create an error object
  // Arguments:
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns  : newly constructed error object
  // Throws   : none
  //
  makeError = function ( name_text, msg_text, data ) {
    var error     = new Error();
    error.name    = name_text;
    error.message = msg_text;

    if ( data ){ error.data = data; }

    return error;
  };
  // End Public constructor /makeError/

  // Begin Public method /setConfigMap/
  // Purpose: Common code to set configs in feature modules
  // Arguments:
  //   * input_map    - map of key-values to set in config
  //   * settable_map - map of allowable keys to set
  //   * config_map   - map to apply settings to
  // Returns: true
  // Throws : Exception if input key not allowed
  //
  setConfigMap = function ( arg_map ){
    var
      input_map    = arg_map.input_map,
      settable_map = arg_map.settable_map,
      config_map   = arg_map.config_map,
      key_name, error;

    for ( key_name in input_map ){
      if ( input_map.hasOwnProperty( key_name ) ){
        if ( settable_map.hasOwnProperty( key_name ) ){
          config_map[key_name] = input_map[key_name];
        }
        else {
          error = makeError( 'Bad Input',
            'Setting config key |' + key_name + '| is not supported'
          );
          throw error;
        }
      }
    }
  };
  // End Public method /setConfigMap/

  // Begin Public utility function /getMarginLeft/
  // Purpose: a convenience calculation for centering
  //   (utility is program specific, relates to shading)
  // Arguments:
  //   * width - the widthname_text - the error name
  // Returns  : appropriate parameter for margin-left in css
  // Throws   : none
  //
  getMarginLeft = function (width) {
    return -(width/2 + 7);
  };
  // End Public constructor /getMarginLeft/

  // Begin public method saveFile
  // Purpose   : Save a file
  // Arguments :
  //    blob - A blob which is to be saved
  //    name - The name to save it as
  // Returns   : none
  // Throws    : none
  saveFile = function (blob, name) {
    let fakeLink = document.createElement("a");
    let dataURL = URL.createObjectURL(blob);
    fakeLink.href = dataURL;
    fakeLink.download = name;
    fakeLink.click();
    setTimeout(() => {window.URL.revokeObjectURL(dataURL);});
  };
  // End public method savFile

  return {
    makeError    : makeError,
    setConfigMap : setConfigMap,
    getMarginLeft: getMarginLeft,
    saveFile     : saveFile,
  };
}());
