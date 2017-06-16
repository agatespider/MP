/*
 * Infodio Common Javascript lib (Infordio 전용 common util library) Dependency
 * javascript lib : - jquery.js (https://jquery.com/) - lodash.js
 * (https://lodash.com/)
 * 
 */

if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function(prop, handler) {
			var oldval = this[prop], 
				newval = oldval, 
				getter = function() {
					return newval;
				}, 
				setter = function(val) {
					oldval = newval;
					return newval = handler.call(this, this._$$parentNode, prop, oldval, val);
				};

			if (delete this[prop]) {
				Object.defineProperty(this, prop, {
					get: getter,
					set: setter,
					enumerable: true,
					configurable: true
				});
			}
		}
	});
}

if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function(prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}

(function(window, document, undefined) {
	'use strict';

	var workers = [],
	meta = {},
	$$forms = {};
	
	var supervisor = function(obj) {
		if (obj.selector !== undefined) {
			var id = obj.attr('id');
			var parentId = obj.closest('form').attr('id');
			($$forms[parentId])[id] = obj.val();
		} else {
			$('#'+obj.id).val(obj.val);
		}
	};

	// dom parser후 정보를 반환
	function domParser() {

	}
	
	function interWatcher(parentNodeId, id, oldval, val) {
		supervisor({
			parentNodeId: parentNodeId,
			id: id,
			oldval: oldval,
			val: val
		});
		return val;
	}
	
	function interpret($inputor) {
		var $parentForm = $inputor.closest('form'),
			parentFormId = $parentForm.attr('id'),
			inputerId = $inputor.attr('id'),
			parentFormer;
		
		meta[parentFormId+'_'+inputerId] = $inputor[0];
		
		if(typeof $$forms[parentFormId] === 'undefined') {
			parentFormer = $$forms[parentFormId] = {}
		} else {
			parentFormer = $$forms[parentFormId];
		}
			
		parentFormer[inputerId] = $inputor.val();
		parentFormer['_$$parentNode'] = parentFormId;
		parentFormer.watch(inputerId, interWatcher);
	}
	
	// Element 타입별로 분리 로직 필요. input text, radio, select 등등
	// 1차는 그냥 input만 후후훗
	var registWorker = function($inputors) {
		$inputors.each(function(i, inputor) {
			$(inputor).on('input', listener);
			interpret($(inputor));
		});
	};

	var listener = function(e) {
		supervisor($(e.currentTarget));
	};
	
	var $inputors = $('input[info-ng]');
	registWorker($inputors);


})(window, document);