angular.module('frontend').factory('CampaignDSService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/campaignds/';

    service.createCampaignDS = function(campaignDSData) {
        return $http.post(baseUrl, campaignDSData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.getAllCampaignDS = function(groupId) {
        return $http.get(baseUrl, { params: { group_id: groupId } });
    };

    service.getCampaignDSById = function(campaignDSId) {
        return $http.get(baseUrl + campaignDSId);
    };

    service.updateCampaignDS = function(campaignDSId, campaignDSData) {
        return $http.put(baseUrl + campaignDSId, campaignDSData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.deleteCampaignDS = function(campaignDSId) {
        return $http.delete(baseUrl + campaignDSId);
    };

    return service;
}]);
