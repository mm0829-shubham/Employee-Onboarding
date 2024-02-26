sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Controller, UIComponent, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("project1.controller.TeamLeadList", {
        onInit() {
        },

        onPressItEmployee: function (oEvent) {

            let sEmployeeId = oEvent.getSource().getTitle();
            this.getOwnerComponent().getRouter().navTo("TeamLeadListDetails", {
                TeamLeadListDetailsId: sEmployeeId,
            }); 
        },

        onSearchEmp: function (oEvent) {
            const sQuery = oEvent.getParameter("query").trim();
            const aFilters = [];

            if (sQuery) {

                const iQuery = parseInt(sQuery);
                if (!isNaN(iQuery)) {

                    const oEmpIdFilter = new sap.ui.model.Filter("empId", sap.ui.model.FilterOperator.EQ, iQuery);
                    aFilters.push(oEmpIdFilter);
                } else {

                    const oEmpNameFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery);
                    aFilters.push(oEmpNameFilter);
                }
            }

            const oList = this.byId("empList");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        }



    });
});

