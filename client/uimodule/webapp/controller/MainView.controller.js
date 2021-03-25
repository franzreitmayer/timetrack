sap.ui.define([
    "eu/reitmayer/ttrack/client/timeTrack/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator"
], function(Controller, JSONModel, MessageBox, MessageToast, Fragment, BusyIndicator) {
    "use strict";

    // const REDIRECT_URL = "https://ttbucket-dev.s3.eu-central-1.amazonaws.com/index.html";
    const REDIRECT_URL = 'http://localhost:8080/index.html';
    const TIMETRACK_SERVICE_URL = 'https://v5d0p4616i.execute-api.eu-central-1.amazonaws.com/dev/timetrack';

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
                redirect_uri: REDIRECT_URL
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
                redirect_uri: REDIRECT_URL
            }
            await auth.logout(options);
        },

        clickRefresh: async function(event) {
            await this.updateData();
        },

        clickGetAccessToken: async function(event) {
            var auth = await this.createAuth();

            const idToken = await auth.getIdTokenClaims();
            console.log(`Please use Brearer Token: "${idToken.__raw}"`);
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
                    redirect_uri: REDIRECT_URL
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
            BusyIndicator.show();
            const bearerToken = await this.getBearerToken();
            const jsonData = await $.ajax({
                url: TIMETRACK_SERVICE_URL,
                type: 'GET',
                async: false,
                headers: {
                    "Authorization": `Bearer ${bearerToken}`
                }
            });

            console.log(jsonData);

            const jsonModel = new JSONModel(jsonData);
            this.getView().setModel(jsonModel);
            BusyIndicator.hide();
        },

        createTimetracking: async function(newEntryAsJSONString) {
            BusyIndicator.show();
            const bearerToken = await this.getBearerToken();
            console.log("Createing entry: " + newEntryAsJSONString);
            const jsonData = await $.ajax({
                url: TIMETRACK_SERVICE_URL,
                type: 'POST',
                async: false,
                data: newEntryAsJSONString,
                headers: {
                    "Authorization": `Bearer ${bearerToken}`
                }

            })
            BusyIndicator.hide();
        },

        updateTimetracking: async function(updatedEntryAsJSONString) {
            BusyIndicator.show();
            const bearerToken = await this.getBearerToken();
            console.log("Updating entry: " + updatedEntryAsJSONString);
            const jsonData = await $.ajax({
                url: TIMETRACK_SERVICE_URL,
                type: 'PATCH',
                async: false,
                data: updatedEntryAsJSONString,
                headers: {
                    "Authorization": `Bearer ${bearerToken}`,
                    "Content-Type": "application/json"
                }
            })
            BusyIndicator.hide();
        },

        deleteTimetracking: async function(timetrackIdToDelete) {
            
            const bearerToken = await this.getBearerToken();
            console.log(`Deleting entry with id ${timetrackIdToDelete}`);
            const resultData = await $.ajax({
                url: TIMETRACK_SERVICE_URL + `/${timetrackIdToDelete}`,
                type: 'DELETE',
                async: false,
                headers: {
                    "Authorization": `Bearer ${bearerToken}`,
                    "Content-Type": "application/json"
                }
            })
            
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

        clickDeleteEntry: async function() {
            const selectedTimetrack = await this.getSelectedEntry();
            if (!selectedTimetrack || !selectedTimetrack.trackingId) {
                MessageToast.show('Please select a timetrack entry first.');
            }
            const timetrackIdToDelete = selectedTimetrack.trackingId;
            try {
                await this.deleteTimetracking(timetrackIdToDelete);
                await this.updateData();
            } catch (err) {
                console.error(err);
            }
        },

        onDialogSave: async function() {
            const dialogModel = this.getView().getModel("dialog");
            console.log(dialogModel);
            console.log(dialogModel.getJSON());
            const model = JSON.parse(dialogModel.getJSON());
            if (model.trackingId) {
                // update
                await this.updateTimetracking(dialogModel.getJSON());
                await this.updateData();

            } else {
                // new entry
                await this.createTimetracking(dialogModel.getJSON());
                await this.updateData();
            }
            this.byId('detailDialog').close();
        },

        onDialogCancel: async function() {
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