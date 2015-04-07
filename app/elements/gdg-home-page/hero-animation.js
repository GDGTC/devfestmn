function animateHero(elem) {

  var logoEntranceDuration = elem.animGlobals.BASE_DURATION * 0.8,
      heroContainer = elem.$.heroContainer,
      logoContainer = heroContainer.querySelector('.logo-container'),
      heroDescription = heroContainer.querySelector('.description');
      chevrons = heroContainer.querySelectorAll('.chevron-container img'),
      logoYear = heroContainer.querySelector('.logo-text .year'),
      logoTitle = heroContainer.querySelector('.logo-text .title');


  var timeline = new TimelineMax();
  //timeline.delay(0.5);

  timeline.to(logoContainer, 0, { opacity: 1 });

  timeline.from(
    chevrons,
    logoEntranceDuration,
    {
      scale: 0,
      opacity: 0,
      ease: Back.easeOut.config(1)
    }
  );

  timeline.fromTo(
    logoYear,
    logoEntranceDuration,
    {
      fontSize: '0px',
      opacity: 0,
      display: 'block'
    },
    {
      fontSize: '1em',
      opacity: 1,
      ease: Back.easeOut.config(1)
    },
    '-=' + logoEntranceDuration
  );



/////////// Expand Text //////////

  timeline.fromTo(
    logoTitle,
    logoEntranceDuration,
    {
      fontSize: '0px',
      opacity: 0,
      display: 'none'
    },
    {
      display: 'block',
      opacity: 1,
      fontSize: '1em',
      ease: Back.easeOut.config(1.7)
    }
  );

  timeline.to(
    heroDescription,
    logoEntranceDuration,
    {
      fontSize: '1em',
      opacity: 1
    },
    '+=0.5'
  );
}

