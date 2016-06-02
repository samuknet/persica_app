angular.module('Persica').service('pageVisibilityService', ['$pageVisibility', function ($pageVisibility) {
	var visible = true;

	$pageVisibility.$on('pageFocused', function(){
		// page is focused
		visible = true;
     });

	$pageVisibility.$on('pageBlurred', function(){
		// page is blurred
		visible = false;
	});


	this.isPageVisible = function() {
		return visible;
	}
}]);