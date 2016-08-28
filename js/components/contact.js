/**
 * This file contains the jQuery functions to for the contact form
 * as well as the Ajax request to send the contact form
 *
 * @author Sam Thilmany
 * @copyright 2016
 *
 * This script makes use of   Modernizr.cookies to check if the used device has cookies enabled.
 * 														jqBootstrapValidation to validate the users inputs
 *
 */

 /**
  * Wait until the DOM is generated to execuete any of the functions
  *
  */
$(function() {
  "use strict"; // Start of use strict




  /**
   * Check if the browser allows cookies
   *
   * Without cookies enabled, no session ID can be set
   * and the mail function will not work
   *
   * @function    {Modernizr.cookies}   Checks if cookies are enabled
   *
   * @return      {boolean} TRUE        Enabled
   *                        FALSE       Disabled
   *
   */
  if (!Modernizr.cookies) {
    $("#contact_send").attr("disabled", true);
    event.preventDefault();

    $('#return').html('<div id="error" class="show">Please enable cookies in your browser and reload the page , otherwise you can not send messages.</div>');
  }




  /**
   * Set Session Cookie
   *
   * Sends an AJAX post request to the session-cookie.php file
   * and gets the value of the session cookie back
   *
   * @return  {int} spam1   Value of the session-cookie
   *
   */
  var spam1 = $("#spam1");
  $.post("././mail/session-cookie.php", function( data ) {
    spam1.val(data);
  });




  /**
   * Floating label headings for the contact form
   *
   */
  $("body").on("input propertychange", ".floating-label-form-group", function(e) {
    $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
  }).on("focus", ".floating-label-form-group", function() {
    $(this).addClass("floating-label-form-group-with-focus");
  }).on("blur", ".floating-label-form-group", function() {
    $(this).removeClass("floating-label-form-group-with-focus");
  });




  /**
   * Submit the contact form
   *
   * @function {jqBootstrapValidation}            jqBootstrapValidation Plugin
   *
   */
  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,

    // Actions to take if the contact form could not be submitted
    submitError: function($form, event, errors) {
      // Additional Error Messages or Events
    },

    // Actions to take if the contact form was submitted
    submitSuccess: function($form, event) {

      // Prevent spam click and default submit behaviour
      $("#contact_send").attr("disabled", true);
      event.preventDefault();

      // Get values from the form
      var name      = $("input#name").val();
      var email     = $("input#email").val();
      var subject   = $("input#subject").val();
      var message   = $("textarea#message").val();
      var spam1     = $("input#spam1").val();
      var spam2     = $("input#spam2").val();
      var firstName = name; // Will be edited afterwards

      // Set up a data string for the AJAX post
      var dataString = 'name='+ name
            + '&email=' + email
            + '&subject=' + subject
            + '&message=' + message
            + '&spam1=' + spam1
            + '&spam2=' + spam2;

      // Separate the name to generate the firstname
      if (firstName.indexOf(' ') >= 0) {
          firstName = name.split(' ').slice(0, -1).join(' ');
      }

      // Send the data to the server for the server side validation
      $.ajax({
        url: "././mail/send.php",
        type: "POST",
        dataType: "json",
        data: dataString,
        cache: false,

        // Actions to take, if the data was successfully submitted to the server
        success: function( error ) {

          // Error message - Invalid name
          if (error.data_validation_name === true) {
            $('#return').html('<div id="error" class="show">Sorry ' + firstName + ', your name seems to be invalid. Please check this and try again.</div>');
          }

          // Error message - Invalid email
          else if (error.data_validation_email === true) {
            $('#return').html('<div id="error" class="show">Sorry ' + firstName + ', your email seems to be invalid. Please check this and try again.</div>');
          }

          // Error message - Invalid subject
          else if (error.data_validation_subject === true) {
            $('#return').html('<div id="error" class="show">Sorry ' + firstName + ', your subject seems to be invalid. Please check this and try again.</div>');
          }

          // Error message - Invalid message
          else if (error.data_validation_message === true) {
            $('#return').html('<div id="error" class="show">Sorry ' + firstName + ', your message seems to be invalid. Please check this and try again.</div>');
          }

          // Error message - Spam 1
          else if (error.data_validation_spam1 === true) {
            $('#return').html('<div id="error" class="show">Sorry ' + firstName + ', I do not like spam. As your message appears to be spam, it was not sent.</div>');
          }

          // Error message - Spam 2
          else if (error.data_validation_spam2 === true) {
            $('#return').html('<div id="error" class="show">Sorry ' + firstName + ', I do not like spam. As your message appears to be spam, it was not sent.</div>');
          }

          // Error message - Email not sent to admin
          else if (error.send_admin === true) {
            $('#return').html('<div id="error" class="show">Sorry ' + firstName + ', your message was not submitted. Please try again later.</div>');
          }

          // Error message - Email not sent to user
          else if (error.send_user === true) {
            // Enable button
            $("#contact_send").attr("disabled", false);

            // Send the form (Animation)
            $('.form-wrapper').addClass('is-sent');
            setTimeout(function(){
              $('.form-wrapper').removeClass('is-sent');
            }, 2000);

            // Display the success message
            $('#return').html('<div id="warning" class="show">Your message was submitted successfully, but unfortunately we were unable to send you a confirmation mail.</div>');

            // Remove the success message after 10 seconds
            setTimeout(function(){
              $('#return').html('');
            }, 10000);

            // Clear the form
            $('#contactForm').trigger("reset");
          }

          // All the data is valid and the mail was send
          else {
            // Enable button
            $("#contact_send").attr("disabled", false);

            // Send the form (Animation)
            $('.form-wrapper').removeClass('flyInRight').addClass('is-sent');
            setTimeout(function(){
              $('.form-wrapper').removeClass('is-sent');
            }, 2000);

            // Display the success message
            setTimeout(function(){
              $('#return').html('<div id="success" class="show">The mail was send successfully</div>');
            }, 1440);

            // Remove the success message after 10 seconds
            setTimeout(function(){
              $('#return').html('');
            }, 10000);

            // Clear the form
            $('#contactForm').trigger("reset");
          }
        },

        // Actions to take if the data could not be submitted to the server
        error: function() {
            // Error message - Server
            $('#return').html('<div id="error" class="show">Sorry ' + firstName + ', the mail server is not responding. Please try again later.</div>');

            // Clear the Form
            $('#contactForm').trigger("reset");
        },
      });

    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

});
