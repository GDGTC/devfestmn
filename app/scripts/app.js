(function (document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  app.appName = 'Google DevFest Twin Cities';



  app.devfestStartTime = new Date(2015, 2, 21, 7);

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('template-bound', function() {
    console.log('Our app is ready to rock!');
  });

  app.login = function () {
    this.$.baseLogin.login();
  };

  app.logout = function () {
    this.$.baseLogin.logout();
  };

  app.onLogin = function () {
    this.globals.currentUser = this.user;
  };

  app.onLoginError = function () {
    console.log('Login Failed');
  };

  app.onLogout = function () {
    this.globals.currentUser = undefined;
  };




// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
