sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/base/DataType',
  'sap/ui/core/Fragment',
  "sap/m/MessageBox",
  "sap/suite/ui/microchart/ComparisonMicroChart",
  "sap/suite/ui/microchart/ComparisonMicroChartData",
  "sap/m/OverflowToolbarButton",
  "sap/suite/ui/commons/networkgraph/util/Dijkstra",
  "../model/formatter",
  "sap/ui/core/format/DateFormat",
  "sap/m/MessageToast",


], function (Controller, JSONModel, DataType, Fragment, MessageBox, ComparisonMicroChart, ComparisonMicroChartData, OverflowToolbarButton, Dijkstra, formatter,DateFormat,MessageToast) {
  "use strict";

  return Controller.extend("project1.controller.EmployeeDetails", {

    formatter: formatter,

    onInit: function () {

      this.getOwnerComponent().getRouter().getRoute("EmployeeDetails").attachPatternMatched(this._onObjectMatched, this);
      let newfeedModel = this.getView().getModel("feedModel")
      var oFeedModel = new JSONModel(newfeedModel);
			this.getView().setModel(oFeedModel);
    },

    _onObjectMatched: function (oEvent) {
      var sEmployeeId = oEvent.getParameter("arguments").EmployeeId;
      this._empId = sEmployeeId;
      if (!sEmployeeId) {
        return;
      }
      this.fnBindData();
    },

    fnBindData: function () {
      var oView = this.getView();

      var oModel = oView.getModel("employee");
      if (!oModel) {
        return;
      }

      var sPath = `/Employees/${this._empId}`;
      oView.bindElement({
        path: sPath,
        model: "employee"
      });
      this.byId("idPage").bindElement(sPath);
    },



    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("JuniorHrList");
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
      var sEmployeeId = this._empId;
      var sEmailId = this.getView().getModel("employeeModel").getProperty("/EditEmployee/email");
      var sSelectedHrStatus = this.getView().getModel("employeeModel").getProperty("/EditEmployee/hrStatus");
      var smmId = this.getView().getModel("employeeModel").getProperty("/EditEmployee/mmId");
      var status1;

      if (sSelectedHrStatus == "Pending") {
        status1 = "Warning"
      }
      if (sSelectedHrStatus == "Approve") {
        status1 = "Success"
      }
      if (sSelectedHrStatus == "Reject") {
        status1 = "Error"
      }
      // Check if smmId is already present in the database
      if (smmId) {
        $.ajax({
          method: "GET",
          url: `https://port4004-workspaces-ws-6h6fc.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Employees?$filter=mmId eq '${smmId}'`,
          success: (data) => {
            if (data && data.value && data.value.length > 0) {
              // If mmId already exists, increment it
              smmId = "mm" + (parseInt(smmId.substring(2)) + 1);
            }
            // Continue with the update
            updateEmployee();
          },
          error: (error) => {
            console.error(error);
          },
        });
      } else {
        // If smmId doesn't exist, set it to default
        smmId = "mm001";
        // Continue with the update
        updateEmployee();
      }

      // Function to update employee data
      function updateEmployee() {
        if (sSelectedHrStatus && sEmailId) {
          var oData = {
            email: sEmailId,
            hrStatus: sSelectedHrStatus,
            mmId: smmId,
            jrHrFlowStatus: status1

          };

          $.ajax({
            method: "PATCH",
            url: `https://port4004-workspaces-ws-6h6fc.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Employees/${sEmployeeId}`,
            contentType: "application/json",
            data: JSON.stringify(oData),
            success: (data) => {
              MessageBox.show("Employee data updated successfully!");
              // Call onCancelEmployee() here since the AJAX request is successful
              this.onCancelEmployee();
            },
            error: (error) => {
              console.error(error);
            },
          });

        }
      }
      this.getView().getModel("employee").refresh();
      this.fnBindData();
      this.onCancelEmployee();
    },
    
    onCancelEmployee() {
      this.byId("editEmployee").close();
    },

//////////////Feed Input//////////////////////////////////////////////////////////////////////////////////


    onPost: function(oEvent) {
			var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
			var oDate = new Date();
			var sDate = oFormat.format(oDate);

      
			// create new entry
			var sValue = oEvent.getParameter("value");
			var oEntry = {
				Author: "Junior Hr",
				AuthorPicUrl: "sap-icon://hr-approval",
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

		onSenderPress: function(oEvent) {
			MessageToast.show("Clicked on Link: " + oEvent.getSource().getSender());
		},

		onIconPress: function(oEvent) {
			MessageToast.show("Clicked on Image: " + oEvent.getSource().getSender());
		},





    ////////////////////////NETWORK GRAPH//////////////////////////////////////////////////////////////////////////

    selectionChange: function (oEvent) {
      var oSelectedItem = oEvent.getParameter("items");
      if (oSelectedItem.length !== 1) {
        return;
      }
      oSelectedItem = oSelectedItem[0];
      var oGraph = this.getView().byId("graph"),
        aSelectedNodes = oGraph.getNodes().filter(function (oNode) {
          return oNode.getSelected();
        });
      if (aSelectedNodes.length === 2) {
        oGraph.getLines().forEach(function (oLine) {
          oLine.setStatus("Standard");
        });
        if (oSelectedItem !== aSelectedNodes[0] && oSelectedItem !== aSelectedNodes[1]) {
          oSelectedItem = aSelectedNodes[0];
        }
        var oFrom = (aSelectedNodes[0] === oSelectedItem) ? aSelectedNodes[1] : aSelectedNodes[0],
          oTo = oSelectedItem,
          oDijkstra = new Dijkstra(oGraph, oFrom, { bIgnoreDirections: true, bIgnoreCollapsed: true });
        var aPath = oDijkstra.getShortestPathTo(oTo);
        aPath.forEach(function (oLine) {
          oLine.setStatus("Warning");
        });
      }
    },
    leftExpandPressed: function (oEvent) {
      var oNode = oEvent.getSource().getParent();
      var bExpand = hasHiddenParent(oNode);
      oNode.getParentNodes().forEach(function (oChild) {
        oChild.setHidden(!bExpand);
      });
      oNode.getParentNodes().forEach(function (oChild) {
        fixNodeState(oChild);
        oChild.getParentNodes().forEach(fixNodeState);
        oChild.getChildNodes().forEach(fixNodeState);
      });
    },
    leftMultiExpandPressed: function (oEvent) {
      var oNode = oEvent.getSource().getParent();
      var aNodes = [];
      function getParents(oNode) {
        oNode.getParentNodes().forEach(function (n) {
          aNodes.push(n);
          getParents(n);
        });
      }
      getParents(oNode);
      aNodes.forEach(function (n) {
        n.setHidden(false);
      });
      aNodes.forEach(function (n) {
        fixNodeState(n);
        n.getParentNodes().forEach(fixNodeState);
        n.getChildNodes().forEach(fixNodeState);
      });
    },
    rightExpandPressed: function (oEvent) {
      var oNode = oEvent.getSource().getParent();
      var bExpand = hasHiddenChild(oNode);
      oNode.getChildNodes().forEach(function (oChild) {
        oChild.setHidden(!bExpand);
      });
      oNode.getChildNodes().forEach(function (oChild) {
        fixNodeState(oChild);
        oChild.getParentNodes().forEach(fixNodeState);
        oChild.getChildNodes().forEach(fixNodeState);
      });
    },
    rightMultiExpandPressed: function (oEvent) {
      var oNode = oEvent.getSource().getParent();
      var aNodes = [];
      function getChildren(oNode) {
        oNode.getChildNodes().forEach(function (n) {
          aNodes.push(n);
          getChildren(n);
        });
      }
      getChildren(oNode);
      aNodes.forEach(function (n) {
        n.setHidden(false);
      });
      aNodes.forEach(function (n) {
        fixNodeState(n);
        n.getParentNodes().forEach(fixNodeState);
        n.getChildNodes().forEach(fixNodeState);
      });
    }



  })
});