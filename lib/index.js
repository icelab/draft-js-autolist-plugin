'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

var _trackCharacters = require('./trackCharacters');

var _trackCharacters2 = _interopRequireDefault(_trackCharacters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Regexes for matching list unordered/ordered types.
 * Split into two since we're sometimes matching with the space at the end
 *
 * Unordered lists should match either '* ' or '- '
 * Ordered lists should match any `${digit}. `, so '1. ', '3. ', 222. ' should
 * all work.
 *
 * @type {RegExp}
 */
var UL_FULL_REGEX = /^(\*|\-)\s$/;
var UL_INTERCEPT_REGEX = /^(\*|\-)$/;
var OL_FULL_REGEX = /^\d+\.\s$/;
var OL_INTERCEPT_REGEX = /^\d+\.$/;

/**
 * The autolist namespaced commands
 * @type {Object}
 */
var commands = {
  OL: 'autolist-ordered',
  UL: 'autolist-unordered'
};

var blockTypes = {
  UL: 'unordered-list-item',
  OL: 'ordered-list-item',
  UNSTYLED: 'unstyled'

  /**
   * Auto-list Plugin
   *
   * Infers that the user is trying to write a list of things and turns the
   * current block into either an ordered or unordered list.
   *
   * We do this by tracking the characters typed and, when a matching sequence
   * is entered, then attempting to turn it into the correct list type.
   *
   * This approach is not fool-proof: if you make a mistake while typing a list
   * and have to delete it we’ll fail to infer that correctly. This is somewhat
   * intentional as we don't want to have to query the content of the editor
   * for every single keyDown.
   *
   * @return {Object} Object defining the draft-js API methods
   */
};function autoListPlugin() {
  var keyCharsHistory = [];

  return {

    /**
     * Listen to all keyboard events, intercept and return a custom command
     * if the sequence of typed characters matches the criteria for creating
     * a unordered or ordered list.
     *
     * @param  {KeyboardEvent} e Synthetic keyboard event from draftjs
     * @return {String} A command, either our custom ones or one of the defaults
     */
    keyBindingFn: function keyBindingFn(e) {
      keyCharsHistory = (0, _trackCharacters2.default)(keyCharsHistory, e);

      // Only run our more complex checks if the last character
      // typed is a space
      if (e.keyCode === 32) {
        // Test the last two characters to see if they match the full unordered
        // list regex
        var lastTwoChars = keyCharsHistory.slice(-2).join('');
        if (UL_FULL_REGEX.test(lastTwoChars)) {
          return commands.UL;
          // Test the all the characters to see if they match the full ordered
          // list regex
        } else if (OL_FULL_REGEX.test(keyCharsHistory.join(''))) {
          return commands.OL;
        }
      }
    },


    /**
     * Listen to the when a return is typed, and remove an empty list item.
     * Means that lists act as you’d expect while typing.
     *
     * @param  {KeyboardEvent} e Synthetic keyboard event from draftjs
     * @param  {Object} editorState Current editor state
     * @param  {Function} options.setEditorState Setter function passed by
     * the draft-js-plugin-editor
     * @return {String} Did we handle the return or not?
     */
    handleReturn: function handleReturn(e, editorState, _ref) {
      var setEditorState = _ref.setEditorState;

      var content = editorState.getCurrentContent();

      // Retrieve current block
      var selection = editorState.getSelection();
      var blockKey = selection.getStartKey();
      var block = content.getBlockForKey(blockKey);
      var blockType = block.getType();

      // If it’s a list-item and it’s empty, toggle its blockType (which should
      // make it 'unstyled')
      if (/list-item/.test(blockType) && block.getText() === '') {
        editorState = _draftJs.RichUtils.toggleBlockType(editorState, blockType);
        content = editorState.getCurrentContent();
        editorState = _draftJs.EditorState.forceSelection(editorState, content.getSelectionAfter());
        setEditorState(editorState);
        return 'handled';
      }
      return 'not-handled';
    },


    /**
     * Handle our custom `commands`
     * @param  {String} command The current command to respond to
     * @param  {Object} editorState Current editor state
     * @param  {Number} eventTimeStamp When the event happened.
     * @param  {Function} options.setEditorState Setter function passed by
     * the draft-js-plugin-editor
     * @return {String} Did we handle the return or not?
     */
    handleKeyCommand: function handleKeyCommand(command, editorState, eventTimeStamp, _ref2) {
      var setEditorState = _ref2.setEditorState;

      if (command === commands.UL || command === commands.OL) {
        // Set up the base types/checks
        var listType = blockTypes.UL;
        var listTest = function listTest(text) {
          return UL_INTERCEPT_REGEX.test(text);
        };
        if (command === commands.OL) {
          listType = blockTypes.OL;
          listTest = function listTest(text) {
            return OL_INTERCEPT_REGEX.test(text);
          };
        }

        var content = editorState.getCurrentContent();

        // Retrieve the focused block
        var selection = editorState.getSelection();
        var blockKey = selection.getStartKey();
        var block = content.getBlockForKey(blockKey);

        // Check if it matches our criteria for creating a list: unstyled, at
        // the top-level and empty.
        var blockText = block.getText();
        if (block.getType() === blockTypes.UNSTYLED && block.getDepth() === 0 && listTest(blockText)) {
          // Convert the existing block to an unordered list
          editorState = _draftJs.RichUtils.toggleBlockType(editorState, listType);
          content = editorState.getCurrentContent();
          block = content.getBlockForKey(blockKey);

          // Select the entire block
          var blockSelection = new _draftJs.SelectionState({
            anchorKey: blockKey,
            anchorOffset: 0,
            focusKey: blockKey,
            focusOffset: block.getLength()
          });

          // Replace with the text with either nothing (if we created a list)
          // or the existing content
          content = _draftJs.Modifier.replaceText(content, blockSelection, '');
        } else {
          // We’ve intercepted the normal keyboard command propagation here, so
          // we needs to manually insert a space if we're not injecting a list
          content = _draftJs.Modifier.insertText(content, selection, ' ');
        }
        // Propagate the new state up
        editorState = _draftJs.EditorState.push(editorState, content);
        editorState = _draftJs.EditorState.forceSelection(editorState, content.getSelectionAfter());
        setEditorState(editorState);
        return 'handled';
      }
      return 'not-handled';
    }
  };
}

exports.default = autoListPlugin;