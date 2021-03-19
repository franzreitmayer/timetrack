sap.ui.define([
  "eu/reitmayer/ttrack/client/timeTrack/controller/BaseController"
], function(Controller) {
  "use strict";

  return Controller.extend("eu.reitmayer.ttrack.client.timeTrack.controller.MainView", {

    clickLogon: async function (event) {
      alert("logon");
      // var auth0 = createAuth0Client({
      //   domain: "reitmayer.eu.auth0.com",
      //   client_id: "LF6aDev4lIeglOOGdajUE4ZT9cS9yTZB"
      // }).then( (auth) => {console.log("Authenticted: "  + JSON.stringify(auth) );}).catch( (err) => {console.log(err);})
      var auth = await createAuth0Client({
           domain: "reitmayer.eu.auth0.com",
           client_id: "LF6aDev4lIeglOOGdajUE4ZT9cS9yTZB"
         });

      const options = {
        redirect_uri : "http://localhost:8080/index.html"
      }
      console.log(auth);
      
      try {
        const token = await auth.getTokenSilently();
        console.log(`Bearer Token: ${token}`)
      } catch (err) {
        console.err("Cannot get token " + JOSN.stringify(err));
      }
      await auth.logout();
      await auth.loginWithRedirect(options);
      alert('logon end');
    },

    clickLogoff: async function (event) {

    }
  });
});
