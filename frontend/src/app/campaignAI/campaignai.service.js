angular.module('frontend').factory('CampaignAIService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/campaignai/';

    service.createCampaignAI = function(campaignAIData) {
        return $http.post(baseUrl, campaignAIData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.getAllCampaignAI = function(groupId) {
        return $http.get(baseUrl, { params: { group_id: groupId } });
    };

    service.getCampaignAIById = function(campaignAIId) {
        return $http.get(baseUrl + campaignAIId);
    };

    service.updateCampaignAI = function(campaignAIId, campaignAIData) {
        return $http.put(baseUrl + campaignAIId, campaignAIData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.deleteCampaignAI = function(campaignAIId) {
        return $http.delete(baseUrl + campaignAIId);
    };

    return service;
}]);
