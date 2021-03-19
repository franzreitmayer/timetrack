sap.ui.define([
    "eu/reitmayer/ttrack/client/timeTrack/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("eu.reitmayer.ttrack.client.timeTrack.controller.MainView", {

        onInit: async function() {
            // alert('Main controller initialized');
            var jsonData = null;
            $.ajax({
                method: "GET",
                url: "https://v5d0p4616i.execute-api.eu-central-1.amazonaws.com/dev/timetrack",
                dataType: "JSON",
                async: false
            }).done(function(data) {
                console.log(data)
                jsonData = data;
            });
            var oModel = new JSONModel(jsonData);
            this.getView().setModel(oModel);

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
        }
    });
});