/**
 * Backstrap
 * ---------
 * A Twitter Bootstrap and Backbone.Marionette Starter Kit
 * -------------------------------------------------------
 * v0.0.1
 *
 * Copyright (c)2013 Jarrad Giles
 * Distributed under MIT license
 * http://jagcrete.com
 */
 (function() {
  // check our dependencies
  if (!Backbone && !Backbone.Marionette) {
    if (console && console.log) console.log('backbonejs and backbone.marionette are required');
    return;
  }

  // establish the root obj
  var root = this;
  // save the previous Backstrap if it exists
  var prev = root.Backstrap;

  // safe ref to our Backstrap object
  var Backstrap = function(obj) {
    if (obj instanceof Backstrap) return obj;
    if (!(this instanceof Backstrap)) return new Backstrap(obj);
    this.Backstrap_wrapped = obj;
  };

  // establish our version
  Backstrap.VERSION = "0.0.1";

  root.Backstrap = Backstrap;

  /**
   * Call Backstrap.initialize($, App) to create and load the Bootstrap Marionette 
   * module.
   *
   * @param $ 
   *         the instance of jQuery or Zepto
   * @param App
   *         the Backbone.Marionette.Application instance
   * @param options
   *         a map of options used to customize 
   */
  var initialize = function($, App, options) {
    options = options || {};
    // configure the namespace of the events that the navbar will fire
    var eventNamespace = options.eventNamespace || 'navbar:show:';
    // ensure our eventNamespace includes a trailing delimiter
    if (/:$/.test(eventNamespace) == false) {
      eventNamespace += ':';
    }
    // configure the name of the home page event
    var homeEventName = options.homeEventName || 'home';
    // object to which events should be trigged on
    var triggerObject = App.vent;

    /** create the Marionette module **/
    App.module('Bootstrap', function(Module, App, Backbone, Marionette, $, _) {
      /** Convenient way to show and hide the modal backdrop **/
      Module.Backdrop =  (function() {
        var hidden = true;
        var selector = '.modal-backdrop';
        var show = function() {
          $(selector).show();
          hidden = false;
        };
        this.show = show;
        var hide = function() {
          $(selector).hide();
          hidden = true;
        };
        this.hide = hide;
        var toggle = function() {
          if (hidden) {
            show();
          } else {
            hide();
          }
        };
        this.toggle = toggle;
        return this;
      })();

      /**
       * Setup the Navbar.
       *
       * Each link in your nav list must have a data-event attribute that determines the 
       * name of the event that will trigger when the link is activated.
       */
      var navbar = function() {

        // configure the name of the class which denotes an active navbar link
        var navbarActiveClassName = 'active';

        // cache some elements
        var $inner = $('div.navbar-inner');
        // find the list of nav links
        var $nav = $('ul.nav', $inner);

        // helper function to mark the navbar link as active
        var activate = function(name) {
          $('li', $nav).removeClass(navbarActiveClassName);
          var $this = $('a[data-event="' + name + '"]', $nav);
          $this.parent().addClass(navbarActiveClassName);
          triggerObject.trigger(eventNamespace + name);
          if (Module.debug == true) {
            console.log('Bootstrap.Navbar -> Active: ' + name);
          }
        };
        this.activate = activate;

        var activateHome = function(e) {
            if (e) e.preventDefault();
            activate(homeEventName);
        };

        var getEvent = function(el) {
          if (!el) return null;
          $el = $(el);
          return $el.attr('data-event');
        };


        Module.addInitializer(function() {
          // find the navbar-inner
          // clicking on the brand loads the home page
          $('a.brand', $inner).click(function(e) {
            activateHome(e);
          });

          $links = $('li > a', $nav);

          $links.each(function(i,link) {
            var event = getEvent(link);
            if (!event) {
              console.warn('Nav link ' + $(link).attr('href') + ' is missing the "data-event" attribute!');
            }
          });

          // each nav link fires the data-event specified on the element
          $links.click(function(e) {
            var event = getEvent(this);
            if (event) {
              e.preventDefault();
              activate(event);
            } else {
              // normal link, ignore
            }
          });

        }); // end Module.addInitializer
      }; // end navbar func

      // establish Bootstrap.Navbar
      Module.Navbar = navbar();

    }); // end module


  }; // end initialize func

  // establish the initialize function
  Backstrap.initialize = initialize;

}).call(this);