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
			contElm, firstElm, secondElm, infoElm,
			field = scope.field,
			base = scope.base,
			append = base.Append,
			createElm = base.CreateElm,
			addCls = base.AddCls,
			getAttr = base.GetAttr,
			setAttr = base.SetAttr,
			removeAttr = base.RemoveAttr,
			values = [],
			rawValues = getAttr(field, 'data-value'),
			step = parseFloat(getAttr(field, 'step') || '0.1') || 0.1;

		contElm = createElm('div');
		infoElm = createElm('span');
		firstElm = field['cloneNode']();
		addCls(field, 'range-multiple');
		if (rawValues['length']) {
			values = rawValues['split'](',');
		} else {
			values = [
				getAttr(field, 'min') || '0',
				getAttr(field, 'max') || '100'
			];
		};

		removeAttr(firstElm, 'multiple');
		removeAttr(firstElm, 'id');
		setAttr(firstElm, 'value', values[0]);
		firstElm['name'] = firstElm['name'] + '[]';
		secondElm = firstElm['cloneNode']();
		setAttr(secondElm, 'value', values[1]);
		addCls(firstElm, 'first');
		addCls(secondElm, 'second');
		setAttr(contElm, 'id', field['id']);
		contElm['className'] = field['className'];

		infoElm = append(contElm, infoElm);
		firstElm = append(contElm, firstElm);
		secondElm = append(contElm, secondElm);
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
			first.stepDown = function () {
				first['value'] = first['value'] - step;
			}
		};
		if (!('stepUp' in second)) {
			second.stepUp = function () {
				second['value'] = second['value'] + step;
			}
		};
	},
	initChangeEvents: function () {
		var scope = this,
			first = scope.firstElm,
			second = scope.secondElm;
		scope.addChangeEvent(first, function (e) {
			var cnt = 0;
			while (first['value'] + 1 > second['value']) {
				second.stepUp();
				cnt += 1;
				if (cnt > 100) break;
			}
			scope.setUpInfo();
		});
		scope.addChangeEvent(second, function (e) {
			var cnt = 0;
			while (second['value'] - 1 < first['value']) {
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
	}
}