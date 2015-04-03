(function (document) {
  'use strict';


  /**
   * Set of operations for controlling and animating scroll-up button functionality
   */
  function handleScrolling() {

    var mainPanel = document.querySelector('#mainPanel');
    var scrollUpButton = document.querySelector('#upScroller');

    var SCROLL_UP_CUTOFF = 400; // top main content starts here
    var VISIBLE_SCROLL_BUTTON_HEIGHT = 1000;

    var currentScrollPos = null,
        iteration = null,
        triggerScroll = false;


    /**
     * Easing function to provide a smooth scrolling effect when scrolling is triggered
     */
    function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
      return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
    }


    /**
     * Stops the animation and reset the startScroll and iteration
     */
    function stopScroll() {
      triggerScroll = false;
    }

    /**
     * Helper that currently reads the scroll position from the #mainPanel element
     */
    function getScrollPosition() {

      return mainPanel.scroller.scrollTop;
    }



    function updateStates () {

      var postScrollScrollPos = getScrollPosition();

      // Button visible?
      if (postScrollScrollPos >= VISIBLE_SCROLL_BUTTON_HEIGHT) {
        if (new Array(scrollUpButton.classList[0]).indexOf('visible') === -1) {
          scrollUpButton.className += ' visible';
        }

      } else {
        scrollUpButton.className = scrollUpButton.className.replace(/\bvisible\b/,'');
      }

      // Still scrolling?
      if (postScrollScrollPos <= SCROLL_UP_CUTOFF) {
        stopScroll();
      }
    }



    function animationLoop() {

      requestAnimationFrame(animationLoop);

      if (triggerScroll) {

        // Supply the scroller with a vertical positions
        mainPanel.scroller.scrollTop = easeOutCubic(
          iteration,                                      // current iteration
          currentScrollPos,                               // startValue
          -(currentScrollPos - SCROLL_UP_CUTOFF),         // future animation change in value
          70                                              // totalIterations
        );

        iteration++;
      }

      updateStates();
    }


    /**
     * Kicks off the animation to send the page back to the top
     */
    function animateToPageTop() {
      currentScrollPos = getScrollPosition();
      triggerScroll = true;
      iteration = 0;
    }

    scrollUpButton.addEventListener('click', animateToPageTop, false);

    // Mousewheel should be able to override scroll button action
    mainPanel.addEventListener('mousewheel', stopScroll, false);
    mainPanel.addEventListener('DOMMouseScroll', stopScroll, false);

    animationLoop();

  }




  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  app.appName = 'Google DevFest Twin Cities 2015';


  app.devfestStartTime = new Date(2015, 2, 21, 7);

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('template-bound', function () {
    console.log('Our app is ready to rock!');
    handleScrolling();
  });

  app.login = function () {
    this.$.baseLogin.login();
  };

  app.logout = function () {
    this.$.baseLogin.logout();
  };

  app.onLogin = function () {
    //console.log(this.user);
    //console.log(this.userList);
    this.globals.user = this.user;

    if (this.userList === null) {
      this.userList = {};
    }

    if (isUniqueUser(this.user, this.userList)) {
      this.userList[this.user.uid] = this.user;
      //this.userList.commit();
    }

    console.log(this.userList);

    //this.$.fbUsers.commit(this.user);
  };

  app.onLoginError = function () {
    console.log('Login Failed');
  };

  app.onLogout = function () {
    this.globals.user = undefined;
  };

  app.sideNavSelect = function (/*e, detail */) {
    console.log("Sidenav selection!");
    this.selectedRoute = this.$.navSelections.selected;
    this.$.router.go(this.selectedRoute);
  };

  function isUniqueUser(userObj, userListObj) {
    return !userListObj[userObj.uid];
  }


// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));

