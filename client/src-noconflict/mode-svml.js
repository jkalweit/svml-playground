ace.define("ace/mode/svml_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules","ace/mode/css"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var CssHighlightRules = require("ace/mode/css_highlight_rules").CssHighlightRules;
var JavaScriptHighlightRules = ace.require("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;

var SvmlHighlightRules = function() {

        var commentRule = {
            token: "comment",
            regex: /(\/\/.*)/
        };
        
        var eventsRule = {
            token: "keyword.events",
            regex: /\tevents:/,
            next: function(state, stack) {
                console.log('entering events');
                return "events";
            }
        };
        
        this.$rules = {
            start: [
                {
                    token: ["keyword", "variable"],
                    regex: /(#)(\w*)/,
                    next: "tag"
                }, 
                commentRule, 
                {
                    token: "entity",
                    regex: /(^[A-Z].*)/,
                    next: "component"
                }
            ],
            tag: [
                {
                    token: function(first, second) {
                        return ["keyword", "entity"];
                    },
                    regex: /(:)([^\s]+)/
                },
                {
                    token: "string",
                    regex: /('.*')/,
                    next: "start"
                }, 
                {
                    token: "string",
                    regex: /($)/,
                    next: "start"
                }
            ],
            component: [
                {
                    token: "keyword.style",
                    regex: /\tstyle:/,
                    next: function(state, stack) {
                        console.log('entering style');
                        return "css-start";
                    }
                }, 
                eventsRule, 
                commentRule,
                {
                    token: ["keyword", "variable"],
                    regex: /\t(#)(\w*)/,
                    next: function(state, stack) {
                        console.log('component entering tag');
                        return "tag";
                    }
                },
                {
                    token: "keyword.endcomponent",
                    regex: /^\s*$/,
                    next: function(state, stack) {
                        console.log('exiting component for start');
                        return "start";
                    }
                }
            ],
            events: [
                {
                    token: "keyword.events.click",
                    regex: /\t\tclick:/,
                    next: "js-start"
                },
                {
                    token: "keyword.events.hover",
                    regex: /\t\thover:/,
                    next: "js-start"
                }, 
                {
                    token : "keyword.events.end",
                    regex: /^\s*$/,
                    next  : "component"
                },
                commentRule
            ],
            dummmy: [
                {
                    token: function(first) {
                        console.log('here', first)
                        return "string";
                    },
                    regex: /()/
                }
            ]
        };
        
        this.embedRules(CssHighlightRules, "css-", [
            {
                token : "keyword.endcss",
                regex: /^\s*$/,
                next: function(state, stack) {
                    console.log('exiting css for component');
                    return "component";
                }
            },
            eventsRule
        ]);
        
        this.embedRules(JavaScriptHighlightRules, "js-", [
            {
                token : "keyword.endjavascript",
                regex: /^\s*$/,
                next  : "events"
            },
            {
                    token: "keyword.events.hover",
                    regex: /\t\thover:/,
                    next: "js-start"
            }
        ]);
    };

oop.inherits(SvmlHighlightRules, TextHighlightRules);

exports.SvmlHighlightRules = SvmlHighlightRules;

});


ace.define("ace/mode/svml",["require","exports","module","ace/mode/svml_highlight_rules","ace/mode/text","ace/lib/oop"], function(require, exports, module) {
"use strict";


var Rules = require("./svml_highlight_rules").SvmlHighlightRules;
var TextMode = require("./text").Mode;
var oop = require("../lib/oop");

function Mode() {
    this.HighlightRules = Rules;
}

oop.inherits(Mode, TextMode);

exports.Mode = Mode;

});
