var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "../client/views/home.html",
    })
    .when("/apparel", {
        templateUrl: "../client/views/apparel.html",
    })
    .when("/misc", {
        templateUrl: "../client/views/misc.html",
    })
    .when("/checkout", {
        templateUrl: "../client/views/checkout.html",
    })
    .when("/invoice", {
        templateUrl: "../client/views/invoice.html"
    });
})
    .run(function($rootScope){
        $rootScope.api = "http://iambham-store-dev.us-east-1.elasticbeanstalk.com/api/v1/";
});

app.controller("ApparelController", ['$rootScope', '$http', '$scope', '$location', function($rootScope, $http, $scope, $location){
    console.log('in apparel controller');
    $http({
        method: 'GET', url: 'www.google.com/someapi', headers: {
    'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='}
});
}])