// NAV SCROLL
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos < currentScrollPos && $(window).scrollTop() >= 50) {
    document.getElementById("navbar").style.top = "-50%";
  } else {
    document.getElementById("navbar").style.top = "0";
  }
  prevScrollpos = currentScrollPos;
}

$(window).scroll(function() {
  if ($(window).scrollTop() >= 50) {
    $('.navbar').css('background-color', '#222222');
  } else {
    if ($(window).width() < 576) {
      $('.navbar').css('background-color', 'rgba(34,34,34,0.9)');
    } else $('.navbar').css('background-color', 'transparent');
  }
});
