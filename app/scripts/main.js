var Handlebars = require('handlebars');
var $ = require('jquery');
var projects = require('./projects');

var projectSource = $("#project-template").html();
var projectTemplate = Handlebars.compile(projectSource);

// -------------------- ON READY --------------------
$(function() {
  init();
});

// -------------------- INIT --------------------
var init = function() {
  // First page load
  showSection(location.pathname);

  // Browser's back or forward action
  window.onpopstate = function(e) {
    showSection(location.pathname);
  };

  // Click handlers
  $('#homeBtn').on('click', navigateTo);
  $('#aboutNav').on('click', navigateTo);
  $('#portfolioNav').on('click', navigateTo);
  $('#portfolioBtn').on('click', navigateTo);
  $('#resumeNav').on('click', navigateTo);
}

// -------------------- NAV BAR --------------------
var navigateTo = function(e) {
  e.preventDefault;

  var path = $(this).data('path');
  if (location.pathname === path) {
    return;
  };

  // Update url path
  history.pushState({}, '', path);
  showSection(path);
};

var showSection = function(path) {
  var pathArray = path.split('/').filter(x => x != "");
  var page = pathArray[0] || 'about';
  var project = pathArray[1];
  var piece = pathArray[2];
  // console.log(page);

  // Switch tab highlighed
  $('nav button[data-path!="' + path + '"]').removeClass('is-selected').blur();
  $('nav button[data-path="' + path + '"]').addClass('is-selected');

  // Switch section shown
  $('section').addClass('is-hidden');
  if (page == 'portfolio') {
    showPortfolio();
  }
  $('section[data-path="' + path + '"]').removeClass('is-hidden');
};

var showPortfolio = function() {
  $('#projects').html('');
  var projectList = projectTemplate({"projects": projects});
  $('#projects').html(projectList);
  // console.log(projects);

}

// ----------------Handlebar helpers -----------------
Handlebars.registerHelper('spacify', function(x) {
  return x.replace(/_/g," ");
});
