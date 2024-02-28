sap.ui.define([], () => {
	"use strict";

	return {
		statusText(sStatus) {
			const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "A":
					return oResourceBundle.getText("StatusA");
				case "B":
					return oResourceBundle.getText("StatusB");
				case "C":
					return oResourceBundle.getText("StatusC");
				default:
					return sStatus;
			}
		}
	};
});