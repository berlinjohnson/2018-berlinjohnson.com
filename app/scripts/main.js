var Handlebars = require('handlebars');
var $ = require('jquery');
var pages = ['about', 'portfolio', 'resume', 'downloads'];
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
  // Ugly gray click box hack
  document.addEventListener("touchstart", function(){}, true);

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
  $('section').on('click', '.button-back', showParent);
  $('.track-download').on('click', trackDownload);

  //Arrow key navigation
  $(document).keyup(function(e) {
    e.preventDefault;
    var currentLocation = getLocationObj();
    var pagination = getPaginationPaths();
    var path;



    if (e.key == "ArrowRight") {
      showNeighbor("next");
    }
    else if (e.key == "ArrowLeft") {
      showNeighbor("prev");
    }
    else if (e.key == "Escape") {
      showParent();
    }
  });

}

var trackDownload = function(e) {
  e.preventDefault
  ga('send', 'event', 'DynamicWallpaper', 'download', this.text);
  console.log('event tracked');
}

// -------------------- NAV BAR --------------------

var navigateTo = function(e) {
  e.preventDefault;

  var path = $(this).attr('data-path');
  if (location.pathname === path) {
    return;
  };
  showSection(path);
};


var showNeighbor = function(direction) {
  var currentLocation = getLocationObj();
  var pagination = getPaginationPaths();
  var path = location.pathname;

  if (currentLocation.piece) {
    if (pagination.piece && pagination.piece[direction]) {
      path = "/portfolio/" + currentLocation.project + "/" + pagination.piece[direction] + "/";
    }
  }
  else if (currentLocation.project) {
    if (pagination.project && pagination.project[direction]) {
      path = "/portfolio/" + pagination.project[direction] + "/";
    }
  } else if (currentLocation.page) {
    if (pagination.page && pagination.page[direction]) {
      var page = pagination.page[direction];
      if (page == "about") {
        path = "/";
      }
      else {
        path = "/" + page + "/";
      }
    }
  }
  showSection(path);
}

var showParent = function() {
  var currentLocation = getLocationObj();
  var path = location.pathname;

  if (currentLocation.piece) {
    path = "/portfolio/" + currentLocation.project;
  }
  else if (currentLocation.project) {
    path = "/portfolio/"
  }
  else {
    return;
  }
  showSection(path);
}

var showSection = function(path) {
  // Update url path and send pageview to GA
  history.pushState({}, '', path);
  ga('send', 'pageview', location.pathname);

  var pathObj = getLocationObj(path);

  var page = pathObj.page;
  var project = pathObj.project;
  var piece = pathObj.piece;

  updateTabs(page);
  // Switch section shown
  $('section').addClass('is-hidden');
  if (!isValidNavigation(page, project, piece)) {
    $('#404').attr("data-path", path);
    $('#404').removeClass('is-hidden');
  }
  else if (piece) {
    $('#piece').attr("data-path", path);
    showPiece(project, piece);
  }
  else if (project) {
    $('#project').attr("data-path", path);
    showProject(project);
    watchProgressiveLoad();
  }
  else if (page == 'portfolio') {
    $('.portfolio').attr("data-path", path);
    showPortfolio();
  } else {
    $('.' + page).attr("data-path", path);
  }

  $('section[data-path="' + path + '"]').removeClass('is-hidden');

  if (!piece) {
    stopLoading();
  }
};

var isValidNavigation = function(page, project, piece) {
  if (pages.indexOf(page) == -1) {
    return false;
  }

  if (page != 'portfolio' && (project || piece)) {
    return false;
  }

  if (page == 'portfolio' && project) {
    var matchingProject = getProjectObject(project);
    if (!matchingProject) {
      return false;
    }

    if (piece && !getFullPieceName(matchingProject, piece)) {
      stopLoading();
      return false;
    }
  }

  return true;
}

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
  $(window).scrollTop(0);
}

var showProject = function(projectName) {
  $('#project').html('');
  var project = getProjectObject(projectName);
  var pagination = getPaginationPaths();
  var projectObj = projectTemplate({"project": project, "pagination": pagination});
  $('#project').html(projectObj);
  $(window).scrollTop(0);
}

var showPiece = function(projectName, pieceName) {
  startLoading();

  $('#piece').addClass("is-hidden");
  $('#piece').html('');
  var project = getProjectObject(projectName);
  var piece = getFullPieceName(project, pieceName);
  var pagination = getPaginationPaths();

  var img = new Image();
  $(img).on('load', function() {
    stopLoading();
  });
  img.src = '/images/projects/'+projectName+'/'+piece;

  var pieceObj = pieceTemplate({"project": projectName, "piece": piece, "pagination": pagination});
  $('#piece').html(pieceObj);
}

var startLoading = function() {
  if ($('.is-loading').length < 1) {
    var template = $('.loader-template');
    var newLoader = template.clone();
    newLoader.removeClass('loader-template');
    newLoader.addClass('is-loading');
    template.after(newLoader);
  }
}

var stopLoading = function() {
  $('.loader:not(.loader-template)').remove();
}

var getLocationObj = function(path) {
  path = path || location.pathname;
  var pathObj = {
    page: "",
    project: "",
    piece: ""
  }

  var pathArray = location.pathname.split('/').filter(x => x != "");
  pathObj.page = pathArray[0] || 'about';
  pathObj.project = pathArray[1];
  pathObj.piece = pathArray[2];

  return pathObj;
}

var getProjectObject = function(projectName) {
  return projects.filter(x => x.name == projectName)[0];
}

var getFullPieceName = function(projectObj, pieceName) {
  var allPieces = [].concat(...projectObj.rows);
  return allPieces.filter(x => x.startsWith(pieceName + '-'))[0];
}

var getPaginationPaths = function() {
  var currentLocation = getLocationObj();
  var pagination = {
    page: {prev: "", next: ""},
    project: {prev: "", next: ""},
    piece: {prev: "", next: "", totalNum: "", currentNum: ""}
  }

  // PAGES
  pagination.page = getNeighbors(currentLocation.page, pages, true);

  // PROJECT
  if (currentLocation.project){
    var allProjectNames = projects.map(x => x.name);
    pagination.project = getNeighbors(currentLocation.project, allProjectNames, true);
  }

  // PIECE
  if (currentLocation.piece){
    var allPieces = [].concat(...getProjectObject(currentLocation.project).rows);
    var allPieceNames = allPieces.map(x => x.split('-')[0]);
    pagination.piece = getNeighbors(currentLocation.piece, allPieceNames, false);
    pagination.piece.currentNum = allPieceNames.indexOf(currentLocation.piece)+1;
    pagination.piece.totalNum = allPieceNames.length;
  }
  return pagination;
}

var getNeighbors = function(val, array, loop=false) {
  var index = array.indexOf(val);
  if (index < 0) {
    return {'prev': undefined, 'next': undefined};
  }

  var lastIndex = array.length - 1;
  var prevIndex = index - 1;
  var nextIndex = index + 1;
  if (loop) {
    if (prevIndex < 0) {
      prevIndex = lastIndex;
    }
    if (nextIndex > lastIndex) {
      nextIndex = 0;
    }
  }

  return {'prev': array[prevIndex], 'next': array[nextIndex]};
}

var watchProgressiveLoad = function() {
  $('.img-baby').on('load', function(e) {
    $(this).addClass('is-loaded');
  });
  $('.img-thumbnail').on('load', function(e) {
    $(this).addClass('is-loaded');
    $('.img-baby', $(this).parent()).attr('style', 'opacity: 0;');
  });
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

Handlebars.registerHelper('heightPercent', function(x) {
  // this_is_the_name-ratio.filetype --> h/w
  var fileRatio = x.split('-')[1];
  // ratio.filetype --> ratio
  var ratio = fileRatio.split('.')[0].split('x');
  var width = parseFloat(ratio[0]);
  var height = parseFloat(ratio[1]);
  return 100 * (height / width);
});

Handlebars.registerHelper('pathOnly', function(x) {
  // this_is_the_name-ratio.filetype --> this_is_the_name
  var path_name = x.split('-')[0];
  return path_name;
});
