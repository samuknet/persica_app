angular
    .module('Persica')
    .controller('ChatCtrl', ['$scope',  'chatService', 'userService', ChatCtrl]);
function ChatCtrl($scope, chatService, userService) {
    var chat_observer = function() {
        $scope.messages = chatService.messages;
    };

    $scope.sendMessage = function(msg) {
    	chatService.sendMessage({from: userService.currentUser.username, msg: msg});
    };

    chatService.observers.push(chat_observer);
    chat_observer();
}