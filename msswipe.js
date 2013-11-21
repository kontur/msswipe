/**
 * Simple singleton for dealing with MSPointer model based swipe gestures (IE10)
 *
 * Dependencies: JQuery
 *
 * Author: Johannes "kontur" Neumeier
 *
 * Codebase: https://github.com/kontur/msswipe
 *
 * Version:
 * ========
 * - 0.0.1: 21.11.2013
 *   Initial WIP code base with basic event listener
 *
 * Example:
 * ========
 * if (window.navigator.msPointerEnabled) {
 *     $(".swipeable").each(function () {
 *         msswipe.addEventListener($(this), function (event, direction, $this) {
 *             switch (direction) {
 *                 case "right": ... break;
 *                 case "up":    ... break;
 *                 case "left":  ... break;
 *                 case "down":  ... break;
 *             }
 *         }
 *     });
 * }
 *
 * License:
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Johannes Neumeier
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var msswipe = (function () {

    var // holds all the objects that have event listeners attached to them
        targets = [],

        // pixel based threshold that the touch gesture has had to move in order to trigger a swipe
        threshold = 45;

    var // direction string constants the function will return
        LEFT  = "left",
        UP    = "up",
        RIGHT = "right",
        DOWN  = "down";


    // public methods
    // ==============

    /**
     * add a swipe event listener to $obj
     * TODO currently only handles single $obj collections
     *
     * @param $obj - jquery object (collection with 1 item)
     * @param callback
     */
    var addEventListener = function ($obj, callback) {
        $obj.on("MSPointerDown", gestureStart);
        $obj.on("MSPointerUp", gestureEnd);

        var target = {
            $obj: $obj,
            callback: callback,
            startpos: { x: 0, y: 0 }
        };
        targets.push(target);
    }


    // TODO removeEventListener()


    // private methods
    // ===============

    /**
     * React to gesture starting, store the start position
     *
     * @param event
     */
    function gestureStart(event) {
        var t = getTarget($(this));
        t.startpos = {
            x: event.originalEvent.pageX,
            y: event.originalEvent.pageY
        }
    }


    /**
     * React to the gesture ending
     *
     * @param event
     */
    function gestureEnd(event) {
        var t = getTarget($(this)),
            moved = {
                x: t.startpos.x - event.originalEvent.pageX,
                y: t.startpos.y - event.originalEvent.pageY
            },
            direction;

        if (Math.abs(moved.x) < threshold && Math.abs(moved.y) < threshold) {
            return;
        }

        // horizontal swipe
        if (Math.abs(moved.x) > threshold && Math.abs(moved.y)) {
            if (moved.x < 0) {
                direction = RIGHT;
            } else {
                direction = LEFT;
            }
        }

        // vertical swipe
        if (Math.abs(moved.y) > threshold && Math.abs(moved.y)) {
            if (moved.y > 0) {
                direction = UP;
            } else {
                direction = DOWN;
            }
        }

        // execute callback if one was set for this target
        if (typeof t.callback === "function") {
            t.callback(event, direction, t.$obj);
        }
    }


    /**
     *
     * TODO this just fetches the first targets[x] that has $obj as it's $obj, but this could in fact be several
     *
     * @param $obj
     * @returns {*}
     */
    function getTarget($obj) {
        // fetch the correct target[x] that has this $obj as it's $obj
        for (var i = 0; i < targets.length; i++) {
            if ($obj[0] === targets[i].$obj[0]) {
                return targets[i];
            }
        }
        throw("Error: ms-swipe.js, getTarget(), target not found in targets array");
    }


    // return public interface
    // =======================

    return {
        addEventListener: addEventListener
    }

})();