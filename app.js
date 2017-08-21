(function(){
	'use strict';
	angular.module("NarrowItDownApp", [])
	.controller("NarrowItDownController", NarrowItDownController)
	.service("MenuSearchService", MenuSearchService)
	.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
	.directive('foundItems', FoundItemsDirective);

	function FoundItemsDirective(){
		var ddo = {
		    restrict: 'E',
		    templateUrl: "dishList.html"
		};

  		return ddo;
	}



	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController(MenuSearchService){
		var narrow = this;

		narrow.searchTerm = "";

		narrow.info = "";
		
		narrow.search = function(thing){
			var promise = MenuSearchService.getMatchedMenuItems(thing);
			promise.then(function (response) {
		    	narrow.found = response;
		    	if(narrow.found.length === 0){
		    		narrow.info = "Nothing found!"
		    	}
		 	})
		  	.catch(function (error) {
		    	console.log("Something went terribly wrong.");
		  	});
		}
		narrow.doNotWant = function(index){
			narrow.found.splice(index, 1);
		}
		
	}

	MenuSearchService.$inject = ["$http", "ApiBasePath"];
	function MenuSearchService($http, ApiBasePath){
		var service = this;

		service.getMatchedMenuItems = function(searchTerm){
			return $http({
				method: "GET",
				url: (ApiBasePath + "/menu_items.json")
				})
				.then(function(result){
				var opa = result.data;
				var foundItems = [];
				for( var i = 0; i < opa.menu_items.length; i++){
					var description = opa.menu_items[i].description;
					if(description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
						var dish = {
							name: opa.menu_items[i].name,
							shortName: opa.menu_items[i].short_name,
							description: opa.menu_items[i].description
						}
						foundItems.push(dish);
					}
				}
				return foundItems;
			})			
		};
	}
}())