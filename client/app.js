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
    .when("/single", {
        templateUrl: "../client/views/single.html",
    })
    .when("/invoice", {
        templateUrl: "../client/views/invoice.html"
    });
})
    .run(function($rootScope){
        $rootScope.api = "http://iambham-store-dev.us-east-1.elasticbeanstalk.com/api/v1/";
});
    
var filter = 'f034a4de-8143-11e7-8e40-12dbaf53d968';

app.controller("MerchandiseController", ['$rootScope', '$http', '$scope', '$location', function($rootScope, $http, $scope, $location){
    console.log('in apparel controller');
    var category = $location.search().category;
    console.log(category);
    $http.get('http://iambham-store-dev.us-east-1.elasticbeanstalk.com/api/v1/products/all',{
        headers: {
            'Filter': filter}
    })
    .then(function(response){
        console.log(response.data.data);
        $scope.merchandise = response.data.data;
        $scope.merchandise.forEach(function(data){
            if(data.category == category){
                console.log(data);
            }
        })
    })
}])