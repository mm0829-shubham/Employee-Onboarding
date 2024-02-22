sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/base/DataType',
  'sap/ui/core/Fragment',
  "sap/m/MessageToast",
  
], function (Controller, JSONModel, MessageToast,Fragment) {
  "use strict";

  return Controller.extend("project1.controller.EmployeeDetails", {


    onInit: function () {
      this.getOwnerComponent().getRouter().getRoute("EmployeeDetails").attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatched: function (oEvent) {
      var sEmployeeId = oEvent.getParameter("arguments").EmployeeId;

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
      this.getOwnerComponent().getRouter().navTo("RouteView1");
    },

    onEdit: function () {
      if (!this.pDialog) {
        this.pDialog = Fragment.load({
          id: this.getView().getId(),
          name: "project1.view.EditEmployee",
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

    onSaveEmployee: function (oEvent) {
      var sEmployeeId = oEvent.getParameter("arguments").EmployeeId;
      const sSelectedPosition = this.getView().byId("position").getSelectedKey();
  
      const url = `${this.getOwnerComponent().getModel("employee").getServiceUrl()}Employees/('${sEmployeeId}')`;
  
      if (sSelectedPosition) {
          const oData = {
              position: sSelectedPosition
          };
  
          $.ajax({
              method: "PATCH",
              url: url,
              contentType: "application/json",
              data: JSON.stringify(oData),
              success: () => {
                  MessageToast.show("Employee Position updated successfully!");
              },
              error: (error) => {
                  console.error(error);
              },
          });
      }
  
      this.onCancelEmployee();
  },
    onCancelEmployee() {
      this.byId("editEmployee").close();
  },



  })
});