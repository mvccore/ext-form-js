(function (MvcCoreForm) {
	MvcCoreForm['Range'] = function (name) {
		this.base = null;
		this['Name'] = name;
	};
	MvcCoreForm['Range'].prototype = {
		infoTmpl: '% - %',
		field: null,
		contElm: null,
		infoElm: null,
		firstElm: null,
		secondElm: null,
		'Init': function (base) {
			this.base = base;
			this.field = base.Form[this['Name']];
			this.initCreateAndSetUpNewElements();
			this.initStepHandlersIfNecessary();
			this.initChangeEvents();
		},
		initCreateAndSetUpNewElements: function () {
			var scope = this,
				field = scope.field,
				base = scope.base,
				_append = base.Append,
				_createElm = base.CreateElm,
				_addCls = base.AddCls,
				_getAttr = base.GetAttr,
				_setAttr = base.SetAttr,
				_removeAttr = base.RemoveAttr,
				name = '',
				values = [];

			var contElm = _createElm('div');
			var infoElm = _createElm('span');
			var firstElm = field['cloneNode']();
			_addCls(field, 'range-multiple');
			var rawValues = _getAttr(field, 'data-value');
			if (rawValues['length']) {
				values = rawValues['split'](',');
			} else {
				values = [
					_getAttr(field, 'min') || '0',
					_getAttr(field, 'max') || '100'
				];
			};

			_removeAttr(firstElm, 'multiple');
			_removeAttr(firstElm, 'id');
			_setAttr(firstElm, 'value', values[0]);
			
			name = firstElm['name'];
			firstElm['name'] = name.indexOf('[]') > -1 ? name : name + '[]';
			var secondElm = firstElm['cloneNode']();
			_setAttr(secondElm, 'value', values[1]);
			_addCls(firstElm, 'first');
			_addCls(secondElm, 'second');
			_setAttr(contElm, 'id', field['id']);
			contElm['className'] = field['className'];

			infoElm = _append(contElm, infoElm);
			firstElm = _append(contElm, firstElm);
			secondElm = _append(contElm, secondElm);
			contElm = field['parentNode']['replaceChild'](contElm, field);

			scope.firstElm = firstElm;
			scope.secondElm = secondElm;
			scope.contElm = contElm;
			scope.infoElm = infoElm;
		},
		initStepHandlersIfNecessary: function () {
			var scope = this,
				first = scope.firstElm,
				second = scope.secondElm;
			if (!('stepDown' in first)) {
				first.stepDown = function (step) {
					first['value'] = first['value'] - step;
				}
			};
			if (!('stepUp' in second)) {
				second.stepUp = function (step) {
					second['value'] = second['value'] + step;
				}
			};
		},
		initChangeEvents: function () {
			var scope = this,
				first = scope.firstElm,
				second = scope.secondElm,
				int = scope._parseInt,
				step = scope.getInputStep,
				firstStep = step(first),
				secondStep = step(second);
			scope.addChangeEvent(first, function (e) {
				var cnt = 0,
					firstValPlusStep = int(first['value']) + firstStep;
				while (firstValPlusStep > int(second['value'])) {
					second.stepUp();
					cnt += 1;
					if (cnt > 100) break;
				}
				scope.setUpInfo();
			});
			scope.addChangeEvent(second, function (e) {
				var cnt = 0,
					secondValMinusStep = int(second['value']) - secondStep;
				while (secondValMinusStep < int(first['value'])) {
					first.stepDown();
					cnt += 1;
					if (cnt > 100) break;
				};
				scope.setUpInfo();
			});
			scope.setUpInfo();
		},
		addChangeEvent: function (elm, handler) {
			this.base.AddEvent(elm, this.base.OldId ? 'change' : 'input', handler);
		},
		setUpInfo: function () {
			var scope = this;
			scope.infoElm['innerHTML'] = scope.infoTmpl
				.replace('%', scope.firstElm['value'])
				.replace('%', scope.secondElm['value']);
		},
		_parseInt: function (value) {
			return parseInt(value, 10);
		},
		getInputStep: function (input) {
			var rawStep = input['step'].toString(),
				rawValue = '',
				dotPos = -1,
				result = 1;
			if (rawStep['length'] > 0) {
				result = parseInt(rawStep, 10);
			} else {
				rawValue = input['value'].toString();
				if (rawValue['length'] > 0) {
					dotPos = rawValue.lastIndexOf('.');
					if (dotPos > -1) {
						rawValue = rawValue.substr(dotPos + 1);
						if (rawValue['length'] > 0) {
							result = parseInt(rawValue, 10) / 10;
						}
					}
				}
			}
			return result;
		}
	}
})(window['MvcCoreForm']);
