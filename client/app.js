var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routProvider) {
    $routProvider
    .when("/", {
        templateUrl: "/views/home.html",
    })
    .run(function($rootScope){
        $rootScope.api = 'http://iambham-store-dev.us-east-1.elasticbeanstalk.com/api/v1/';
    })
})