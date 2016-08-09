/**
 * This file contains all the jQuery functions
 *
 * @author Sam Thilmany
 * @copyright 2016
 *
 *
 * This script makes use of   Modernizr.touch to check if the used device has a touch screen.
 * 															This seems to be currently the best solution,
 * 															even if there are some cases where it fails.
 * 														circleProgress to animate the circle progress bars
 * 														jqeryEasing to animate an exponential scroll
 *
 */

(function($) {
  "use strict"; // Start of use strict




  /**
   * Wait until the DOM is generated to execuete any of the functions
   *
   */
  $(function() {




    /**
     * Detect if the device has a tochscreen
     *
     * @return    {boolean} TRUE      Touchscreen
     *                      FALSE     No Touchscreen
     *
     * @var       {touchscreen}       Contains the boolean
     *
     */
    function hasTouchscreen() {
      if ( $('html').hasClass('touchevents') ){
        return true;
      }
      else if ( $('html').hasClass('no-touchevents') ) {
        return false;
      }
    }
    var touchscreen = hasTouchscreen();




    /**
     * Detect current scroll position
     *
     * @return {int}    The current scroll position
     *
     */
    var scroll = 0;
    $(window).scroll(function () {
      scroll = $(window).scrollTop();
    });




    /**
     * Set Background-Attachment to true, because this feature is
     * disabled on most mobile devices due to its huge repaint cost
     *
     * @param  {variable} touchscreen       Contains the Results of the hasTouchscreen()-Function
     *
     */
    if ( touchscreen === true ) {
      $('#landing').css({
        'background-attachment': 'scroll'
      });
    }




    /**
     * Offset for Main Navigation
     *
     * @param     {options} 'offset'   Pixels to offset from screen when calculating position of scroll
     *
     * @function  {affix}              Bootstrap plugin that emulates the effect of position: sticky
     *
     */
    $('#mainNav').affix({
      offset: {
        top: 100
      }
    });




    /**
     * Animate the mobile menu, display the overlay and disable scrolling
     *
     * @function  {preventScrolling}        Controls the default scroll behaviour
     *
     * @function  {animateToggle}           Combines all the tasks to run on a button click
     *
     * @param  {variable} touchscreen       Contains the Results of the hasTouchscreen()-Function
     *
     */
    function preventScrolling(move) {
      if ( $('html').hasClass('no-scrolling') ) {
        $('html').bind(move, function(e){
          e.preventDefault();
          prevent = true;
        });
      }
      else {
        $('html').unbind(move).on(move, function() {
          prevent = false;
        });
      }
      var prevent = false;
    }


    function animateToggle(click) {
      $('.hamburger-menu').on(click, function() {
        $('.bar').toggleClass('animate');
        $('#mainNav').toggleClass('overlay');
        $('html').toggleClass('no-scrolling');
        preventScrolling('touchmove');
      });
    }

    if ( touchscreen === true ) {
      animateToggle('click');
    }
    else if ( touchscreen === false ) {
      animateToggle('click')
    }




    /**
     * Animate the Scrolling to a Section (Menu Buttons)
     *
     * @function  {easeInOutExpo}            Requires the jQuery Easing Plugin
     *
     * @function  {scrollToSection}          Defines waht to do when an action occurs
     *
     * @param     {variable} touchscreen     Contains the Results of the hasTouchscreen()-Function
     *
     */
    function scrollToSection(action) {
      $('.page-scroll a').bind(action, function(event) {
        var $anchor = $(this);

        $('html, body').stop().animate({
          scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1250, 'easeInOutExpo');

        event.preventDefault();
      });
    }

    if(touchscreen === true) {
     scrollToSection('touchstart')
    }
    else if (touchscreen === false) {
     scrollToSection('click')
    }




    /**
     * Highlight the Menu Button as Scrolling Occurs
     *
     * @param     {options} 'target'      The Element which the Plugin should spy
     *                      'offset'      Pixels to offset from screen when calculating position of scroll
     *
     * @function  {scrollspy}             Bootstrap Plugin That Automatically Updates Links in a Navigation List based on
     *            												Scroll Position.
     */
    $(function() {
      $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: $('#mainNav').height()
      });
    });




    /**
     * Animate in the content
     *
     * @function {appear}               Requires the jQuery Appear function to detect if the element is visible
     */
    var leftElements = $('#landing h1, #about h2, #about h3, #portfolio h2, #features h2, #offers h2, #offers h3, #contact h2');

    leftElements.appear({
     force_process: true
    });

    leftElements.on('appear', function() {
     $(this).addClass('flyInLeft');
    });

    var rightElements = $('#landing .skills, #about .content-text, #about .circle, #portfolio .portfolio-item, #features .features-list, #offers .panel-wrapper, #offers .further-information, #contact .form-wrapper');

    rightElements.appear({
     force_process: true
    });

    rightElements.on('appear', function() {
     $(this).addClass('flyInRight');
    });




    /**
     * Animate the Portfolio Figcaption
     *
     * @param     {variable} touchscreen   Contains the Results of the hasTouchscreen()-Function
     *
     */
    if(touchscreen === true) {
     $('.portfolio-grid figure').on('click', function() {
       $(this).toggleClass('active');
     });
    }
    else if (touchscreen === false) {
     $('.portfolio-grid figure').hover(function() {
       $(this).addClass('active') }, function() {
       $(this).removeClass('active') }
     );
    }




    /**
     * Hover State on Pricetable
     *
     * @param     {variable} touchscreen   Contains the Results of the hasTouchscreen()-Function
     *
     */
    if(touchscreen === false) {
     $('.panel').hover(function() {
       $(this).addClass('hover') }, function() {
       $(this).removeClass('hover') }
     );
    }




    /**
     * Closes the Responsive Menu on  Menu Item Click
     * 																Overlay Click
     *
     * @param  {variable} scroll            Scroll position of the viewport
     *
     * @param  {variable} pointerPosition   Position of the click
     *
     * @param  {variable} touchscreen       Contains the Results of the hasTouchscreen()-Function
     *
     */
    function closeMenu(action, pointer){
      $('.navbar-collapse ul li a:not(.dropdown-toggle)').on(action, function(click) {
        $('.navbar-toggle:visible').click();
      });

      $('#mainNav').on('click', function(e){
        var pointerPosition = e.pageY;
        if (pointerPosition-scroll > $(this).outerHeight()) {
          $('.navbar-toggle:visible').click();
        }
      });
    }

    if(touchscreen === true) {
      closeMenu('touchstart')
    }
    else if (touchscreen === false) {
      closeMenu('click')
    }



    /**
     * Set data-offset-bottom
     *
     * @param     {options} 'offset'     Pixels to offset from screen when calculating position of scroll
     *
     * @function  {affix}                Bootstrap plugin that emulates the effect of position: sticky
     *
     */
    $('.scroll-top').affix({
      offset: {
        top: $('#landing').outerHeight(),
        bottom: $('.footer-below').outerHeight() + 10
      }
    });




    /**
     * Set the different configurations for the progress bars
     *
     * @function  {progress}        Configuration of the progress bars
     *
     * @param     {size}            Size of the canvas where the progress bar is drawn on
     *            {gradient}        Color sheme of the progress bar
     *        		{vaue}            Value of how many percent the progress bar should be filled
     *
     * @function  {circleProgress}  Function to draw circle progress bars
     *            									Needs the jQuery Circle Progress Plugin
     *
     */
    $.fn.progress = function(size, gradient, value) {
      return this.each(function() {
        var e = $(this),
            inited = false;

        e.circleProgress({
          value: 0,
          size: size
        });

        e.appear({
          force_process: true
        });

        e.on('appear', function() {
          if (!inited) {
            e.circleProgress({
              value: value,
              size: size,
              lineCap: "round",
              fill: {
                gradient: gradient
              }
            });
            inited = true;
          }
        });

      });
    }

    var size = '130';

    $('.circleHTML').progress(size, ["#00C853", "#00E676"], '0.85');
    $('.circleCSS').progress(size, ["#00C853", "#00E676"], '0.90');
    $('.circleJQUERY').progress(size, ["#7CB342", "#689F38"], '0.70');
    $('.circlePHP').progress(size, ["#F57F17", "#F9A825"], '0.60');
    $('.circleMYSQL').progress(size, ["#FF8F00", "#FF6F00"], '0.40');
    $('.circlePS').progress(size, ["#7CB342", "#689F38"], '0.70');
    $('.circleVEC').progress(size, ["#7CB342", "#689F38"], '0.65');
    $('.circleSKETCH').progress(size, ["#00C853", "#00E676"], '0.85');




    /**
     * Display the cookie note after 2 seconds and hide it if the user closes it
     *
     */
    setTimeout(function() {
      $('.cookie-note').addClass('is-active')
    }, 1000);

    $('.close').on('click', function() {
      $('.cookie-note').removeClass('is-active')
    });



    /**
     * Get the actual year to set it into the footer
     *
     */
    var year = new Date().getFullYear();
    $("#copyright-year").text(year);




  });

})(jQuery); // End of use strict
