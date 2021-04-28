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
			if (this.field['getAttribute']('multiple') == null) return;
			this.initCreateAndSetUpNewElements();
			this.initStepHandlersIfNecessary();
			this.initChangeEvents();
			this.initResetEvents();
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
				spanStr = 'span',
				idStr = 'id',
				classNameStr = 'className',
				nameStr = 'name',
				values = [];

			var contElm = _createElm(spanStr);
			var infoElm = _createElm(spanStr);
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
			_removeAttr(firstElm, idStr);
			_setAttr(firstElm, 'value', values[0]);
			
			name = firstElm[nameStr];
			firstElm[nameStr] = name.indexOf('[]') > -1 ? name : name + '[]';
			var secondElm = firstElm['cloneNode']();
			_setAttr(secondElm, 'value', values[1]);
			_addCls(firstElm, 'first');
			_addCls(secondElm, 'second');
			_setAttr(contElm, idStr, field[idStr]);
			contElm[classNameStr] = field[classNameStr];

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
				second = scope.secondElm,
				valueStr = 'value';
			if (!('stepDown' in first)) {
				first.stepDown = function (step) {
					first[valueStr] = first[valueStr] - step;
				}
			};
			if (!('stepUp' in second)) {
				second.stepUp = function (step) {
					second[valueStr] = second[valueStr] + step;
				}
			};
		},
		initChangeEvents: function () {
			var scope = this,
				first = scope.firstElm,
				second = scope.secondElm,
				floatVal = scope._parseFloat,
				step = scope.getInputStep,
				firstStep = step(first),
				secondStep = step(second),
				valueStr = 'value';
			scope.addChangeEvent(first, function (e) {
				var cnt = 0,
					firstValPlusStep = floatVal(first[valueStr]) + firstStep;
				while (firstValPlusStep > floatVal(second[valueStr])) {
					second.stepUp();
					cnt += 1;
					if (cnt > 100) break;
				}
				scope.setUpInfo();
			});
			scope.addChangeEvent(second, function (e) {
				var cnt = 0,
					secondValMinusStep = floatVal(second[valueStr]) - secondStep;
				while (secondValMinusStep < floatVal(first[valueStr])) {
					first.stepDown();
					cnt += 1;
					if (cnt > 100) break;
				};
				scope.setUpInfo();
			});
			scope.setUpInfo();
		},
		initResetEvents: function () {
			var scope = this,
				base = scope.base,
				valueStr = 'value',
				rawOrigValues = scope.field['getAttribute']('data-value'),
				min = '', max = '',
				origValues = ['', ''];
			if (rawOrigValues == null || rawOrigValues === '') {
				min = scope.field['getAttribute']('min');
				max = scope.field['getAttribute']('max');
				origValues = [
					min != null && min !== '' ? min : scope.firstElm.value,
					max != null && max !== '' ? max : scope.secondElm.value
				];
			} else {
				origValues = rawOrigValues.split(',');
			}
			base.AddEvent(base.Form, 'reset', function () {
				scope.firstElm[valueStr] = origValues[0];
				scope.secondElm[valueStr] = origValues[1];
				scope.setUpInfo();
			});
		},
		addChangeEvent: function (elm, handler) {
			this.base.AddEvent(elm, this.base.OldId ? 'change' : 'input', handler);
		},
		setUpInfo: function () {
			var scope = this,
				valueStr = 'value',
				percentageStr = '%';
			scope.infoElm['innerHTML'] = scope.infoTmpl
				.replace(percentageStr, scope.firstElm[valueStr])
				.replace(percentageStr, scope.secondElm[valueStr]);
		},
		_parseFloat: function (value) {
			return parseFloat(value);
		},
		getInputStep: function (input) {
			var rawStep = input['step'].toString(),
				rawValue = '',
				dotPos = -1,
				result = 1,
				lengthStr = 'length';
			if (rawStep[lengthStr] > 0) {
				result = parseInt(rawStep, 10);
			} else {
				rawValue = input[lengthStr].toString();
				if (rawValue[lengthStr] > 0) {
					dotPos = rawValue.lastIndexOf('.');
					if (dotPos > -1) {
						rawValue = rawValue.substr(dotPos + 1);
						if (rawValue[lengthStr] > 0) {
							result = parseInt(rawValue, 10) / 10;
						}
					}
				}
			}
			return result;
		}
	}
})(window['MvcCoreForm']);
