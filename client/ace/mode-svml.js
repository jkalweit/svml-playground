"use strict"

console.log('here3', ace);
define('ace/mode/svml', [], function(require, exports, module) {

    var oop = require("ace/lib/oop");
    var TextHighlightRules = require("ace/mode/text").TextHighlightRules;
    var CssHighlightRules = require("ace/mode-css").CssHighlightRules;
    var JavaScriptHighlightRules = require("ace/mode/javascript").JavaScriptHighlightRules;

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
