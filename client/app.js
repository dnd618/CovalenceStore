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
    .when("/single/:id", {
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

app.controller("HomeController", function(){
    console.log("home controller");
})

app.controller("MerchandiseController", ['$rootScope', '$http', '$scope', '$location', function($rootScope, $http, $scope, $location){
    console.log('in merch controller');
    var category = $location.search().category;
    console.log(category);
    $http.get($rootScope.api + 'products/all',{
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
    .catch(function(error){
        alert('Uh oh! Please refresh the page.');
    })
    $scope.singlePath = function(id){
        $location.path('/single/' + id)
    };
}])

app.controller("SingleController", ['$rootScope', '$http', '$scope', '$location', '$routeParams', function($rootScope, $http, $scope, $location, $routeParams){
    console.log("in single controller");
    id = $routeParams.id; 
    $http.get($rootScope.api + 'products/one/' + id,{
        headers: {
            'Filter': filter}
        })
        .then(function(response){
            $scope.oneItem = response.data.data;
            console.log($scope.oneItem);
        })
	$scope.saved = localStorage.getItem('items');
	$scope.items = (localStorage.getItem('items')!==null) ? JSON.parse($scope.saved) : [ {name: 'Hey buy me', price: 3000}];
	localStorage.setItem('items', JSON.stringify($scope.items));
	$scope.addToCart = function() {
		// $scope.items.push({
		// 	name: $scope.name,
		// 	price: $scope.price
		// });
        localStorage.setItem('items', JSON.stringify($scope.items));
        console.log(localStorage);
	};
}])
// shopcart add 
app.controller("ShoppingController", ['scope', function($scope) {


}]);