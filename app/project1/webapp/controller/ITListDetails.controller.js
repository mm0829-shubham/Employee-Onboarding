sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/base/DataType',
  'sap/ui/core/Fragment',
  "sap/m/MessageBox",
  "sap/suite/ui/microchart/ComparisonMicroChart",
  "sap/suite/ui/microchart/ComparisonMicroChartData"

], function (Controller, JSONModel, DataType, Fragment, MessageBox, ComparisonMicroChart, ComparisonMicroChartData) {
  "use strict";

  return Controller.extend("project1.controller.ITListDetails", {


    onInit: function () {

      this.getOwnerComponent().getRouter().getRoute("ITListDetails").attachPatternMatched(this._onObjectMatched, this);
      let newfeedModel = this.getView().getModel("feedModel")
      var oFeedModel = new JSONModel(newfeedModel);
			this.getView().setModel(oFeedModel);

    },

    _onObjectMatched: function (oEvent) {
      var sEmployeeId = oEvent.getParameter("arguments").ITListDetailsId;
      this._empId = sEmployeeId;
      if (!sEmployeeId) {
        return;
      }

      var oView = this.getView();

      var oModel = oView.getModel("employee");
      if (!oModel) {
        return;
      }

      var sPath = `/Employees/${sEmployeeId}`;
      oView.bindElement({
        path: sPath,
        model: "employee"
      });
      this.byId("idPage").bindElement(sPath);
    },
    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("ITList");
    },

    onEdit: function () {
      if (!this.pDialog) {
        this.pDialog = Fragment.load({
          id: this.getView().getId(),
          name: "project1.view.ITEdit",
          controller: this,
        }).then((oDialog) => {
          this.getView().addDependent(oDialog);
          return oDialog;
        });
      }
      this.pDialog.then((oDialog) => {
        oDialog.open();
      });
    },

    //   onSaveEmployee: function(oEvent) {
    //     var sEmployeeId = oEvent.getParameter("arguments").EmployeeId;
    //     const sSelectedPosition = this.getView().byId("position").getSelectedKey();

    //     const url = `${this.getOwnerComponent().getModel("employee").getServiceUrl()}/Employees/('${sEmployeeId}')`;

    //     if (sSelectedPosition) {
    //         const oData = {
    //             position: sSelectedPosition
    //         };

    //         $.ajax({
    //             method: "PATCH",
    //             url: url,
    //             contentType: "application/json",
    //             data: JSON.stringify(oData),
    //             success: () => {
    //                 MessageToast.show("Employee Position updated successfully!");
    //             },
    //             error: (error) => {
    //                 console.error(error);
    //             },
    //         });
    //     }

    //     this.onCancelEmployee();
    // },




    onItSaveEmp: function (oEvent) {
      var sEmployeeId = this._empId;
      var sSelectedItStatus = this.getView().getModel("employeeModel").getProperty("/EditEmployee/itStatus");
      var sMouse = this.getView().getModel("employeeModel").getProperty("/EditEmployee/mouse");
      var sLaptop = this.getView().getModel("employeeModel").getProperty("/EditEmployee/laptop");

      var status1;

      if (sSelectedItStatus == "Pending") {
        status1 = "Warning"
      }
      if (sSelectedItStatus == "Approve") {
        status1 = "Success"
      }
      if (sSelectedItStatus == "Reject") {
        status1 = "Error"
      }

      if (sSelectedItStatus && sMouse && sLaptop) {
        var oData = {
          itStatus: sSelectedItStatus,
          mouse: sMouse,
          laptop: sLaptop,
          itFlowStatus: status1
        };

        $.ajax({
          method: "PATCH",
          url: `https://port4004-workspaces-ws-6h6fc.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Employees/${sEmployeeId}`,
          contentType: "application/json",
          data: JSON.stringify(oData),
          success: (data) => {
            MessageBox.show("Employee data updated successfully!");
            // Call onCancelEmployee() here since the AJAX request is successful

          },
          error: (error) => {
            console.error(error);
          },
        });
        this.onCancelEmployee();
      }
    },

    onCancelEmployee() {
      this.byId("editEmployee").close();
    },


    

    //////////////----Feed Inputs (Comments)--------////////////////////////////////////////////////////////////////////////
    
    
    onPost: function (oEvent) {
      // var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
      // var oDate = new Date();
      // var sDate = oFormat.format(oDate);
      // Get the current date and time in medium style format
      var oDate = new Date();
      var sDate = oDate.toLocaleDateString(undefined, { style: 'medium' }) + ' ' + oDate.toLocaleTimeString(undefined, { style: 'medium' });

      // create new entry
      var sValue = oEvent.getParameter("value");
      var oEntry = {
        Author: "IT Department",
        AuthorPicUrl: "sap-icon://action-settings",
        Type: "Reply",
        Date: "" + sDate,
        Text: sValue
      };

      // update model
      var oModel = this.getView().getModel("feedModel");
      var aEntries = oModel.getData().EntryCollection;
      aEntries.unshift(oEntry);
      oModel.setData({
        EntryCollection: aEntries
      });
    },

    onSenderPress: function (oEvent) {
      MessageBox.show("Clicked on Link: " + oEvent.getSource().getSender());
    },

    onIconPress: function (oEvent) {
      MessageBox.show("Clicked on Image: " + oEvent.getSource().getSender());
    }







  })
});