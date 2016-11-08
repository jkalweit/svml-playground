CodeMirror.defineMode("svml", function() {


	var cssMode = CodeMirror.getMode({}, 'css');
	var jsMode = CodeMirror.getMode({}, 'javascript');




	return {
		startState: () => {
			return { svmlState: { tabs: 0 }};
		},
		token: (stream, state) => {

			if(stream.sol()) {
				state.svmlState.isDecleration = false;
				state.svmlState.tabs = 0;			
				
				if (stream.peek() === '\t') {
					var numTabs = 1;
					stream.next();
					while(stream.peek() === '\t') {
						stream.next();
						numTabs++;
					}
					state.svmlState.tabs = numTabs;
				}
				if(state.svmlState.tabs <= state.svmlState.levelTabs) {
					state.svmlState.isStyle = false;
					state.styleState = null;
					state.svmlState.isEvents = false;
					state.eventsState = null;
					state.svmlState.levelTabs = 0;
				}
			}

			if(state.svmlState.isDecleration) {
				if(stream.match(/[:]function/)) {
					state.svmlState.isEvents = true;
					state.svmlState.levelTabs = state.svmlState.tabs;
					return 'tag';
				} else if(stream.match(/[:](\w*)/)) {
					return 'tag';
				} else if(stream.match(/\s*'.*?'/)) {
					return 'string';
				} else if(stream.match(/\s*\$\(.*?\)/)) {
					return 'attribute';
				} else if(stream.match(/\s*\(.*?\)/)) {
					return 'variable-2';
				} else {
					stream.skipToEnd();
					state.svmlState.isDecleration = false;
					return;
				}
			} else if(state.svmlState.isStyle) {
				state.styleState = state.styleState || cssMode.startState();
				return cssMode.token(stream, state.styleState);
			} else if(state.svmlState.isEvents) {
				state.eventsState = state.eventsState || jsMode.startState();
				return jsMode.token(stream, state.eventsState);
			} else if(state.svmlState.tabs > 0 && stream.match('style:')) {
				state.svmlState.isStyle = true;
				state.svmlState.levelTabs = state.svmlState.tabs;
				return 'keyword';
			} else if(state.svmlState.tabs > 0 && stream.match('events:')) {
				return 'keyword';
			} else if(state.svmlState.tabs > 0 && stream.match('click:')) {
				state.svmlState.levelTabs = state.svmlState.tabs;
				state.svmlState.isEvents = true;
				return 'keyword';
			} else if (stream.match('//')) {
				stream.skipToEnd();
				return 'comment';
			} else if (stream.match(/[#](\w*)/)) {
				state.svmlState.isDecleration = true;
				return 'def';
			} else if (state.svmlState.tabs === 0 && stream.match(/[A-Z].*/)) {
				return 'tag';	
			}

			//console.log('defaulting... ', stream.peek(), state);	
			// default to advancing the token
			stream.next();
		},
      	copyState: (state) => {
			//console.log('copying state...');
			//copy.eventsState = CodeMirror.copyState(jsMode, state.eventsState);
			var copy = {
				svmlState: CodeMirror.copyState({}, state.svmlState),
				styleState: state.styleState ? CodeMirror.copyState(cssMode, state.styleState) : null,
				eventsState: state.eventsState ? CodeMirror.copyState(jsMode, state.eventsState) : null
			};
			return copy;
		}
	};
});

CodeMirror.defineMIME("text/x-svml", "svml");
