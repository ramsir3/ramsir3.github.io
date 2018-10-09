var app = angular.module('diaryApp', ['ngSanitize']);

app.controller('diaryController', ['$scope', '$sanitize', '$sce', function($scope, $sanitize, $sce) {
	$scope.in = 'Hello welcome to *\\Diary*\\! Try using *stars* to tag your entries!';
	var txt = document.getElementById('txt');
	var pos;
	// console.log(txt);
	var rgx = /\*(?!\\)[^]*?\*(?!\\)/gm;
	var curEntry = {
		'text': '',
		'tags': [],
		'time': null
	};
	var type = function(input) {
		if (input != null && input != undefined) {
			if (input.match(/\(m\)/)) {
				return 'm';
			} else if (input.match(/\(s\)/)) {
				return 's';
			} else if (input.match(/\(l\)/)) {
				return 'l';
			} else {
				return 'g';
			}
		};
	};
	var clean = function(input) {
		return input.replace(/\*(?!\\)/g, '').replace(/\*\\/, '*').replace(/\((?!\\)([^\(\)]{1}?)\)/, '');
	};
	var site = function(type) {
		switch(type) {
		    case 'm':
		        return 'www.imdb.com/find?';
		        break;
		    case 's':
		        return 'google.com/#q=';
		        break;
		    case 'l':
		        return 'google.com/maps/place/';
		        break;
		    default:
	        	return 'google.com/#q=';
		}
	};
	$scope.trust = function(input) {
       return $sce.trustAsHtml(input);
     };
		
	$scope.entries = [];
	$scope.addEntry = function() {
		if (curEntry.text != undefined && curEntry.text != '') {
			console.log(curEntry.text);
			curEntry.time = new Date();
			$scope.entries = [curEntry].concat($scope.entries);
			console.log($scope.entries);
			curEntry = {
				'text': '',
				'tags': [],
				'time': null
			};
			$scope.in = '';	
		}
	};
	$scope.star = function(input) {
		// pos = doGetCaretPosition(txt);
		// console.log(pos);
		curEntry.text = input;
		if (input !== '') {
			curEntry.tags = input.match(rgx);
			if (curEntry.tags !== null && curEntry.tags !== undefined) {
				for (var i = 0; i < curEntry.tags.length; i++) {
					input = input.replace(curEntry.tags[i], '<span title="'+type(curEntry.tags[i])+'" class="tag">'+clean(curEntry.tags[i])+'</span>');
				}
			}
			return input.replace(/\*\\/g, '*');
		} else {
			return 'preview';
		}
	};

	$scope.display = function(input) {
		var out = input.text;
		for (var i = 0; input.tags && i < input.tags.length; i++) {
			out = out.replace(input.tags[i],
				'<a class="tag" href="http://'+site(type(input.tags[i]))
				+clean(input.tags[i]).replace(/ /, '+')+'" target = "_blank">'
				+clean(input.tags[i])+'</a>');
		}
		out = out.replace(/\*\\/g, '*');
		return out;
	};

	function doGetCaretPosition (ctrl) {
		var CaretPos = 0;	// IE Support
		if (document.selection) {
		ctrl.focus ();
			var Sel = document.selection.createRange ();
			Sel.moveStart ('character', -ctrl.value.length);
			CaretPos = Sel.text.length;
		}
		// Firefox support
		else if (ctrl.selectionStart || ctrl.selectionStart == '0')
			CaretPos = ctrl.selectionStart;
		return (CaretPos);
	}
	function setCaretPosition(ctrl, pos){
		if(ctrl.setSelectionRange)
		{
			ctrl.focus();
			ctrl.setSelectionRange(pos,pos);
		}
		else if (ctrl.createTextRange) {
			var range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}

	$scope.addT = function() {
		// var text = $scope.in.split(pos);
		// console.log(text);
		// $scope.in = text[0] + '**' + text[1];
		$scope.in += '**';
	};
	$scope.addL = function() {
		$scope.in += '(l)';
	};
	$scope.addM = function() {
		$scope.in += '(m)';
	};
	$scope.addS = function() {
		$scope.in += '(s)';
	};
}]);