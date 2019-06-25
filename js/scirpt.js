function test(event) {
  var y = event.deltaY;
  if (y > 0) {
    document.getElementById("jet1").style.animation=
    "jet 2s 1  forwards ";
    document.getElementById("sectionOne").style.animation=
    "backGr 2s 1 forwards ";
    document.getElementById("sectionTwo").style.animation =
      "moveSecOne 2s 1  forwards ";
    document.getElementById("sectionThree").style.animation =
      "moveSecTwo 2s 1 forwards ";
    document.getElementById("sectionFour").style.animation =
      "moveSecThree 2s 1 forwards ";
  }  
  else  {
    document.getElementById("jet1").style.animation=
    "jetII 2s 1  forwards ";
    document.getElementById("sectionOne").style.animation=
    "backGrII 2s 1  forwards ";
    document.getElementById("sectionTwo").style.animation =
      "moveSecOneII 2s 1  forwards ";
    document.getElementById("sectionThree").style.animation =
      "moveSecTwoII 2s 1  forwards ";
    document.getElementById("sectionFour").style.animation =
      "moveSecThreeII 2s 1  forwards ";
  }
}
function planetMouse_on_mars(){
  document.getElementById("mars").style.animation= "planetCardOn 2s 1  forwards ";
}
function planetMouse_on_ruby(){
  document.getElementById("ruby").style.animation= "planetCardOn 2s 1  forwards ";
}
function planetMouse_on_venus(){
  document.getElementById("venus").style.animation= "planetCardOn 2s 1  forwards ";
}
function planetMouse_off_mars(){
  document.getElementById("mars").style.animation= "planetCardOff 2s 1  forwards ";
}
function planetMouse_off_ruby(){
  document.getElementById("ruby").style.animation= "planetCardOff 2s 1  forwards ";
}
function planetMouse_off_venus(){
  document.getElementById("venus").style.animation= "planetCardOff 2s 1  forwards ";
}
function whyUs_on(){
  document.getElementById("ship5").style.animation= "whyUsShip_on 2s 1  forwards ";
  // document.getElementById("whyUsTitle").style.animation= "whyUsTitle_on 2s 1  forwards ";
  document.getElementById("whyUsDes").style.animation= "whyUsDes_on 2s 1  forwards ";
}
function advantages(){
  document.getElementById("rightTeil").style.animation= "rightTeil 2s 1  forwards ";
}

