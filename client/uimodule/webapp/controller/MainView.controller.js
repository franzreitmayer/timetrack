sap.ui.define([
    "eu/reitmayer/ttrack/client/timeTrack/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("eu.reitmayer.ttrack.client.timeTrack.controller.MainView", {

        onInit: async function() {
            // alert('Main controller initialized');
            console.log(authenticationClient);
            await this.handleAuthentication();

            alert("auth");

        },

        clickLogon: async function(event) {
            //alert("logon");
            // var auth0 = createAuth0Client({
            //   domain: "reitmayer.eu.auth0.com",
            //   client_id: "LF6aDev4lIeglOOGdajUE4ZT9cS9yTZB"
            // }).then( (auth) => {console.log("Authenticted: "  + JSON.stringify(auth) );}).catch( (err) => {console.log(err);})
            var auth = await createAuth0Client({
                domain: "reitmayer.eu.auth0.com",
                client_id: "LF6aDev4lIeglOOGdajUE4ZT9cS9yTZB"
            });

            const options = {
                redirect_uri: "http://localhost:8080/index.html"
            }
            console.log(auth);

            await auth.loginWithRedirect(options);


            alert('logon end');
        },

        clickLogoff: async function(event) {
            var auth = await createAuth0Client({
                domain: "reitmayer.eu.auth0.com",
                client_id: "LF6aDev4lIeglOOGdajUE4ZT9cS9yTZB"
            });
            const options = {
                redirect_uri: "http://localhost:8080/index.html"
            }
            await auth.logout(options);
        },

        clickGetAccessToken: async function(event) {
            var auth = await createAuth0Client({
                domain: "reitmayer.eu.auth0.com",
                client_id: "LF6aDev4lIeglOOGdajUE4ZT9cS9yTZB"
            });
            console.log("")
            try {
                const token = await auth.getTokenSilently();
                console.log(`Bearer Token: ${token}`)
            } catch (err) {
                console.log("Cannot get token " + JSON.stringify(err));
            }

            const idToken = await auth.getIdTokenClaims();
            console.log("Id Token: " + JSON.stringify(idToken));
        },

        handleAuthentication: async function() {
            let auth = await this.createAuth();

            if (!await auth.isAuthenticated()) {
              const query = window.location.search;
              const shouldParseResult = query.includes("code=") && query.includes("state=");
              if (shouldParseResult) {
                auth.handleRedirectCallback();
                const isAuthenticated = await auth.isAuthenticated();
                console.log(`authenticated ${isAuthenticated}`);
               }  else {
                await this.login();
              }
            }

        },

        login: async function() {
            let auth = await this.createAuth();

            const options = {
                    redirect_uri: "http://localhost:8080/index.html"
                }
                // console.log(this.auth);

            await auth.loginWithRedirect(options);
        },

        createAuth: async function() {
            try {
                var auth0 = await createAuth0Client({
                    domain: "reitmayer.eu.auth0.com",
                    client_id: "LF6aDev4lIeglOOGdajUE4ZT9cS9yTZB"
                });
                return auth0;
            } catch (err) {
                MessageBox.show(
                    "Error creating authorization client", {
                        icon: MessageBox.Icon.ERROR,
                        title: "Error on authorization",
                        actions: [MessageBox.Action.OK]
                    });
            }
        }

    });
});