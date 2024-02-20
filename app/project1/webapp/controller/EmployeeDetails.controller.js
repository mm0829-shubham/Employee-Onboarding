sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",

], function(Controller, JSONModel, MessageToast, Fragment, Filter, FilterOperator) {
    "use strict";
	

  return Controller.extend("project1.controller.EmployeeDetails", {
	_Emp_Id: null,
        onInit: function() {
            this.getOwnerComponent().getRouter().getRoute("EmployeeDetails").attachPatternMatched(this._onObjectMatched, this);       
        },
        _onObjectMatched: function (oEvent) {
            var sDepartmentId = oEvent.getParameter("arguments").EmployeeId;
            var oView = this.getView();
            oView.bindElement({
              path: `/Employees('${sDepartmentId}')`,
              model: "employee",              
            });
          },
		  



        

	




	});

	
  
});
