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
        $rootScope.cart = JSON.parse(localStorage.getItem('session'));
        $rootScope.total = 0;
});
    
var filter = 'f034a4de-8143-11e7-8e40-12dbaf53d968';

app.controller("HomeController", function(){
    console.log("home controller");
})

app.controller("MerchandiseController", ['$rootScope', '$http', '$scope', '$location', function($rootScope, $http, $scope, $location){
    console.log('in merch controller');
    var category = $location.search().category;
    console.log(category);
     $scope.merch = [];
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
                $scope.merch.push(data);
            }
        })
        console.log($scope.merch);
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


 // for initializing localstorage 
    $scope.emptyStorage = function(){
        localStorage.clear();
        console.log('clicked');
        console.log(localStorage);
    };
    $scope.initializeStorage = function(){
        var a = [];
        localStorage.setItem('session', JSON.stringify(a));
        console.log(localStorage);
    }
// sends items to storage
    $scope.saveToCart = function(data, item){
        $rootScope.cart.push(data);
        localStorage.setItem('session', JSON.stringify($rootScope.cart));
        if($rootScope.total === 0){
            $rootScope.cart.forEach(function(item){
                if(item.price !== null){
                    $rootScope.total += item.price;
                }
            })
        } else{
            $rootScope.total +=item.price;
        }
    }
}])


// shopcart add 
app.controller("ShoppingController", ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {
    console.log('in shopping cart');
    console.log($rootScope.cart);
    console.log(localStorage);

    console.log($rootScope.total);

    $scope.checkout = function(){
        $location.path("/checkout");
    }

    $scope.removeItem = function(index){
        $rootScope.cart.splice(index, 1);
        localStorage.setItem('session', JSON.stringify($rootScope.cart));
        console.log(localStorage);
        $rootScope.cart.forEach(function(item){
            if(item.price !== null){
                $rootScope.total -= item.price;
            }
        })
    }

}]);