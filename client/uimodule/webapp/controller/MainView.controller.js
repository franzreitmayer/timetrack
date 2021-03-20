sap.ui.define([
    "eu/reitmayer/ttrack/client/timeTrack/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function(Controller, JSONModel, MessageBox, Fragment) {
    "use strict";

    return Controller.extend("eu.reitmayer.ttrack.client.timeTrack.controller.MainView", {

        onInit: async function() {
            // alert('Main controller initialized');
            console.log(authenticationClient);
            await this.handleAuthentication();

            //  alert("auth");

            this.updateData()
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
                } else {
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
        },

        updateData: async function() {
            const bearerToken = await this.getBearerToken();

            console.log(bearerToken);

            const jsonData = await $.ajax({
                url: 'https://v5d0p4616i.execute-api.eu-central-1.amazonaws.com/dev/timetrack',
                type: 'GET',
                async: false,
                headers: {
                    "Authorization": `Bearer ${bearerToken}`
                }
            });

            console.log(jsonData);

            const jsonModel = new JSONModel(jsonData);
            this.getView().setModel(jsonModel);
        },

        getBearerToken: async function() {
            let auth = await this.createAuth();

            const idToken = await auth.getIdTokenClaims();

            const bearerToken = idToken.__raw;

            return bearerToken;

        },

        clickNewEntry: async function() {
            let view = this.getView();

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: view.getId(),
                    name: "eu.reitmayer.ttrack.client.timeTrack.view.DetailDialog",
                    controller: this
                }).then(function(oDialog) {
                    view.addDependent(oDialog);
                    return oDialog;
                });
            }
            this.pDialog.then(function(oDialog) {
                let dialogJsonData = {
                    "shortDescription": "",
                    "attachmentURL": "",
                    "trackTo": (new Date()).toDateString(),
                    "trackFrom": (new Date()).toISOString(),
                    "longDescription": "",
                    "invoiced": false
                };
                let dialogJsonModel = new JSONModel(dialogJsonData);
                view.setModel(dialogJsonModel, "dialog");
                oDialog.open();
            });
        },

        onDialogSave: async function() {
            const dialogModel = this.getView().getModel("dialog");
            console.log(dialogModel);
            console.log(dialogModel.getJSON());
            this.byId('detailDialog').close();
        },

        clickEditEntry: async function() {
            const selectedItem = await this.getSelectedEntry();
            await this.displayDialog(selectedItem);


        },

        getSelectedEntry: async function() {
            const table = this.byId("table");
            const arrayOfSelectedRows = await table.getSelectedIndices();
            console.log(arrayOfSelectedRows);

            if (arrayOfSelectedRows && arrayOfSelectedRows.length > 0) {
                const selectedIndex = arrayOfSelectedRows[0];
                const jsonData = JSON.parse(this.getModel().getJSON());

                const selectedItem = jsonData.items[selectedIndex];
                console.log(selectedItem);
                return selectedItem;
            }
            return {};
        },

        displayDialog: async function(itemToDisplay) {
            let view = this.getView();

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: view.getId(),
                    name: "eu.reitmayer.ttrack.client.timeTrack.view.DetailDialog",
                    controller: this
                }).then(function(oDialog) {
                    view.addDependent(oDialog);
                    return oDialog;
                });
            }
            this.pDialog.then(function(oDialog) {

                let dialogJsonModel = new JSONModel(itemToDisplay);
                view.setModel(dialogJsonModel, "dialog");
                oDialog.open();
            });
        }

    });
});