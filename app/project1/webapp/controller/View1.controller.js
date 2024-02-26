sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {

            },

            //Login
            onLoginPress: function () {
                var that = this;
                var empid = this.getView().byId("empIdInput")._lastValue;
                // var EmpPassword = this.getView().byId("passwordInput").getValue();
                var emppassword = this.getView().byId("passwordInput")._lastValue;
                // console.log(this.getView().byId("passwordInput")._lastValue);

                // Load the user data from the JSON file
                $.ajax({
                    url: "https://port4004-workspaces-ws-6h6fc.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Employees",
                    type: "GET",
                    dataType: "json",
                    success: function () {
                        // console.log(data);                        
                        //    console.log(validCredentials);
                        if (empid && emppassword) {
                            if (empid == 1 && emppassword == 123) {
                                MessageBox.success("Login successfull ")
                                // let Emp_Id = e.getSource().getTitle();
                                // console.log(Emp_Id);
                                let oRouter = that.getOwnerComponent().getRouter();
                                oRouter.navTo("JuniorHrList");
                            }
                            else if (empid == 2 && emppassword == 123) {
                                MessageBox.success("Login successfull ")
                                // let Emp_Id = e.getSource().getTitle();
                                // console.log(Emp_Id);
                                let oRouter = that.getOwnerComponent().getRouter();
                                oRouter.navTo("ITList");
                            }
                            else if (empid == 3 && emppassword == 123) {
                                MessageBox.success("Login successfull ")
                                // let Emp_Id = e.getSource().getTitle();
                                // console.log(Emp_Id);
                                let oRouter = that.getOwnerComponent().getRouter();
                                oRouter.navTo("FinList");
                            }
                            else if (empid == 4 && emppassword == 123) {
                                MessageBox.success("Login successfull ")
                                // let Emp_Id = e.getSource().getTitle();
                                // console.log(Emp_Id);
                                let oRouter = that.getOwnerComponent().getRouter();
                                oRouter.navTo("TeamLeadList");
                            }
                            else if (empid == 5 && emppassword == 123) {
                                MessageBox.success("Login successfull ")
                                // let Emp_Id = e.getSource().getTitle();
                                // console.log(Emp_Id);
                                let oRouter = that.getOwnerComponent().getRouter();
                                oRouter.navTo("HeadHrList");
                            }

                            else {
                                MessageBox.error("Login failed")
                            }


                        }
                        else {
                            MessageBox.error("UserId and Password is Required!")
                        }

                    },
                    error: function (error) {
                        MessageBox.error("Error fetching employee data:", error);
                    }
                });
            },
        });
    });