var CodeMirror = require("codemirror");

CodeMirror.defineMode("mustache_vars", function(config, parserConfig) {
	var ctx_vars = parserConfig.context_variables;
	var mustacheOverlay = {
		token: function(stream) {
			var ch;
			if (stream.match("{{")) {
				while ((ch = stream.next()) != null)
					if (ch === "}" && stream.next() === "}") {
						stream.eat("}");
						var mustache_variable = stream.current().replace(/[{}/# ^]/g, "");
						if (typeof(ctx_vars) !== "undefined" && ctx_vars.indexOf(mustache_variable) === -1){
							return "mustache-error";
						} else {
							return "mustache";
						}
					}
			}
			while (stream.next() != null && !stream.match("{{", false)) {
				continue;
			}
			return null;
		}
	};
	return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "gfm"), mustacheOverlay);
});
