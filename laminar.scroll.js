/**
 * @author Travis Colbert trav.colbert@gmail.com
 */

"use strict";

var Laminar = Laminar || {};


/* General Idea: Make a list of all the elements that need to be aware of their
 * vertical positioning.
 * For each element, list the upper- and lower-range where an event should
 * happen.
 * Finally, give the function that should be called when the element enters the
 * sensitive area.
 *
 * [{elementSelector,testFunct(element),callbackFunct},...]
 */

Laminar.Scroll = (function() {
  function Scroll(scrollElements,scrollTimeout) {
    this.scrollTimeout = scrollTimeout || 200;
    this.scrollOccured = false;
    if(Array.isArray(scrollElements)) {
      this.elements = scrollElements;
    }
    this.init(this);
  }
  Scroll.prototype.init = function(scrollObj) {
    var that = this;
    this.scrollCheckLoop = setInterval(function() {
      if(that.scrollOccured) {
        that.checkBodyPosition();
        that.scrollOccured = false;
      }
    }, this.scrollTimeout);
    return this;
  };
  Scroll.prototype.stop = function() {
    clearInterval(this.scrollCheckLoop);
    return this;
  };
  Scroll.prototype.scrollEvent = function() {
    this.scrollOccured = true;
    return this;
  };
  Scroll.prototype.checkElementPosition = function(element,conditions) {
    for(var c=0;c<conditions.length;c++) {
      if(conditions[c].testFunc(element)) {
        conditions[c].trueCallback(element);
      } else {
        conditions[c].falseCallback(element);
      }
    }
  };
  Scroll.prototype.checkBodyPosition = function() {
    for(var i=0;i<this.elements.length;i++) {
      var element = this.elements[i];
      var domElement = (element.elementSelector instanceof Laminar.Widget) ? element.elementSelector : document.querySelector(element.elementSelector);
      for(var c=0;c<element.conditions.length;c++) {
        if(element.conditions[c].testFunc(domElement)) {
          element.conditions[c].trueCallback(domElement);
        } else {
          element.conditions[c].falseCallback(domElement);
        }
      }
    }
  };
  return Scroll;
})();