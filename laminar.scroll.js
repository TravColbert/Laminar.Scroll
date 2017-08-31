/**
 * @author Travis Colbert trav.colbert@gmail.com
 */

"use strict";

var Laminar = Laminar || {};

/* General Idea: Make a list of all the elements that need to be aware of their
 * positioning.
 * For each element, define a test that should be performed at some interval.
 * If the test is TRUE do one function, if not, do the other
 *
 * [{elementSelector,conditions[{testFunct(element),trueCallbackFunct,falseCallbackFunct}],...]
 */

Laminar.Scroll = (function() {
  /**
   * Instantiates an object that tracks scrolling on given objects.
   * 
   * The scrollElements parameter is an array of objects decribing:
   * 1. A DOM object to watch
   * 2. A test to perform
   * 3. A function to invoke if the test returns TRUE
   * 4. A function to invoke if the test returns FALSE
   * 
   * The scrollTimeout is the number of milleseconds between tests. The 
   * timeout defaults to 200ms.
   * 
   * @param {*} scrollElements 
   * @param {*} scrollTimeout 
   * @param {*} scrollOccured
   */
  function Scroll(scrollElements,scrollTimeout,scrollOccured) {
    this.scrollTimeout = scrollTimeout || 200;
    this.scrollOccured = scrollOccured || false;
    if(Array.isArray(scrollElements)) {
      for(var c=0;c<scrollElements.length;c++) {
        scrollElements[c].element = this.getDomElement(scrollElements[c].elementSelector);
      }
      this.elements = scrollElements;
    }
    this.init(this);
  }
  Scroll.prototype.init = function(scrollObj) {
    var that = this;
    window.addEventListener('scroll',function(e) {
      that.scrollEvent();
    });
    this.scrollCheckLoop = setInterval(function() {
      if(!that.scrollOccured) return;
      that.checkBodyPosition();
      that.scrollOccured = false;
    }, this.scrollTimeout);
    return this;
  };
  Scroll.prototype.scrollEvent = function() {
    this.scrollOccured = true;
    return this;
  };
  Scroll.prototype.getDomElement = function(elementSelector) {
    if(Laminar.Widget && (elementSelector instanceof Laminar.Widget)) {
      return elementSelector;
    }
    return document.querySelector(elementSelector);
  };
  Scroll.prototype.stop = function() {
    clearInterval(this.scrollCheckLoop);
    return this;
  };
  Scroll.prototype.checkBodyPosition = function() {
    for(var i=0;i<this.elements.length;i++) {
      for(var c=0;c<this.elements[i].conditions.length;c++) {
        if(this.elements[i].conditions[c].testFunc(this.elements[i].element)) {
          if(this.elements[i].conditions[c].hasOwnProperty("trueCallback")) this.elements[i].conditions[c].trueCallback(this.elements[i].element);
        } else {
          if(this.elements[i].conditions[c].hasOwnProperty("falseCallback")) this.elements[i].conditions[c].falseCallback(this.elements[i].element);
        }
      }
    }
  };
  return Scroll;
})();