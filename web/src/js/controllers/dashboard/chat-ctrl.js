angular
    .module('Persica')
    .controller('ChatCtrl', ['$scope',  'chatService', ChatCtrl]);
function ChatCtrl($scope, chatService) {
    var chat_observer = function() {
        $scope.messages = chatService.messages;
    };

    $scope.sendMessage = function(from, msg) {
    	chatService.sendMessage({from: from, msg: msg});
    };

    chatService.observers.push(chat_observer);
    chat_observer();
}