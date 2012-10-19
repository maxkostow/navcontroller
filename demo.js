$(window).load(function () {
  var i = 0, bgs = ['#f00', '#0f0', '#00f'];

  $('.nav-controller').navController({
    topId: 'home',
    events: {
      'nav:home': changeBgColor
    }
  });

  function changeBgColor () {
    $('#home').toggleClass('toggle');
  }
});