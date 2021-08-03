

$(document).ready(function(){
})

var controller = new ScrollMagic.Controller({});
$('video').each(function(){
	var currentVideo = this;
	new ScrollMagic.Scene({triggerElement: currentVideo})
		.on("enter", function(e){
			$(currentVideo)[0].play();
		})
		// .addIndicators()
		.addTo(controller);
})
new ScrollMagic.Scene({triggerElement: '.chat-ui'})
	.setClassToggle('.chat', 'animate')
	// .addIndicators()
	.addTo(controller);

$(window).on('load', function(){
	initSlides();
});

$(window).resize(function(){
	sizeSlides();
});

function initSlides(){
	sizeSlides();
	$('.slideshow-content').attr({'aria-count': 3, 'aria-current': 1});
	var lastClone = $('.slide.last').clone().removeClass('last');
	var firstClone = $('.slide.first').clone().removeClass('first');
	$(lastClone).insertBefore('.first');
	$(firstClone).insertAfter('.last');
	$('.slideshow-content').css('transform', 'translateX(' + (-viewport) + 'px' + ')');
}

function sizeSlides(){
	viewport = parseInt($('.slideshow').css('width'),10);
	var currentSlide = parseInt($('.slideshow-content').attr('aria-current'),10);
	$('.slideshow-content').css({'width': viewport*5, 'transform': 'translateX(' + (-viewport * currentSlide) + 'px' + ')'});
	$('.slide').each(function(){
		$(this).css('width', viewport);
	})
}

$('.next').click(slideNext);
$('.prev').click(slidePrev);

function slideNext(){
	sizeSlides();
	var current = parseInt($('.slideshow-content').attr('aria-current'), 10);
	var max = parseInt($('.slideshow-content').attr('aria-count'),10);
	var curTransform;
	var matrix = $('.slideshow-content').css('transform');
	var values = matrix.split('(')[1].match(/-?[\d\.]+/g);
	curTransform = parseInt(values[4],10);
	$('.slideshow-content').removeClass('no-anim');
	$('.slideshow').addClass('lock');
	$('.slideshow-content').css('transform', 'translateX(' + (curTransform - viewport) + 'px' + ')');
	current++;
	$('.slideshow-content').attr('aria-current', current);
	// console.log(current++)
	setTimeout(function(){
		$('.slideshow-content').addClass('no-anim');
		$('.slideshow').removeClass('lock');
	}, 400)
	if (max < current){
		setTimeout(function(){
			$('.slideshow-content').css('transform', 'translateX(' + (-viewport) + 'px' + ')');
			$('.slideshow-content').attr('aria-current', 1);
		}, 401)
	}
	var currentPage = $('.pagination .active');
	var next = $(currentPage).next();
	if (!next.length) next = $('.page-1');
	$(currentPage).removeClass('active');
	$(next).addClass('active');
}

function slidePrev(){
	sizeSlides();
	var current = parseInt($('.slideshow-content').attr('aria-current'), 10);
	var max = parseInt($('.slideshow-content').attr('aria-count'),10);
	var curTransform;
	var matrix = $('.slideshow-content').css('transform');
	var values = matrix.split('(')[1].match(/-?[\d\.]+/g);
	curTransform = parseInt(values[4],10);
	$('.slideshow-content').removeClass('no-anim');
	$('.slideshow').addClass('lock');
	$('.slideshow-content').css('transform', 'translateX(' + (curTransform + viewport) + 'px' + ')');
	current--;
	$('.slideshow-content').attr('aria-current', current);
	setTimeout(function(){
		$('.slideshow-content').addClass('no-anim');
		$('.slideshow').removeClass('lock');
	}, 400)
	if (0 === current){
		setTimeout(function(){
			$('.slideshow-content').css('transform', 'translateX(' + (-viewport * 3) + 'px' + ')');
			$('.slideshow-content').attr('aria-current', 3);
		}, 401)
	}

	var currentPage = $('.pagination .active');
	var prev = $(currentPage).prev();
	if (!prev.length) prev = $('.pagination div').siblings(':last').next();
	$(currentPage).removeClass('active');
	$(prev).addClass('active');
}
