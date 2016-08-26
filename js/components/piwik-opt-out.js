/**
 * This file contains the AjaxOptOut for Piwik
 *
 * @author Sam Thilmany
 * @copyright 2016
 *
 */




/**
 * Wait until the DOM is generated to execuete any of the functions
 *
 */
$(function() {
  var beingtracked = true;

  function getPiwikInfo()
  {
    $.ajax({
      crossOrigin: true,
      dataType: "jsonp",
      url: 'https://thilmany.lu/stats/index.php?module=API&method=AjaxOptOut.isTracked&format=json',
      success: function(response) {
        if(response.value === true)
        {
          $('#piwik').html('<p><strong>You are currently being tracked by Piwik</strong><br />Click <a style="cursor:pointer;">here</a> if you don\'t want to be tracked anymore. This will set a \"Do-Not-Track\"-Cookie which prevents that your usage of my website is being analysed. Please note, that the cookie is stored locally on your device. If you visit my website with another device or if you clear your cookies, you have to repeat this setting.</p>');
          beingtracked = true;
        }
        else
        {
          $('#piwik').html('<p><strong>You are currently not tracked by Piwik.</strong><br />If you want to help me improving my website, please click <a style="cursor:pointer;">here</a>. Your usage of my page is then being analysed. Please note, that your IP address is shortened, so that nobody can retrace the usage to your person.</p>');
          beingtracked = false;
        }
      },
      error: function() {
        $('#piwik').html('<p>An error occured.</p>');
      }
    });
  }

  getPiwikInfo();
  $('#piwik').on('click', 'a', function () {
    if(beingtracked === true)
    {
        var urlparam = 'doIgnore';
    }
    else
    {
        var urlparam = 'doTrack';
    }
    $.ajax({
      dataType: "jsonp",
      url: 'https://thilmany.lu/stats/index.php?module=API&method=AjaxOptOut.'+urlparam+'&format=json',
      success: function(response) {
        if(response.result === "success")
        {
          getPiwikInfo();
        }
        else
        {
          $('#piwik').html('<p>An error occured. <a style="cursor:pointer;">Try again</a></p>');
        }
      },
      error: function() {
        $('#piwik').html('<p>An error occured.</p>');
      }
    });
  });
});
