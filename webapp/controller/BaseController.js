sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("gtab.ZGridTable.controller.BaseController", {
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
					sap.m.MessageToast.show("Error Occured");
				}
			});
		},
	});

});