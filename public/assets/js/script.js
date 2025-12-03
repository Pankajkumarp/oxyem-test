(function ($) {

  if($('.zoom-screen .header-nav-list').length>0){$('.zoom-screen .header-nav-list').on('click',function(e){if(!document.fullscreenElement){document.documentElement.requestFullscreen();}else{if(document.exitFullscreen){document.exitFullscreen();}}})}
})(jQuery);

