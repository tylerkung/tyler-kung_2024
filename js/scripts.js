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
