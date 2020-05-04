/**
 * striptoastr - Message Strips that Growl
 * @version v1.0.0
 * @link https://github.com/jasper07/StripToastr#readme
 * @license MIT
 */
sap.ui.define(["sap/m/MessageStrip", "sap/m/MessageStripRenderer", "sap/ui/core/Popup", "sap/ui/layout/VerticalLayout"],
    function(MessageStrip, MessageStripRenderer, Popup, VerticalLayout) {
        "use strict";
        var MessageStripExt = MessageStrip.extend("MessageStripExt", {
            //on rerender CSS transition bindings are destroyed
            renderer: function(oRm, oControl) {
                if (oControl._bClosed) {
                    oControl.fireClose();
                    return;
                }
                MessageStripRenderer.render.apply(this, arguments);
            },
            onAfterRendering: function() {
                this.$().attr("role", "alert");
            },
            close: function() {
                this._bClosed = true;
                MessageStrip.prototype.close.apply(this, arguments);
            }
        });

        var StripToastr = {
            sContainerId: "stripToastr-container",

            _oSettings: {
                text: null,
                showCloseButton: true,
                showIcon: true,
                customIcon: null,
                type: sap.ui.core.MessageType.Information,
                link: null,
                close: null,
                timeOut: 5000,
                newestFirst: false,
                width: "310px",
                position: Popup.Dock.RightTop,
                anchor: document,
                style: "stripToastr"
            },

            /**
             * Gets the container that holds toasts
             * @param  {object} oSettings optional used to create new container
             * @return {sap.ui.core.Popup}           Popup 
             */
            getContainer: function(oSettings) {
                var oContainer = sap.ui.getCore().byId(this.sContainerId);

                if (!oContainer && oSettings) {
                    oContainer = new VerticalLayout(this.sContainerId, {
                        width: oSettings.width
                    });

                    var oPopup = new Popup(oContainer);
                    oPopup.setShadow(false);
                    oPopup.__bAutoClose = true;
                    oPopup.open(0, oSettings.position, oSettings.position, oSettings.anchor);
                }

                return oContainer;
            },

            /**
             * Creates the StripToastr instance
             * @param  {object} oOptions has the constructor properties 
             * @return {StripToastr}          instance of the StripToastr
             */
            notify: function(oOptions) {
                var oSettings = jQuery.extend({}, this._oSettings, oOptions);
                var fnAttachClose = function(oEvent) {
                    oEvent.getSource().setVisible(false);
                    oEvent.getSource().destroy();
                    var fnSomeVisible = function(oControl) {
                        return oControl.getVisible();
                    };

                    if (!this.getContainer().getContent().some(fnSomeVisible)) {
                        this.destroyContainer();
                    }

                    if (oSettings.close) {
                        oSettings.close.apply(this);
                    }
                }.bind(this);

                var oControl = new MessageStripExt({
                    text: oSettings.text,
                    showCloseButton: oSettings.showCloseButton,
                    showIcon: oSettings.showIcon,
                    customIcon: oSettings.customIcon,
                    type: oSettings.type,
                    link: oSettings.link,
                    close: fnAttachClose
                });

                oControl.addStyleClass(oSettings.style);

                var oContainer = this.getContainer(oSettings);
                if (oSettings.newestFirst) {
                    oContainer.insertContent(oControl, 0);
                } else {
                    oContainer.addContent(oControl);
                }

                if (oSettings.timeOut > 0) {
                    jQuery.sap.delayedCall(oSettings.timeOut, oControl, "close");
                }

                return oControl;
            },

            /**
             * Clear the container or close the instance
             * @param  {StripToastr} oControl instance of StripToastr 
             */
            clear: function(oControl) {
                if (!oControl) {
                    this.clearContainer();
                } else {
                    oControl.close();
                }
            },

            /**
             * Detroy the container
             */
            destroyContainer: function() {
                var oContainer = this.getContainer();
                if (oContainer) {
                    oContainer.setVisible(false);
                    oContainer.destroy();
                }
            },

            /**
             * Clear the container
             */
            clearContainer: function() {
                var oContainer = this.getContainer();

                if (oContainer) {
                    var aContent = oContainer.getContent();
                    if (aContent.length === 0) {
                        this.destroyContainer();
                    } else {
                        var fnClear = function(oControl) {
                            this.clear(oControl);
                        }.bind(this);

                        aContent.forEach(fnClear);
                    }
                }
            }
        };

        return StripToastr;
    });