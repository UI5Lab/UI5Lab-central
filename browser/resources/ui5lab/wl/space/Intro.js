sap.ui.define(['sap/ui/core/Control', './library'],
    function(Control, library ) {
        "use strict";
        var oIntro = Control.extend("ui5lab.wl.space.Intro", {
            metadata: {
                library : "ui5lab.wl.space",
                properties: {
                    intro: "string",
                    title: "string",
                    text: "string",
                    logo: "string"

                },
                events: {}
            },
            init: function () {
            },
            onAfterRendering: function(evt) {},
            setIntro: function(value) {
                this.setProperty("intro", value, true);
                return this;
            },
            setTitle: function(value) {
                this.setProperty("title", value, true);
                return this;
            },
            setText: function(value) {
                this.setProperty("text", value, true);
                return this;
            },
            setLogo: function(value) {
                this.setProperty("logo", value, true);
                return this;
            }
        });
        return oIntro;
    });