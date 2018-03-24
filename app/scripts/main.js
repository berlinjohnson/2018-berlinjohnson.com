var Handlebars = require('handlebars');
var $ = require('jquery');
var projects = require('./projects');

var portfolioSource = $("#portfolio-template").html();
var portfolioTemplate = Handlebars.compile(portfolioSource);

var projectSource = $("#project-template").html();
var projectTemplate = Handlebars.compile(projectSource);

var pieceSource = $("#piece-template").html();
var pieceTemplate = Handlebars.compile(pieceSource);

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
  $('#resumeNav').on('click', navigateTo);
  $('section').on('click', '.viewPortfolio', navigateTo);
  $('section').on('click', '.viewProject', navigateTo);
  $('section').on('click', '.viewPiece', navigateTo);

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
    console.log("piece!");
    console.log(path);
    $('#piece').attr("data-path", path);
    showPiece(project, piece);
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

var showPiece = function(projectName, pieceName) {
  $('#piece').html('');
  var project = projects.filter(x => x.name == projectName)[0];
  var allPieces = [].concat(...project.rows);
  var piece = allPieces.filter(x => x.startsWith(pieceName + '-'))[0];
  var pieceObj = pieceTemplate({"project": projectName, "piece": piece});
  console.log(pieceObj);
  $('#piece').html(pieceObj);
}
// ----------------Handlebar helpers -----------------
// Both assumes naming format:
// this_is_the_name-ratio.filetype

Handlebars.registerHelper('nameOnly', function(x) {
  // this_is_the_name-ratio.filetype --> this_is_the_name
  var item_name = x.split('-')[0];
  // this_is_the_name --> this is the name
  var spacify = item_name.replace(/_/g," ");
  return spacify;
});

Handlebars.registerHelper('ratioOnly', function(x) {
  // this_is_the_name-ratio.filetype --> ratio.filetype
  var fileRatio = x.split('-')[1];
  // ratio.filetype --> ratio
  var ratio = fileRatio.split('.')[0];
  return ratio;
});

Handlebars.registerHelper('pathOnly', function(x) {
  // this_is_the_name-ratio.filetype --> this_is_the_name
  var path_name = x.split('-')[0];
  return path_name;
});
