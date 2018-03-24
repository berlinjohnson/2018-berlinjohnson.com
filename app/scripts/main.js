var Handlebars = require('handlebars');
var $ = require('jquery');
var projects = require('./projects');

var portfolioSource = $("#portfolio-template").html();
var portfolioTemplate = Handlebars.compile(portfolioSource);

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
  $('section.portfolio').on('click', '.viewProject', navigateTo);
  $('#project').on('click', '#portfolioCrumb', navigateTo);

}

// -------------------- NAV BAR --------------------
var navigateTo = function(e) {
  e.preventDefault;

  var path = $(this).attr('data-path');
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

  updateTabs(page);

  // Switch section shown
  $('section').addClass('is-hidden');
  if (piece) {
    // showPiece();
  }
  else if (project) {
    $('#project').attr("data-path", path);
    showProject(project);
  }
  else if (page == 'portfolio') {
    showPortfolio();
  }
  $('section[data-path="' + path + '"]').removeClass('is-hidden');
};

var updateTabs = function(page) {
  var path = "/"
  if (page != "about") {
    path = "/" + page + "/";
  }
  $('nav button[data-path!="' + path + '"]').removeClass('is-selected').blur();
  $('nav button[data-path="' + path + '"]').addClass('is-selected');
}

var showPortfolio = function() {
  $('#portfolio').html('');
  var projectList = portfolioTemplate({"projects": projects});
  $('#portfolio').html(projectList);
}

var showProject = function(projectName) {
  $('#project').html('');
  var project = projects.filter(x => x.name == projectName)[0];
  var projectObj = projectTemplate(project);
  $('#project').html(projectObj);
}

var aspectRatio = function(piece) {
  return piece.width / piece.height;
}

// ----------------Handlebar helpers -----------------
Handlebars.registerHelper('spacify', function(x) {
  return x.replace(/_/g," ");
});
