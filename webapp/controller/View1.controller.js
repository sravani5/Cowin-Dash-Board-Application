sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("cowinappZCowinApp.controller.View1", {
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._onLoadStates();
			// this.oRouter.getRoute("Main").attachMatched(this._onRouteMatched, this);	
			// this.getOwnerComponent().getModel("data").setProperty("/dateValue", new Date());

			var oViewModel = new JSONModel({
				isSearchField: true,
				isSelect: false,
				sSelState: "",
				sSelCity: "",
				sPincode : "",
				dateValue : new Date()
			});
			this.getView().setModel(oViewModel, "oViewModel");
		},
		onSelectionChangeRadioBtns: function(oEvnt) {
			var oViewModel = this.getView().getModel("oViewModel");
			var sIndex = oEvnt.getParameter("selectedIndex");
			if (sIndex === 0) {
				oViewModel.setProperty("/isSearchField", true);
				oViewModel.setProperty("/isSelect", false);
			} else {
				oViewModel.setProperty("/isSearchField", false);
				oViewModel.setProperty("/isSelect", true);
			}

		},
		_onLoadStates: function() {
			var that = this;
			$.ajax("https://cdn-api.co-vin.in/api/v2/admin/location/states", {
				type: 'GET',
				success: function(data) {
					that.getOwnerComponent().getModel("data").setProperty("/states", data.states);
				},
				error: function(oErr) {
					MessageToast.show("Error Occured");
				}
			});
			this.getAllIndiaCovidData();
		},
		getAllIndiaCovidData : function(){
			var oViewModel = this.getView().getModel("oViewModel");
			var that = this;
			$.ajax("https://api.cowin.gov.in/api/v1/reports/v2/getPublicReports", {
				type: 'GET',
				success: function(data) {
					
					that.getOwnerComponent().getModel("data").setProperty("/allIndia", data);
					that.getOwnerComponent().getModel("data").setProperty("/timeWiseDataToday", data.vaccinationDoneByTime);
					
				},
				error: function(oErr) {
					
					MessageToast.show("Failed to Load Data");
				}
			});
		},
		onStateSelectChange: function(oEvnt) {
			var oViewModel = this.getView().getModel("oViewModel");
			var sKey = oEvnt.getParameter("selectedItem").getKey();
			oViewModel.setProperty("/sSelState", sKey);
			var that = this;
			$.ajax("https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + sKey, {
				type: 'GET',
				success: function(data) {
					that.getOwnerComponent().getModel("data").setProperty("/districts", data.districts);
				},
				error: function(oErr) {
					MessageToast.show("Error Occured");
				}
			});
		},
		onDistrictSelectchange: function(oEvnt) {
			var oViewModel = this.getView().getModel("oViewModel");
			var sKey = oEvnt.getParameter("selectedItem").getKey();
			oViewModel.setProperty("/sSelCity", sKey);
		},
		onSearch : function(){
			var oViewModel = this.getView().getModel("oViewModel"),oDate ,sState,sCity ,sPincode,sFlag;
			oDate = oViewModel.getProperty("/dateValue");
			sState = oViewModel.getProperty("/sSelState");
			sCity = oViewModel.getProperty("/sSelCity");
			sPincode = oViewModel.getProperty("/sPincode");
			sFlag = oViewModel.getProperty("/isSelect");
			
		}
	});
});