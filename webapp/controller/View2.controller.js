sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function(Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("cowinappZCowinApp.controller.View2", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf cowinappZCowinApp.view.View2
		 */
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();

			this.oRouter.getRoute("view2").attachMatched(this._onRouteMatched, this);
		},
		onBackBtnPress: function() {
			this.oRouter.navTo("view1");
		},
		_onRouteMatched: function() {
			this.GetDataByDist();
		},
		GetDataByDist: function() {
			var that = this;
			var oDate = new Date();
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd-MM-YYYY"
			});
			var dateFormatted = dateFormat.format(oDate);
			$.ajax("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=" + 4 + "&date=" + dateFormatted, {
				type: 'GET',
				success: function(data) {
					if (data.sessions.length === 0) {
						sap.m.MessageToast.show("No vaccination data available");
						return;
					} else {
						that.getOwnerComponent().getModel("data").setProperty("/center_data", data.sessions);
						that.getDataForTile(data.sessions);
						that.getChartData(data.sessions);
					}
				},
				error: function(oErr) {

				}
			});
		},
		getDataForTile: function(data) {
			var total_center = data.length;
			var city_name = data[0].district_name;
			var state_name = data[0].state_name;
			var oTileData = {
				"total_centers": total_center,
				"city": city_name,
				"state": state_name
			};
			this.getView().getModel("data").setProperty("/TileData", oTileData);
		},
		getChartData: function(data) {
			var oData = data,
				total = oData.length,
				chartData = {};
			chartData.vaccinecovishield = oData.filter(value => value.vaccine === 'COVISHIELD').length;
			chartData.vaccineCovaxin = oData.filter(value => value.vaccine === 'COVAXIN').length;
			chartData.vaccinesputnik = oData.filter(value => value.vaccine === 'SPUTNIK').length;
			chartData.ageLimit18 = oData.filter(value => value.min_age_limit === 18).length;
			chartData.ageLimit45 = oData.filter(value => value.min_age_limit === 45).length;
			this.getOwnerComponent().getModel("data").setProperty("/ChartData", chartData);
		},
		onBarSelect: function(oEvent) {
			var oSelLab = oEvent.getParameter("bar").getProperty("label"),
				oTable = this.getView().byId("table");
			if (oSelLab === "Age 18+") {
				var oFilter = new Filter("min_age_limit", FilterOperator.EQ, 18);
			} else {
				var oFilter = new Filter("min_age_limit", FilterOperator.EQ, 45);
			}
			oTable.getBinding("items").filter(oFilter);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf cowinappZCowinApp.view.View2
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf cowinappZCowinApp.view.View2
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf cowinappZCowinApp.view.View2
		 */
		//	onExit: function() {
		//
		//	}

	});

});