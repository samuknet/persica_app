/**
 * Group List Controller
 */

var app = angular.module('Persica');

app.controller('GroupListCtrl', ['$scope', 'groupService', '$uibModal', '$state', GroupListCtrl]);

function GroupListCtrl($scope, groupService, $uibModal, $state) {
    $scope.groups = groupService.groups;

    $scope.navigateToGroup = function(gid) { // Called when group's row in table is clicked
        // Navigate to device profile page
        $state.go('group', {gid: gid});
    };

    $scope.openNewGroupModal = function () {
	    var modalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: '/templates/modals/newGroupModal.html',
	      controller: 'NewGroupModalCtrl'
	    });
    };    
}

app.controller('NewGroupModalCtrl', ['$scope', '$uibModalInstance', '$http', 'groupService', function($scope, $uibModalInstance, $http, groupService) {
    $scope.alertMsg   = 'Group ID and Name required.';
    $scope.alertClass = 'alert alert-info';
    $scope.submit = function() {
        groupService.newGroup(
            {name: $scope.name, description: $scope.description},
            function (response) {
                $uibModalInstance.close();
            },
            function (response) {
                $scope.alertMsg = response.data.message;
                $scope.alertClass = 'alert alert-danger';
            });
	};
	$scope.cancel = function() {
		$uibModalInstance.close();
	};
}]);