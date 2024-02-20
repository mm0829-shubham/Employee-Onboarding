sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",    
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function(Controller, UIComponent,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
           },

        onPressEmployee: function(oEvent) {
          
            let sEmployeeId = oEvent.getSource().getTitle();
            this.getOwnerComponent().getRouter().navTo("EmployeeDetails", {
                EmployeeId: sEmployeeId,
            });
        },

        onSearchEmp: function(oEvent) {
            const sQuery = oEvent.getParameter("query").trim();
            const aFilters = [];
        
            if (sQuery) {
                // If search query is provided
                const iQuery = parseInt(sQuery);
                if (!isNaN(iQuery)) {
                    // If the search query can be parsed to an integer
                    const oEmpIdFilter = new sap.ui.model.Filter("empId", sap.ui.model.FilterOperator.EQ, iQuery);       
                    aFilters.push(oEmpIdFilter);
                } else {
                    // If the search query is not a valid integer, search by name instead
                    const oEmpNameFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery);
                    aFilters.push(oEmpNameFilter);
                }
            }
        
            // Apply filters to the list binding
            const oList = this.byId("empList");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        }
        
       

    });
});
