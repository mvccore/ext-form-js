window['MvcCoreForm'] = (function () {
	var MvcCoreForm = function (form, fields) {
		this.Form = form;
		this['Fields'] = fields || [];
		MvcCoreForm['SetInstance'](form['id'], this);
		this['Init']();
	};
	MvcCoreForm.OLDIE = /MSIE [6-8]/g.test(navigator['userAgent']);
	MvcCoreForm.instances = {};
	MvcCoreForm['CreateInstance'] = function (form, fields) {
		var instance = new MvcCoreForm(form, fields);
		return MvcCoreForm['SetInstance'](form['id'], instance);
	};
	MvcCoreForm['GetInstance'] = function (formId) {
		return MvcCoreForm.instances[formId];
	};
	MvcCoreForm['SetInstance'] = function (formId, instance) {
		MvcCoreForm.instances[formId] = instance;
		return instance;
	};
	MvcCoreForm.prototype = {
		OldIe: MvcCoreForm.OLDIE,
		'Init': function () {
			var scope = this;
			this.Each(this['Fields'], function (i, field) {
				if (!('Init' in field)) return;
				try {
					field['Init'](scope);
				} catch (_x) {
					if (console) {
						console.log(_x, _x['stack'])
					} else {
						alert(_x['message'])
					}
				}
			});
			// do not use addEventListener - the it is not possible to get listener back as:
			// var originalEvent = myForm.onsubmit;
			// myform.onsubmit = function (e) {
			//		// any custom code here...
			//		return originalEvent(e);
			// };
			/*
			this.addEvent(this.Form, 'submit', function (e) {
				scope['OnSubmit'](e);
			});*/
			this.Form['onsubmit'] = function (e) {
				scope['OnSubmit'](e);
			};
		},
		'OnSubmit': function (e) {
			var e = e || window['event'],
				form = this.Form,
				result = true,
				errors = [];
			this.Each(this['Fields'], function (i, field) {
				var fieldName = field.name,
					fieldResult = [],
					fieldValue = typeof (form[fieldName]) != 'undefined' ? form[fieldName]['value'] : '';
				if (!('Validate' in field)) return;
				try {
					fieldResult = field['Validate'](fieldValue);
				} catch (e) {
					fieldResult = [e['message']];
				}
				if (fieldResult['length'] > 0) {
					result = false;
					errors['push'](fieldResult['join'](String['fromCharCode'](10)));
				}
			});
			if (!result) {
				alert(errors['join'](String['fromCharCode'](10)));
				e['preventDefault']();
				return false;
			}
		},
		AddEvent: function (elm, evnt, fn, capture) {
			var hndlr = function (e) {
				e = e || window['event'];
				var defaultPrevented = false,
					result = undefined;
				if (!e['preventDefault']) {
					e['preventDefault'] = function () {
						defaultPrevented = true;
					}
				}
				fn(e);
				if (defaultPrevented) {
					return false;
				}
			};
			if (this.OldIe) {
				elm.attachEvent('on' + evnt, hndlr);
			} else {
				elm.addEventListener(evnt, hndlr, !!capture);
			}
		},
		CreateElm: function (elm) {
			return document['createElement'](elm);
		},
		Append: function (parent, child) {
			if (this.OldIe) {
				return parent['insertAdjacentElement']('beforeEnd', child);
			} else {
				return parent['appendChild'](child);
			}
		},
		HasCls: function (elm, cls) {
			return String(' ' + elm['className'] + ' ').indexOf(cls) > -1;
		},
		AddCls: function (elm, cls) {
			elm['className'] += ' ' + cls;
		},
		RemoveCls: function (elm, cls) {
			var clsWithSpaces = ' ' + cls + ' ',
				regExp = new RegExp(clsWithSpaces, 'g'),
				resultCls = String(' ' + elm['className'] + ' ');
			while (resultCls.indexOf(clsWithSpaces) > -1) {
				resultCls = resultCls.replace(regExp, ' ');
			};
			elm['className'] = resultCls.replace(/\s+/g, ' ');
		},
		GetAttr: function (elm, attr) {
			return elm['getAttribute'](attr);
		},
		SetAttr: function (elm, attr, value) {
			return elm['setAttribute'](attr, value);
		},
		RemoveAttr: function (elm, attr) {
			return elm['removeAttribute'](attr);
		},
		Each: function (items, fn) {
			for (var i = 0, l = items['length']; i < l; i += 1)
				if (fn(i, items[i], items) === false)
					break;
		}
	};
	return MvcCoreForm;
})();
