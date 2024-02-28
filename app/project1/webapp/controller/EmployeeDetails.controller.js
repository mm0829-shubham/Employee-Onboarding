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
  "../model/formatter"


], function (Controller, JSONModel, DataType, Fragment, MessageBox, ComparisonMicroChart, ComparisonMicroChartData, OverflowToolbarButton, Dijkstra, formatter) {
  "use strict";

  return Controller.extend("project1.controller.EmployeeDetails", {

    formatter: formatter,

    onInit: function () {

      this.getOwnerComponent().getRouter().getRoute("EmployeeDetails").attachPatternMatched(this._onObjectMatched, this);
      // var sPath = sap.ui.require.toUrl("sap/m/sample/Feed/feed.json");
      // var oModel = new JSONModel(sPath);
      // this.getView().setModel(oModel);

      //   var sModuleName = "sap/suite/ui/commons/sample/NetworkGraphBidirectionalCollapsing",
      //   oModel = new JSONModel(sap.ui.require.toUrl(sModuleName + "/graph.json")),
      //   oView = this.getView(),
      //   oGraph = oView.byId("graph");

      // function hideChildNodes(oNode) {
      //   oNode.getChildNodes().forEach(function (oChild) {
      //     oChild.setHidden(true);
      //     hideChildNodes(oChild);
      //   });
      // }
      // function hideParentNodes(oNode) {
      //   oNode.getParentNodes().forEach(function (oParent) {
      //     oParent.setHidden(true);
      //     hideParentNodes(oParent);
      //   });
      // }
      // function hideAllNodes() {
      //   var oVisibleNode = oGraph.getNodeByKey("19");
      //   if (oVisibleNode) {
      //     hideChildNodes(oVisibleNode);
      //     hideParentNodes(oVisibleNode);
      //     oVisibleNode.setStatusIcon(STATUS_ICON);
      //     fixNodeState(oVisibleNode);
      //     oGraph.scrollToElement(oVisibleNode);
      //   }
      // }

      // oView.setModel(oModel);
      // oGraph.attachBeforeLayouting(hideAllNodes);
      // oGraph.getToolbar().addContent(new OverflowToolbarButton({
      //   icon: "sap-icon://collapse-all",
      //   tooltip: "Collapse all nodes",
      //   type: "Transparent",
      //   press: hideAllNodes
      // }));
      // oGraph.attachSelectionChange(this.selectionChange, this);

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



    //   onSaveEmployee: function(oEvent) {
    //     var sEmployeeId = this._empId;
    //     var sEmailId = this.getView().getModel("employeeModel").getProperty("/EditEmployee/email");
    //     var sSelectedHrStatus = this.getView().getModel("employeeModel").getProperty("/EditEmployee/hrStatus"); 
    //     console.log("sSelectedHrStatus",this.getView().getModel("employeeModel"))   
    //     var smmId = this.getView().getModel("employeeModel").getProperty("/EditEmployee/mmId");

    //     if (!smmId) {
    //         smmId = "mm001";
    //     } else {
    //         smmId = "mm" + (parseInt(smmId.substring(2)) + 1);
    //     }

    //     if (sSelectedHrStatus && sEmailId) {
    //         var oData = {
    //             email: sEmailId,
    //             hrStatus: sSelectedHrStatus,
    //             mmId: smmId
    //         };

    //         $.ajax({
    //             method: "PATCH",
    //             url: `https://port4004-workspaces-ws-6h6fc.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Employees/${sEmployeeId}`,
    //             contentType: "application/json",
    //             data: JSON.stringify(oData),
    //             success: (data) => {
    //                 MessageBox.show("Employee data updated successfully!");
    //                 // Call onCancelEmployee() here since the AJAX request is successful

    //             },
    //             error: (error) => {
    //                 console.error(error);
    //             },
    //         }); 
    //         this.onCancelEmployee();      
    //     }
    // },

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
    // onSaveEmployee: function(oEvent) {
    //   var sEmployeeId = this._empId;
    //   var sEmailId = this.getView().getModel("employeeModel").getProperty("/EditEmployee/email");
    //   var sSelectedHrStatus = this.getView().getModel("employeeModel").getProperty("/EditEmployee/hrStatus"); 
    //   // var smmId = this.getView().getModel("employeeModel").getProperty("/EditEmployee/mmId");

    //   // Function to update employee data



    //           // Check if mmId exists in the employee model
    //           var oEmployeeModel = this.getView().getModel("employee");
    //           var aEmployees = oEmployeeModel.getProperty("/Employees/mmId");
    //           var bUpdated = false;
    //           for (var i = 0; i < aEmployees.length; i++) {
    //               if (aEmployees[i].mmId === smmId) {
    //                  let smmId = "mm" + (parseInt(smmId.substring(2)) + 1);
    //                   bUpdated = true;
    //                   break;
    //               }
    //           }

    //           // If mmId not found in model, it's a new entry
    //           if (!bUpdated) {
    //               // Set the new mmId
    //               oData.mmId = smmId;
    //           }
    //           if (sSelectedHrStatus && sEmailId) {
    //             var oData = {
    //                 email: sEmailId,
    //                 hrStatus: sSelectedHrStatus,
    //                 mmId: smmId
    //             };
    //           }

    //           // AJAX request to update employee data
    //           $.ajax({
    //               method: "PATCH",
    //               url: `https://port4004-workspaces-ws-6h6fc.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Employees/${sEmployeeId}`,
    //               contentType: "application/json",
    //               data: JSON.stringify(oData),
    //               success: (data) => {
    //                   MessageBox.show("Employee data updated successfully!");
    //                   // Call onCancelEmployee() here since the AJAX request is successful

    //               },
    //               error: (error) => {
    //                   console.error(error);
    //               },
    //           }); 
    //           this.onCancelEmployee();      


    // },

    onCancelEmployee() {
      this.byId("editEmployee").close();
    },
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
        Author: "Alexandrina Victoria",
        AuthorPicUrl: "http://upload.wikimedia.org/wikipedia/commons/a/aa/Dronning_victoria.jpg",
        Type: "Reply",
        Date: "" + sDate,
        Text: sValue
      };

      // update model
      var oModel = this.getView().getModel();
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