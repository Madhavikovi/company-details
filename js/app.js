'use strict';

angular.module('myApp', [])
  .controller('CompanyController', function($scope, $http){
	  $scope.getCompanyDetails = function(){

		  var primarySymbol = '';
		  $http.get("http://edgaronline.api.mashery.com/v2/companies?fields=primarysymbol&companynames=" + $scope.company + "&appkey=apfn5drrntkur4gk4ebkdggj")
		 	 .then(function(response){
		 		 if (response.data.result.totalrows > 0) {
		 			 var data = [];
			 		 var rowData = [];
		 			 data = response.data.result.rows
			 		 data.forEach(function(key, index){
				 		 rowData = key.values;
			 			 rowData.forEach(function(key, index){
				 			if (key.field == "primarysymbol"){
				 				if (primarySymbol != '')
				 					primarySymbol += ","
				 				primarySymbol += key.value;
				 			}
			 			 });
			 		 });
		 		 }
		 		 if (primarySymbol == '')
		 			primarySymbol = 'MSFT';
		 		 
		 		$http.get("http://edgaronline.api.mashery.com/v2/corefinancials/ann?primarysymbols=" + primarySymbol + "&appkey=apfn5drrntkur4gk4ebkdggj")
		    	 .then(function(response){ 
		    		 data = response.data.result.rows;
		    		 data.forEach(function(key, index){
				 		 rowData = key.values;
				 		 var changedRowData = {};
			 			 rowData.forEach(function(key, index){
			 				changedRowData[key.field] = key.value;
			 			 });
		    			 key.values = changedRowData;
			 		 });
		    		 
		    		 var itemHash = {};
		    		 data.forEach(function(key, index){
				 		 rowData = key.values;
				 		 
				 		 $.each(rowData, function(key, value){
			 				 if ($.isEmptyObject(itemHash[rowData.companyname]))
			 					 itemHash[rowData.companyname] = {};
			 				 if ($.isEmptyObject(itemHash[rowData.companyname][key]))
			 					 itemHash[rowData.companyname][key] = {};
			 				 
			 				 if (angular.isNumber(value))
			 					 value = (value + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			 				 
			 				 itemHash[rowData.companyname][key][rowData.fiscalyear] = value;
			 			 });
			 		 });
		    		 $scope.coreFinanceAnn = itemHash;
		    		 $scope.error = ''; })
		    	 .catch(function(response){
		    		 $scope.error = response.data.Message;
		         });
		 		
		 		
		 		 
		 	 })
		 	 
	  }
  });