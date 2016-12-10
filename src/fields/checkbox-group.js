SimpleForm['CheckboxGroup'] = function (name, required, minSelectedOptsCnt, maxSelectedOptsCnt, errorMsgMin, errorMsgMax, maxSlctdOptsClsName) {
	this.sform = null;
	this['Name'] = name;
	this._required = !!required;
	this.minSelectedOptsCnt = minSelectedOptsCnt || 0;
	this.maxSelectedOptsCnt = maxSelectedOptsCnt || 0;
	this.errorMsgMin = errorMsgMin || '';
	this.errorMsgMax = errorMsgMax || '';
	this.maxSlctdOptsClsName = maxSlctdOptsClsName || 'max-selected-options';
	this.initStaticsIfNecessary();
};
SimpleForm['CheckboxGroup'].prototype = {
	fieldCollection: [],
	formSubmitElm: null,
	checkboxesGroupNames: [],
	selectionCount: 0,
	result: undefined,
	errorMsg: '',
	statics: {
		fieldCollections: {},
		formSubmitElms: {},
		addFieldCollection: function (formId, fieldCollection) {
			if (!(formId in this.fieldCollections)) this.fieldCollections[formId] = [];
			this.fieldCollections[formId].push(fieldCollection);
		},
		clearCustomValidityForAllFormCheckboxGroups: function (formId) {
			var fieldCollections = [], fieldCollection = [];
			if (formId in this.fieldCollections) {
				fieldCollections = this.fieldCollections[formId];
				for (var i = 0, l = fieldCollections.length; i < l; i += 1) {
					fieldCollection = fieldCollections[i];
					for (var j = 0, k = fieldCollection.length; j < k; j += 1) {
						fieldCollection[j].setCustomValidity('');
					}
				}
			}
		},
		initFormSubmitFocusAndMouseOverEvents: function (sform, formId, formSubmitElm) {
			var scope = this, addEvent = sform.AddEvent;
			if (formId in scope.formSubmitElms) return;
			scope.formSubmitElms[formId] = true;
			addEvent(formSubmitElm, 'mouseover', function (e) {
				scope.clearCustomValidityForAllFormCheckboxGroups(formId);
			}, true);
			addEvent(formSubmitElm, 'focus', function (e) {
				scope.clearCustomValidityForAllFormCheckboxGroups(formId);
			}, true);
		}
	},
	initStaticsIfNecessary: function () {
		var self = SimpleForm['CheckboxGroup'];
		this._self = self;
		if (typeof (self.initialized) == 'boolean' && self.initialized) return;
		for (var key in this.statics) {
			self[key] = this.statics[key];
		};
		self.initialized = true;
	},
	'Init': function (sform) {
		var form = sform.Form;
		this.sform = sform;
		this.fieldCollection = form[this['Name']];
		this._self.addFieldCollection(form.id, this.fieldCollection);
		this.initFormSubmitElm();
		this._self.initFormSubmitFocusAndMouseOverEvents(sform, form.id, this.formSubmitElm);
		this.initAllFormCheckboxGroups();
		this.initFieldCollectionChangeEvents();
	},
	initFormSubmitElm: function () {
		var scope = this;
		this.sform.Each(this.sform.Form, function (i, control) {
			if (control.type == 'submit') {
				scope.formSubmitElm = control;
				return false;
			}
		});
	},
	initAllFormCheckboxGroups: function () {
		var scope = this,
			checkboxesCounts = {};
		this.sform.Each(this.sform.Form, function (i, item) {
			if (item.type == 'checkbox') {
				if (typeof (checkboxesCounts[item.name]) == 'undefined') {
					checkboxesCounts[item.name] = 0;
				}
				checkboxesCounts[item.name] += 1;
			}
		});
		for (var name in checkboxesCounts) {
			if (checkboxesCounts[name] > 1) {
				this.checkboxesGroupNames.push(name);
			}
		};
	},
	initFieldCollectionChangeEvents: function () {
		var scope = this;
		this.sform.Each(this.fieldCollection, function (i, field) {
			var bubblesSupported = !!field.setCustomValidity;
			if (field.checked) scope.selectionCount += 1;
			scope.sform.AddEvent(field, 'change', function (e) {
				scope.fieldChangeHandler(e, i, field, bubblesSupported);
			});
		});
	},
	fieldChangeHandler: function (e, i, control, bubblesSupported) {
		this.result = undefined;
		this.errorMsg = '';
		this.selectionCount += control.checked ? 1 : -1;
		this.fieldChangeHandlerManager(e, control);
		if (bubblesSupported && this.errorMsg) {
			control.setCustomValidity(this.errorMsg);
		}
		return this.result;
	},
	fieldChangeHandlerManager: function (e, control) {
		var scope = this,
			reqStr = 'required',
			sform = scope.sform,
			setAttr = sform.SetAttr,
			removeAttr = sform.RemoveAttr;
		if (scope._required && scope.minSelectedOptsCnt === 0) {
			// field is required
			setAttr(scope.fieldCollection[0], reqStr, reqStr);
		} else if (scope.selectionCount < scope.minSelectedOptsCnt && scope.minSelectedOptsCnt > 0) {
			// under minimum
			setAttr(scope.fieldCollection[0], reqStr, reqStr);
			scope.errorMsg = scope.errorMsgMin;
		} else if (scope.selectionCount === scope.maxSelectedOptsCnt && scope.maxSelectedOptsCnt > 0) {
			// maximum reached
			scope.addOrRemoveMaxSelectedOptsClass(true);
		} else if (scope.selectionCount > scope.maxSelectedOptsCnt && scope.maxSelectedOptsCnt > 0) {
			// over maxmimum
			scope.fieldChangeHandlerOverMaxmimum(e, control, reqStr);
		} else {
			scope.addOrRemoveMaxSelectedOptsClass(false);
			scope.sform.Each(scope.fieldCollection, function (i, field) {
				removeAttr(field, reqStr);
			});
		}
	},
	fieldChangeHandlerOverMaxmimum: function (e, control, reqStr) {
		var scope = this,
			sform = scope.sform,
			setAttr = sform.SetAttr,
			removeAttr = sform.RemoveAttr;
		scope.addOrRemoveMaxSelectedOptsClass(true);
		scope.errorMsg = scope.errorMsgMax;
		setAttr(control, reqStr, reqStr);
		control.checked = false;
		scope.selectionCount -= 1;
		scope._self.clearCustomValidityForAllFormCheckboxGroups(sform.Form.id);

		scope.formSubmitElm.click();
		setTimeout(function () {
			scope.sform.Each(scope.fieldCollection, function (i, item) {
				removeAttr(item, reqStr);
			});
		}, 1);

		e.preventDefault();
		scope.result = false;
	},
	addOrRemoveMaxSelectedOptsClass: function (addCls) {
		var scope = this,
			sform = scope.sform,
			clsName = scope.maxSlctdOptsClsName;
		scope.sform.Each(scope.fieldCollection, function (i, field) {
			if (field.checked) return;
			var parentNode = field.parentNode,
				hasCls = sform.HasCls(parentNode, clsName);
			if (addCls && !hasCls) {
				sform.AddCls(parentNode, clsName);
			} else if (!addCls && hasCls) {
				sform.RemoveCls(parentNode, clsName);
			}
		});
	}/*,
	triggerEvent: function (elm, type) {
		if (document.createEvent) {
			event = document.createEvent("HTMLEvents");
			event.initEvent(type, true, true); // type, bubbles, cancelable
			return elm.dispatchEvent(event);
		} else {
			event = document.createEventObject();
			event.eventType = type;
			return elm.fireEvent("on" + event.eventType, event);
		}
	}*/
};