var app = angular.module('tutorialWebApp', [
    'ui.bootstrap',
    'ngRoute',
    'ngSanitize'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "partials/home.html", controller: "PageCtrl" })
        .when("/product", { templateUrl: "partials/product.html", controller: "PageCtrl" })
        .when("/q2", { templateUrl: "partials/q2.html", controller: "Q2Ctrl" })
        .when("/q3", { templateUrl: "partials/q3.html", controller: "Q3Ctrl" })
        .when("/q4", { templateUrl: "partials/q4.html", controller: "Q4Ctrl" })
        .when("/q5", { templateUrl: "partials/q5.html", controller: "Q5Ctrl" });
}]);

//forcast service to expose defer object 
app.service('forcastService', function($http, $q) {
    this.getForcast = function() {
        var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

        var q = $q.defer();
        $http.get(url).then(function(result) {
            q.resolve(result);
            //q.reject(result);
        });

        return q.promise;
    }

    this.getAllForcast = function() {
        var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        var deferred = $q.defer();

        var urlCalls = [];
        for (var i = 0; i < 10; i++) {
            urlCalls.push($http.get(url));
        }

        $q.all(urlCalls)
            .then(
                function(results) {
                    deferred.resolve(results);
                },
                function(errors) {
                    deferred.reject(errors);
                },
                function(progress) {
                    deferred.update(progress);
                });
        return deferred.promise;

    }

});

app.controller('Q2Ctrl', function($scope, $http, forcastService) {
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    //Example to demonstrate promise 
    $scope.doPromiseCall = function() {
        $scope.promiseContent = "Fetching data...";
        var promise = $http.get(url);
        promise.then(
            function(result) {
                $scope.promiseContent = result.data.query.results.channel.description;
            },
            function(error) {
                $scope.promiseContent = error;
            },
            function(progress) {
                $scope.promiseContent = " call is in progress ";
            });

    }

    $scope.doQPromiseCall = function() {
        //Example to demonstrate promise resolve and reject
        var promise = forcastService.getForcast();
        $scope.promiseQContent = "Fetching data...";
        promise.then(
            function(result) {
                $scope.promiseQContent = result.data.query.results.channel.description;
            },
            function(error) {
                $scope.promiseQContent = error;
            },
            function(progress) {
                $scope.promiseQContent = " call is in progress ";
            }).catch(
            function(failure) {
                $scope.promiseQContent = failure;
            }).finally(function() {
            console.log('Finished');
        })

    }

    $scope.doQAllPromiseCall = function() {
        //Example to demonstrate $q.all 
        var starttime = Date.now();
        var promise = forcastService.getAllForcast();
        $scope.promiseQAllContent = "Fetching data..."
        promise.then(
            function(result) {
                $scope.promiseQAllContent = "Got " + result.length + " set of data.";
            },
            function(error) {
                $scope.promiseQAllContent = error;
            },
            function(progress) {
                $scope.promiseQAllContent = " call is in progress ";
            }).catch(
            function(failure) {
                $scope.promiseQAllContent = failure;
            }).finally(function() {
            $scope.promiseQAllContent += ' >>>>Finished after : ' + ((Date.now() - starttime) / 1000) + ' second(s)';
            console.log('Finished after : ' + ((Date.now() - starttime) / 1000) + ' second(s)');
        })
    }
});
app.controller('Q3Ctrl', function($scope) {

    $scope.validateFields = function(id) {
        $scope.error = "";
        var form = document.getElementById(id);
        var elements = form.querySelectorAll(".form-control");
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].value == "") {
                $scope.error += elements[i].placeholder + " is Missing \n<br>";
            }
        }
        if ($scope.error === "") {
            $scope.error = "Validation pass."
        }
    }
});
app.controller('Q4Ctrl', function($scope) {
    var i = 0;
    var bookSt = function() {
        var books = ["Gandhi", "Washington", "Churchill", "Mandela"];
        return {
            next: function() {
                $scope.bookName = i < books.length ? books[i++] : "Go previous";
            },
            previous: function() {
                $scope.bookName = i > 0 ? i >= books.length ? books[i = i - 1] : books[--i] : "Go next";
            }
        }
    }
    $scope.bookStore = bookSt();
    /*    $scope.bookStore.next();
        $scope.bookStore.next();
        $scope.bookStore.previous();
        $scope.bookStore.previous();*/

});
app.controller('Q5Ctrl', function($scope) {
    var bookSubs = [{ "product": "ESPN", "type": "subscription", "frequency": "monthly", "amount": "15" }, { "product": "ESPN", "type": "contract", "frequency": "perpetual", "amount": "15" }, { "product": "Sports Illustrated", "type": "subscription", "frequency": "monthly", "amount": "10" }, { "product": "Golf Digest", "type": "subscription", "frequency": "yearly", "amount": "30" }, { "product": "Alarm System", "type": "contract", "frequency": "monthly", "amount": "14" }, { "product": "Equipment Fee", "type": "fee", "frequency": "onetime", "amount": "10" }, { "product": "Installation", "type": "fee", "frequency": "onetime", "amount": "25" }, { "product": "Installation", "type": "fee", "frequency": "annual", "amount": "25" }];
    $scope.getSummary = function() {
        $scope.total = "Total : " + bookSubs.map(function(item) {
            return item.amount;
        }).reduce(function(prev, curr) {
            return parseInt(prev) + parseInt(curr);
        });
        console.log($scope.total);
        var sum = 0;

        var objByTypeFreq = bookSubs.reduce(function(result, item, b, bookSubs) {
            if (!result[item.type + "_" + item.frequency]) {
                var sumAmt = bookSubs.filter(function(exist) {
                    return (item.type === exist.type && item.frequency === exist.frequency)
                }).reduce(function(a, b) {
                    return a + parseInt(b.amount);
                }, 0);
                result[item.type + "_" + item.frequency] = sumAmt;
            }
            return result;
        }, {})
        $scope.totByTypeNFreq = "Total by type and frequency : " + JSON.stringify(objByTypeFreq);
        console.log($scope.totByTypeNFreq);
    }
});
app.controller('BCrumCtrl', function($scope, $element, $location, $http) {
    $scope.go = function(path) {
        var bc = document.querySelector(".bc");
        for (var i = 0; i < bc.children.length; i++) {
            if (bc.children[i].className.indexOf("act") > -1) {
                bc.children[i].className = bc.children[i].className.replace("act", "");
            }
            if (bc.children[i].getAttribute("name") == event.currentTarget.getAttribute("name")) {
                bc.children[i].className += " act";
            }
        }

        $location.path(path);
    };
});


app.controller('PageCtrl', ['$scope', function($scope) {

    $scope.products = [{
        "product": "ESPN",
        "type": "subscription",
        "frequency": "monthly",
        "amount": "15"
    }, {
        "product": "ESPN",
        "type": "contract",
        "frequency": "perpetual",
        "amount": "15"
    }, {
        "product": "Sports Illustrated",
        "type": "subscription",
        "frequency": "monthly",
        "amount": "10"
    }, {
        "product": "Golf Digest",
        "type": "subscription",
        "frequency": "yearly",
        "amount": "30"
    }, {
        "product": "Alarm System",
        "type": "contract",
        "frequency": "monthly",
        "amount": "14"
    }, {
        "product": "Equipment Fee",
        "type": "fee",
        "frequency": "one­time",
        "amount": "10"
    }];

}])
