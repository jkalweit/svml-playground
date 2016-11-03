
ace.define('ace/mode/svml', ["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules", 
	"ace/mode/css", "ace/mode/javascript_highlight_rules"], function(require, exports, module) {

"use strict"

    var oop = ace.require("ace/lib/oop");
    var TextHighlightRules = ace.require("ace/mode/text").Mode;
	var CssHighlightRules = ace.require("ace/mode/css");
	console.log('here5', CssHighlightRules);
    var JavaScriptHighlightRules = ace.require("./javascript_highlight_rules").JavaScriptHighlightRules;

	console.log('here2');

    oop.inherits(SvmlHighlightRules, TextHighlightRules);

    function SvmlHighlightRules() {
        
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
    }

    exports.SvmlHighlightRules = SvmlHighlightRules;
	console.log('here2');
});
