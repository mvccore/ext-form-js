(function (MvcCoreForm) {
	MvcCoreForm['CheckboxGroup'] = function (
		name,
		required,
		minSelectedOptsCnt,
		maxSelectedOptsCnt,
		errorMsgRequired,
		errorMsgMin,
		errorMsgMax,
		maxSlctdOptsClsName
	) {
		this.base = null;
		this['Name'] = name;
		this._required = !!required;
		this.minSelectedOptsCnt = minSelectedOptsCnt || 0;
		this.maxSelectedOptsCnt = maxSelectedOptsCnt || 0;
		this.errorMsgRequired = errorMsgRequired || '';
		this.errorMsgMin = errorMsgMin || '';
		this.errorMsgMax = errorMsgMax || '';
		this.maxSlctdOptsClsName = maxSlctdOptsClsName || 'max-selected-options';
		this.initStaticsIfNecessary();
	};
	MvcCoreForm['CheckboxGroup'].prototype = {
		fieldCollection: [],
		formSubmitElms: [],
		checkboxesGroupNames: [],
		selectionCount: 0,
		result: undefined,
		errorMsg: '',
		statics: {
			fieldGroupScopes: {},
			formSubmitElmsInitialized: {},
			addFieldGroup: function (formId, fieldGroupScope) {
				if (!(formId in this.fieldGroupScopes)) 
					this.fieldGroupScopes[formId] = [];
				this.fieldGroupScopes[formId].push(fieldGroupScope);
			},
			clearCustomValidityForAllFormCheckboxGroups: function (formId) {
				var fieldGroupScopes = [], 
					fieldCollection = [];
				if (formId in this.fieldGroupScopes) {
					fieldGroupScopes = this.fieldGroupScopes[formId];
					for (var i = 0, l = fieldGroupScopes.length; i < l; i += 1) {
						fieldCollection = fieldGroupScopes[i].fieldCollection;
						for (var j = 0, k = fieldCollection.length; j < k; j += 1) {
							fieldCollection[j]['setCustomValidity']('');
						}
					}
				}
			},
			initFormSubmitFocusAndMouseOverEvents: function (base, formId, formSubmitElm) {
				var scope = this, 
					addEvent = base.AddEvent,
					formSubmitElmName = formSubmitElm['name'],
					firstTimeForForm = false;
				if (!(formId in scope.formSubmitElmsInitialized)) {
					firstTimeForForm = true;
					scope.formSubmitElmsInitialized[formId] = {};
				}
				if (!(formSubmitElmName in scope.formSubmitElmsInitialized[formId])) {
					scope.formSubmitElmsInitialized[formId][formSubmitElmName] = true;
					addEvent(formSubmitElm, 'mouseover', function (e) {
						scope.clearCustomValidityForAllFormCheckboxGroups(formId);
					}, true);
					addEvent(formSubmitElm, 'focus', function (e) {
						scope.clearCustomValidityForAllFormCheckboxGroups(formId);
					}, true);
				}
				if (!firstTimeForForm) return;
				// form submit init only once
				addEvent(base.Form, 'submit', function (e) {
					scope.clearCustomValidityForAllFormCheckboxGroups(formId);
					if (!scope.formSubmitHandler(formId)) e['preventDefault']();
					//e['preventDefault']();
				});
			},
			formSubmitHandler: function (formId) {
				var scope = this,
					fieldGroupScopes = [], 
					fieldCollection = [],
					fieldGroupScope = {},
					firstCheckbox = {},
					result = true;
				if (formId in scope.fieldGroupScopes) {
					fieldGroupScopes = scope.fieldGroupScopes[formId];
					for (var i = 0, l = fieldGroupScopes.length; i < l; i += 1) {
						fieldGroupScope = fieldGroupScopes[i];
						fieldCollection = fieldGroupScope.fieldCollection;
						firstCheckbox = fieldCollection[0];
						if (!fieldGroupScope.fieldChangeHandler(
							-1, firstCheckbox, !!firstCheckbox['setCustomValidity'])
						) result = false;
					}
				}
				//console.log(result);
				return result;
			}
		},
		initStaticsIfNecessary: function () {
			var scope = this,
				statics = scope.statics,
				self = MvcCoreForm['CheckboxGroup'];
			scope._self = self;
			if (typeof (self.initialized) == 'boolean' && self.initialized) return;
			for (var key in statics) 
				self[key] = statics[key];
			self.initialized = true;
			
		},
		'Init': function (base) {
			var form = base.Form,
				formId = form['id'],
				scope = this;
			scope.base = base;
			scope.fieldCollection = form[scope['Name']];
			scope._self.addFieldGroup(formId, scope);
			scope.initFormSubmitElms();
			for (var i = 0, l = scope.formSubmitElms['length']; i < l; i += 1)
				scope._self.initFormSubmitFocusAndMouseOverEvents(base, formId, scope.formSubmitElms[i]);
			scope.initAllFormCheckboxGroups();
			scope.initFieldCollectionChangeEvents(formId);
		},
		initFormSubmitElms: function () {
			var scope = this,
				getAttr = scope.base.GetAttr,
				customResult = '',
				rawFormSubmitElms = [],
				formSubmitElms = [],
				index = 0, length = 0;
			scope.base.Each(scope.base.Form, function (i, control) {
				if (control['type'] == 'submit') 
					rawFormSubmitElms.push({
						control: control,
						result: getAttr(control, 'data-result')
					});
			});
			rawFormSubmitElms.sort(scope.initFormSubmitElmsSort);
			for (length = rawFormSubmitElms['length']; index < length; index += 1) 
				formSubmitElms.push(rawFormSubmitElms[index].control);
			scope.formSubmitElms = formSubmitElms;
		},
		initFormSubmitElmsSort: function (a, b) {
			var aresult = a === null ? -1 : parseInt(a, 10),
				bresult = b === null ? -1 : parseInt(b, 10);
			if (aresult < bresult) {
				return -1;
			} else if (a.result > b.result) {
				return 1;
			}
			return 0;
		},
		initAllFormCheckboxGroups: function () {
			var scope = this,
				checkboxesCounts = {};
			this.base.Each(this.base.Form, function (i, item) {
				var itemName = item['name'];
				if (item['type'] == 'checkbox') {
					if (typeof (checkboxesCounts[itemName]) == 'undefined') {
						checkboxesCounts[itemName] = 0;
					}
					checkboxesCounts[itemName] += 1;
				}
			});
			for (var name in checkboxesCounts) {
				if (checkboxesCounts[name] > 1) {
					this.checkboxesGroupNames.push(name);
				}
			};
		},
		initFieldCollectionChangeEvents: function (formId) {
			var scope = this, 
				bubblesSupported = !!scope.fieldCollection[0]['setCustomValidity'];
			scope.base.Each(scope.fieldCollection, function (i, field) {
				if (field['checked']) 
					scope.selectionCount += 1;
				scope.base.AddEvent(field, 'change', function (e) {
					var result = scope.fieldChangeHandler(i, field, bubblesSupported);
					if (!result) e['preventDefault']();
				});
			});
			// run first check on first checkbox:
			scope.fieldChangeHandler(-1, scope.fieldCollection[0], bubblesSupported);
		},
		fieldChangeHandler: function (i, control, bubblesSupported) {
			var scope = this;
			if (i > -1) scope.fieldChangeHandlerSelectionCount(control);
			return scope.fieldChangeHandlerManager(control, bubblesSupported);
		},
		fieldChangeHandlerSelectionCount: function (control) {
			var scope = this, 
				lengthStr = 'length';
			scope.selectionCount += control['checked'] ? 1 : -1;
			if (scope.selectionCount < 0) 
				scope.selectionCount = 0;
			if (scope.selectionCount > scope.fieldCollection[lengthStr]) 
				scope.selectionCount = scope.fieldCollection[lengthStr];
		},
		fieldChangeHandlerManager: function (control, bubblesSupported) {
			var scope = this,
				reqStr = 'required',
				errorMsg = '',
				result = true,
				required = scope._required,
				base = scope.base,
				setAttr = base.SetAttr,
				removeAttr = base.RemoveAttr,
				firstControl = scope.fieldCollection[0];
			if (required && !scope.selectionCount && !scope.minSelectedOptsCnt) {
				//console.log("required",scope.selectionCount,scope.minSelectedOptsCnt);
				setAttr(firstControl, reqStr, reqStr);
				errorMsg = scope.errorMsgRequired;
				result = false;
			} else if (
				(required && scope.selectionCount < scope.minSelectedOptsCnt) || 
				(!required && scope.selectionCount < scope.minSelectedOptsCnt && scope.minSelectedOptsCnt > 0)
			) {
				//console.log((required ? "required, ":"")+"under minimum",scope.selectionCount,scope.minSelectedOptsCnt);
				setAttr(firstControl, reqStr, reqStr);
				errorMsg = scope.errorMsgMin;
				result = false;
			} else if (scope.selectionCount === scope.maxSelectedOptsCnt && scope.maxSelectedOptsCnt > 0) {
				//console.log((required ? "required, ":"")+"maximum reached", scope.selectionCount, scope.maxSelectedOptsCnt);
				scope.addOrRemoveMaxSelectedOptsClass(true);
			} else if (scope.selectionCount > scope.maxSelectedOptsCnt && scope.maxSelectedOptsCnt > 0) {
				//console.log((required ? "required, ":"")+"over maxmimum", scope.selectionCount, scope.maxSelectedOptsCnt);
				errorMsg = scope.errorMsgMax;
				result = false;
				scope.fieldChangeHandlerOverMaxmimum(control, reqStr, bubblesSupported, errorMsg);
			}/* else {
				console.log((required ? "required, ":"")+"all conditions reached",scope.selectionCount,scope.minSelectedOptsCnt);
			}*/
			//console.log([result, bubblesSupported, errorMsg, control]);
			if (bubblesSupported) 
				firstControl['setCustomValidity'](errorMsg);
			if (result) {
				scope.addOrRemoveMaxSelectedOptsClass(false);
				base.Each(scope.fieldCollection, function (i, field) {
					removeAttr(field, reqStr);
					if (bubblesSupported) firstControl['setCustomValidity']('');
				});
			}
			return result;
		},
		fieldChangeHandlerOverMaxmimum: function (control, reqStr, bubblesSupported, errorMsg) {
			var scope = this,
				setCustomValidityStr = 'setCustomValidity',
				base = scope.base,
				setAttr = base.SetAttr,
				removeAttr = base.RemoveAttr;
			scope.addOrRemoveMaxSelectedOptsClass(true);
			if (control) {
				setAttr(control, reqStr, reqStr);
				control['checked'] = false;
			}
			scope.selectionCount -= 1;
			scope._self.clearCustomValidityForAllFormCheckboxGroups(base.Form['id']);
			if (bubblesSupported) 
				control[setCustomValidityStr](errorMsg);
			if (scope.formSubmitElms['length'] > 0)
				scope.formSubmitElms[0]['click']();
			setTimeout(function () {
				base.Each(scope.fieldCollection, function (i, item) {
					removeAttr(item, reqStr);
				});
			}, 1);
			setTimeout(function () {
				if (bubblesSupported) {
					scope.fieldCollection[0][setCustomValidityStr]('');
					control[setCustomValidityStr]('');
					//console.log(scope);
				}
			}, 5000);
		},
		addOrRemoveMaxSelectedOptsClass: function (addCls) {
			var scope = this,
				base = scope.base,
				clsName = scope.maxSlctdOptsClsName;
			scope.base.Each(scope.fieldCollection, function (i, field) {
				if (field['checked']) return;
				var parentNode = field['parentNode'],
					hasCls = base.HasCls(parentNode, clsName);
				if (addCls && !hasCls) {
					base.AddCls(parentNode, clsName);
				} else if (!addCls && hasCls) {
					base.RemoveCls(parentNode, clsName);
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
	}
})(window['MvcCoreForm']);
