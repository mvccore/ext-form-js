SimpleForm['Reset'] = function (name) {
	this.sform = null;
	this['Name'] = name;
};
SimpleForm['Reset'].prototype = {
	Init: function (sform) {
		var scope = this;
		scope.sform = sform;
		this.sform.AddEvent(
			this.sform.Form[this['Name']], 
			'click', 
			function (e) {
				scope.initHandler(e);
			}
		);
	},
	initHandler: function (e) {
		var field = {},
			typesAndActions = {
				submit: 0,
				button: 0,
				reset: 1,
				radio: 1,
				checkbox: 1
			};
		this.sform.Each(form, function (i, field) {
			if (typeof (field.type) == 'string' && typeof (typesAndActions[field.type]) == 'number') {
				if (!typesAndActions[field.type] == 1) return;
				field.checked = false;
			} else {
				field.value = '';
			}
		});
		e.preventDefault();
	}
}