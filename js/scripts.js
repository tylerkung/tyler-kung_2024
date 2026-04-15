$(document).ready(function () {

  var controller = new ScrollMagic.Controller();

  // ===== SLEEPER HERO PARALLAX =====
  new ScrollMagic.Scene({
    triggerElement: '.work-section',
    triggerHook: 0.8,
    duration: '80%'
  })
  .setTween(gsap.fromTo('.sleeper-hero', { y: 30 }, { y: -30, ease: 'none' }))
  .addTo(controller);

  // ===== LOGO HOVER MICRO-ANIMATION =====
  $('.box-logo').on('mouseenter', function () {
    gsap.to($(this).find('svg'), { rotation: 5, duration: 0.3, ease: 'power2.out' });
  }).on('mouseleave', function () {
    gsap.to($(this).find('svg'), { rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
  });

});
