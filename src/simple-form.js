SimpleForm = function (form, fields) {
	this.Form = form;
	this.fields = fields || [];
	SimpleForm.instances[form.id] = this;
	this.init();
};
SimpleForm.OLDIE = /MSIE [6-8]/g.test(navigator.userAgent);
SimpleForm.instances = {};
SimpleForm['GetInstance'] = function (formId) {
	return SimpleForm.instances[formId];
};
SimpleForm.prototype = {
	OldIe: SimpleForm.OLDIE,
	init: function () {
		var scope = this;
		this.Each(this.fields, function (i, field) {
			if (!('Init' in field)) return;
			try {
				field['Init'](scope);
			} catch (e) {
				if (console) {
					console.log(e, е.stack)
				} else {
					alert(e.message)
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
			scope.onSubmit(e);
		});*/
		this.Form.onsubmit = function (e) {
			scope.onSubmit(e || window.event);
		};
	},
	onSubmit: function (e) {
		var form = this.Form,
			result = true,
			errors = [];
		this.Each(this.fields, function (i, field) {
			var fieldName = field.name,
				fieldResult = [],
				fieldValue = typeof (form[fieldName]) != 'undefined' ? form[fieldName].value : '';
			if (!('Validate' in field)) return;
			try {
				fieldResult = field['Validate'](fieldValue);
			} catch (e) {
				fieldResult = [e.message];
			}
			if (fieldResult.length > 0) {
				result = false;
				errors.push(fieldResult.join(String.fromCharCode(10)));
			}
		});
		if (!result) {
			alert(errors.join(String.fromCharCode(10)));
			e.preventDefault();
			return false;
		}
	},
	AddEvent: function (elm, evnt, fn, capture) {
		var hndlr = function (e) {
			e = e || window.event;
			var defaultPrevented = false,
				result = undefined;
			if (!e.preventDefault) {
				e.preventDefault = function () {
					defaultPrevented = true;
				}
			}
			fn(e);
			if (defaultPrevented) {
				return false;
			}
		};
		if (this.OldIe) {
			elm.attachEvent('on'+evnt, hndlr);
		} else {
			elm.addEventListener(evnt, hndlr, !!capture);
		}
	},
	CreateElm: function (elm) {
		return document.createElement(elm);
	},
	Append: function (parent, child) {
		if (this.OldIe) {
			return parent.insertAdjacentElement('beforeEnd', child);
		} else {
			return parent.appendChild(child);
		}
	},
	HasCls: function (elm, cls) {
		return String(' '+elm.className+' ').indexOf(cls) > -1;
	},
	AddCls: function (elm, cls) {
		elm.className += ' ' + cls;
	},
	RemoveCls: function (elm, cls) {
		elm.className = String(' ' + elm.className + ' ')
			.replace(' ' + cls + ' ', ' ')
			.replace(/\s+/g, ' ');
	},
	GetAttr: function (elm, attr) {
		return elm.getAttribute(attr);
	},
	SetAttr: function (elm, attr, value) {
		return elm.setAttribute(attr, value);
	},
	RemoveAttr: function (elm, attr) {
		return elm.removeAttribute(attr);
	},
	Each: function (items, fn) {
		for (var i = 0, l = items.length; i < l; i += 1) if (fn(i, items[i], items) === false) break;
	}
};