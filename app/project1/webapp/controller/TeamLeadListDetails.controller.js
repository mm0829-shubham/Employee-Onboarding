sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/base/DataType',
  'sap/ui/core/Fragment',
  "sap/m/MessageBox",
  "sap/suite/ui/microchart/ComparisonMicroChart",
  "sap/suite/ui/microchart/ComparisonMicroChartData",
  "sap/ui/core/format/DateFormat",
  "sap/m/MessageToast",

], function (Controller, JSONModel, DataType, Fragment, MessageBox, ComparisonMicroChart, ComparisonMicroChartData,DateFormat,MessageToast) {
  "use strict";

  return Controller.extend("project1.controller.TeamLeadListDetails", {


    onInit: function () {

      this.getOwnerComponent().getRouter().getRoute("TeamLeadListDetails").attachPatternMatched(this._onObjectMatched, this);

      var sPath = sap.ui.require.toUrl("sap/m/sample/Feed/feed.json");
      var oModel = new JSONModel(sPath);
      this.getView().setModel(oModel);

    },

    _onObjectMatched: function (oEvent) {
      var sEmployeeId = oEvent.getParameter("arguments").TeamLeadListDetailsId;
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
      this.getOwnerComponent().getRouter().navTo("TeamLeadList");
    },

    onEdit: function () {
      if (!this.pDialog) {
        this.pDialog = Fragment.load({
          id: this.getView().getId(),
          name: "project1.view.TLEdit",
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



    onTlSaveEmp: function (oEvent) {
      var sEmployeeId = this._empId;
      var sSelectedTlStatus = this.getView().getModel("employeeModel").getProperty("/EditEmployee/tlStatus");
      var sDepartment = this.getView().getModel("employeeModel").getProperty("/EditEmployee/department");
      var sPosition = this.getView().getModel("employeeModel").getProperty("/EditEmployee/position");

      var status1;

      if (sSelectedTlStatus == "Pending") {
        status1 = "Warning"
      }
      if (sSelectedTlStatus == "Approve") {
        status1 = "Success"
      }
      if (sSelectedTlStatus == "Reject") {
        status1 = "Error"
      }

      if (sSelectedTlStatus && sPosition && sDepartment) {
        var oData = {
          tlStatus: sSelectedTlStatus,
          position: sPosition,
          department: sDepartment,
          tlFlowStatus: status1
        };

        $.ajax({
          method: "PATCH",
          url: `${this.getOwnerComponent().getModel("employee").getServiceUrl()}Employees/${sEmployeeId}`,
          contentType: "application/json",
          data: JSON.stringify(oData),
          success: (data) => {
            MessageBox.show("Employee data updated successfully!");
            // Call onCancelEmployee() here since the AJAX request is successful

            this.getView().getModel("employee").refresh();
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

    

    //////////////----Feed Inputs (Comments)--------///////////////////////
    
    
    onPost: function (oEvent) {
      var sEmployeeId = Number(this._empId);
      console.log("sEmployeeId", sEmployeeId)
      var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
      var oDate = new Date();
      var sDate = oFormat.format(oDate);


      // create new entry
      var sValue = oEvent.getParameter("value");
      var oEntry = {
        author: "Team Lead / Manager",
        authorPicUrl: "sap-icon://manager",
        type: "Reply",
        Date: "" + sDate,
        comment: sValue,
        empId: sEmployeeId
      };
      if (oEntry) {
        $.ajax({
          method: "POST",
          url: `${this.getOwnerComponent().getModel("employee").getServiceUrl()}Comments`,
          contentType: "application/json",
          data: JSON.stringify(oEntry),
          success: (data) => {

            MessageToast.show("Comments successfully!");
            
            this.getView().getModel("employee").refresh();},
          error: (error) => {
            console.error(error);
          },
        });

      }




    },

    onSenderPress: function (oEvent) {
      MessageToast.show(oEvent.getSource().getSender());
    },

    onIconPress: function (oEvent) {
      MessageToast.show(oEvent.getSource().getSender() + "Photo");
    },






  })
});