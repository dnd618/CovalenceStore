
app.controller('miscController',
    function ($scope, miscService, purchaseService, SEOService, $location) {
        
        $scope.misc = miscService.query();

        // console.log($scope.misc);

        $scope.addToCart = function (m) {

            purchaseService.addNewItem(m);
            
        SEOService.setSEO({
            title: 'Misc. Products',
            image: 'http://' + $location.host() + 'images/covalence-store-misc-hero.jpg',
            url: $location.url(),
            description: 'Shop for items that are not clothing'
        })
    }

})