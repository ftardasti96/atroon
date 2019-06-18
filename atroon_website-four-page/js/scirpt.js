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
