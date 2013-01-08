/*
 * Copyright (c) 2012 Jonathan Rowny. All rights reserved.
 * http://www.jonathanrowny.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, window, setTimeout */

define(function (require, exports, module) {
    'use strict';
    //req
    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        KeyBindingManager       = brackets.getModule("command/KeyBindingManager"),
        ExtensionUtils          = brackets.getModule("utils/ExtensionUtils"),
        Menus                   = brackets.getModule("command/Menus");
    
    //const
    var VIEW_SPRITEHERO = "spriteHero.view";

    var shWindow;
    
    function _handleSpriteHero() {
        if (!shWindow || shWindow.closed) {
            shWindow = window.open(ExtensionUtils.getModulePath(module, "SpriteHero/index.html"));
            shWindow.addEventListener('load', function () {
                shWindow.$('body').on('getCSS', function (event, css) {
                    var editor = EditorManager.getCurrentFullEditor();
                    var document = DocumentManager.getCurrentDocument();
                    var pos = editor.getCursorPos();
                    var line = document.getLine(pos.line);
                    var s,
                        lines = css.split("\n");
                    for (s = 0; s < lines.length; s++) {
                        editor._codeMirror.setLine(pos.line, lines[s]);
                        editor._codeMirror.indentLine(pos.line);
                        pos.line++;
                    }
                    EditorManager.focusEditor();
                    shWindow.close();
                });
            }, false);
        } else {
            shWindow.focus();
        }
    }
    
    CommandManager.register("Show SpriteHero", VIEW_SPRITEHERO, _handleSpriteHero);
    
    function init() {
        //add the menu and keybinding for view/hide
        var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
        menu.addMenuItem(VIEW_SPRITEHERO, "Ctrl-Alt-H", Menus.AFTER, Commands.FILE_PROJECT_SETTINGS);
    }
    
    init();
});