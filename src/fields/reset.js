(function (MvcCoreForm) {
	MvcCoreForm['Reset'] = function (name) {
		this.base = null;
		this['Name'] = name;
	};
	MvcCoreForm['Reset'].prototype = {
		'Init': function (base) {
			var scope = this;
			scope.base = base;
			this.base.AddEvent(
				this.base.Form[this['Name']],
				'click',
				function (e) {
					scope.initHandler(e);
				}
			);
		},
		initHandler: function (e) {
			var field = {},
				typesAndActions = {
					'submit': 0,
					'button': 0,
					'reset': 1,
					'radio': 1,
					'checkbox': 1
				};
			this.base.Each(this.base.Form, function (i, field) {
				var ft = field['type'];
				if (typeof (ft) == 'string' && typeof (typesAndActions[ft]) == 'number') {
					if (!typesAndActions[ft] == 1) return;
					field['checked'] = false;
				} else {
					field['value'] = '';
				}
			});
			e['preventDefault']();
		}
	};
})(window['MvcCoreForm']);
