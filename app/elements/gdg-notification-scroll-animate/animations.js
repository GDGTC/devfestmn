var BASE_DURATION;

var aparition = function (elem) {

};

var slideInRight = function (elem) {

};


var slideInRightAndHighlight = function (elem, contentContainer) {

  var timeline = new TimelineMax(),
      contentP = contentContainer.querySelector('.content');

  timeline.delay(BASE_DURATION * 1.5);

  timeline.from(
    contentContainer,
    BASE_DURATION * 0.4,
    {
      transform: 'translate3d(500px, 0, 0)',
      opacity: 0
    }
  );

  timeline.to(
    contentP,
    BASE_DURATION * 0.75,
    {
      backgroundColor: '#C172FF'
    },
    '-=' + BASE_DURATION * 0.4
  );

  timeline.to(
    contentP,
    BASE_DURATION,
    {
      backgroundColor: 'transparent'
    }
  );


};



function animate(elem, contentContainer, animation) {

  BASE_DURATION = elem.animGlobals.BASE_DURATION;

  if (animation === 'slideInRightAndHighlight') {
    slideInRightAndHighlight(elem, contentContainer);
  } else if (animation === 'slideInRight') {
    slideInRight(elem, contentContainer);
  } else if (animation === 'aparition') {
    aparition(elem, contentContainer);
  }

}

