var Handlebars = require('handlebars');
var $ = require('jquery');
var projects = require('./projects');

// ON READY ---------
$(function() {
  console.log('Hi');

  console.log(projects);

  // NAV BAR
  var showSection = function(path) {
    // Switch tab highlighed
    $('nav button').removeClass('is-selected').blur();
    $('nav button[data-path="' + path + '"]').addClass('is-selected');

    // Switch section shown
    $('section').addClass('is-hidden');
    $('section[data-path="' + path + '"]').removeClass('is-hidden');
  };

  var navigateTo = function(e) {
    e.preventDefault;

    var path = $(this).data('path');
    if (location.pathname === path) {
      return;
    };

    history.pushState({}, '', path);
    showSection(path);
  };

  // Browser's back or forward action
  window.onpopstate = function(e) {
    showSection(location.pathname);
  };

  // First page load
  showSection(location.pathname);

// NAVIGATION CLICKS
  $('#homeBtn').on('click', navigateTo);
  $('#aboutNav').on('click', navigateTo);
  $('#portfolioNav').on('click', navigateTo);
  $('#portfolioNavBtn').on('click', navigateTo);
  $('#resumeNav').on('click', navigateTo);
});
