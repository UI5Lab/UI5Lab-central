sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
    function(jQuery, library, Element) {
        "use strict";
        var Word = Element.extend("ui5lab.wordcloud.Word", {
            metadata: {
                properties: {
                    text: {
                        type: "string"
                    },
                    weight: {
                        type: "int",
                        defaultValue: 1
                    },
                    icon: {
                        type: "sap.ui.core.URI"
                    }
                }
            }
        });
        return Word;
    });