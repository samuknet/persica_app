/**
 * Widget Header Directive
 */

angular
    .module('Persica')
    .directive('rdWidgetHeader', rdWidgetTitle);

function rdWidgetTitle() {
    var directive = {
        requires: '^rdWidget',
        scope: {
            title: '@',
            icon: '@'
        },
        transclude: true,
        template: '<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-s-6 col-s-6" ng-transclude></div></div></div>',
        restrict: 'E'
    };
    return directive;
};