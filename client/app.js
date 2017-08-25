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
        templateUrl: "../client/views/invoice.html",
    })
    .when("/thanks", {
        templateUrl: "../client/views/thanks.html",
    });
})
    .run(function($rootScope){
        $rootScope.api = "http://iambham-store-dev.us-east-1.elasticbeanstalk.com/api/v1/";
        $rootScope.cart = JSON.parse(localStorage.getItem('session'));
        $rootScope.total = 0;
});
    
var filter = 'f034a4de-8143-11e7-8e40-12dbaf53d968';

app.controller("HomeController", ['$rootScope', function($rootScope){
    $rootScope.hideCart = true;
    $rootScope.hideFooter = true;
}])

app.controller("MerchandiseController", ['$rootScope', '$http', '$scope', '$location', function($rootScope, $http, $scope, $location){
    $rootScope.hideCart = false;
    $rootScope.hideFooter = false;
    var category = $location.search().category;
    $scope.merch = [];
    $http.get($rootScope.api + 'products/all',{
        headers: {
            'Filter': filter}
    })
    .then(function(response){
        $scope.merchandise = response.data.data;
        $scope.merchandise.forEach(function(data){
            if(data.category == category){
                $scope.merch.push(data);
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
    $rootScope.hideCart = false;
    $rootScope.hideFooter = false;
    id = $routeParams.id; 
    $http.get($rootScope.api + 'products/one/' + id,{
        headers: {
            'Filter': filter}
        })
        .then(function(response){
            $scope.oneItem = response.data.data;
        })
// sends items to storage
    $scope.saveToCart = function(data, item){
        console.log(data);
        console.log($rootScope.cart);
        console.log(localStorage);
        if($rootScope.cart === null){
            var a = [];
            localStorage.setItem('session', JSON.stringify(a));
            $rootScope.cart = JSON.parse(localStorage.getItem('session'));
        }
        $rootScope.cart.push(data);
        localStorage.setItem('session', JSON.stringify($rootScope.cart));
        if($rootScope.total === 0){
            $rootScope.cart.forEach(function(item){
                if(item.price !== null){
                    $rootScope.total += item.price;
                }
            })
        } else{
            $rootScope.total +=data.price;
        }
     
    }
}])


// shopcart add 
app.controller("ShoppingController", ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {
    $rootScope.hideCart = false;
    $rootScope.hideFooter = false;
    if($rootScope.cart === null){
        return;
    }else{
        $rootScope.cart.forEach(function(item){
            if(item.price !== null){
                $rootScope.total += item.price;
            }
        });
    }

    $scope.checkout = function(){
        $location.path("/checkout");
    }

    $scope.removeItem = function(index, data){
        $rootScope.cart.splice(index, 1);
        localStorage.setItem('session', JSON.stringify($rootScope.cart));
        $rootScope.total -= data.price;
    }
}]);


// Checkout Controller
app.controller("CheckoutController", ['$rootScope', '$http', '$scope', '$location','myFac', function($rootScope, $http, $scope, $location,myFac){
    $rootScope.hideCart = true;
    $rootScope.hideFooter = false;
    var data = {
        price: $rootScope.total
    }
    $scope.createInvoice = function(){
        $http.post($rootScope.api + 'invoices', data,{
            headers: {
                'Filter': filter}
        })
        .then(function(){
            $location.path('/thanks');
            localStorage.clear();
            $rootScope.cart = [];
            $rootScope.total = 0;
        })
    }
    $scope.removeItem = function(index, data){
        $rootScope.cart.splice(index, 1);
        localStorage.setItem('session', JSON.stringify($rootScope.cart));
        $rootScope.total -= data.price;
    }
   
    var cat = document.getElementById("cscinput");
    cat.addEventListener("click", function(){
        var cCard = document.getElementById("cCard").value;
       myFac.getCardBrand(cCard);
    });
}])

app.factory("myFac", function() {
    var fac = {};

    fac.getCardBrand = function(num) {
        
            var brand,
                patterns = [
                    { name: 'amex', pattern: /^3[47]/ },
                    { name: 'dankort', pattern: /^5019/ },
                    { name: 'dinersclub', pattern: /^(36|38|30[0-5])/ },
                    { name: 'discover', pattern: /^(6011|65|64[4-9]|622)/ },
                    { name: 'jcb', pattern: /^(35|1800|2131)/ },
                    { name: 'laser', pattern: /^(6706|6771|6709)/ },
                    { name: 'maestro', pattern: /^(5018|5020|5038|6304|6703|6759|676[1-3])/ },
                    { name: 'mastercard', pattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/ },
                    { name: 'unionpay', pattern: /^62/ },
                    { name: 'visaelectron', pattern: /^4(026|17500|405|508|844|91[37])/ },
                    { name: 'elo', pattern: /^4011|438935|45(1416|76|7393)|50(4175|6699|67|90[4-7])|63(6297|6368)/ },
                    { name: 'visa', pattern: /^4/ }
                ];
    
            patterns.some(function(p) {
                if (p.pattern.test(num)) {
                    brand = p.name;
                    return true;
                }
            });
            
    if(brand === "discover"){
                    console.log("This is a discover");
                    var discover = document.getElementById("discover");
                    $(discover).css("border", "2px yellow solid")
                } else if(brand === "visa"){
                    console.log("this is a visa");
                    var visa = document.getElementById("visa");
                    $(visa).css("border", "2px yellow solid");
                } else if(brand === "amex"){
                    var amex = document.getElementById("amex");
                    $(amex).css("border", "2px yellow solid")
                    console.log("this is amex");
                } else if(brand === "mastercard"){
                    console.log("this is a mastercard");
                    var mastercard = document.getElementById("mastercard");
                    $(mastercard).css("border", "2px yellow solid")
                }
        }
    return fac;
})

// Invoices Controller
app.controller("InvoiceController", ['$rootScope', '$http', '$scope', function($rootScope, $http, $scope){
    $rootScope.hideCart = true;
    $http.get($rootScope.api + 'invoices/all',{
        headers: {
            'Filter': filter}
    })
    .then(function(response){
        $scope.allInvoices = response.data.data;
    })
}])