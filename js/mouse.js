$('document').ready(function(){
    mouseFunc();
  });
  function mouseFunc(){
    $('.mouseScroll').css('top','0px');
    $('.mouseScroll').animate({top:'12px'},2500,function(){
        mouseFunc();
    });
  }