prettyPrint = function () {
	_.each(arguments, function (arg) {
		console.log(JSON.stringify(arg, null, 2));
	});
};
