angular.module('frontend').factory('TimeslotService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://18.201.85.201/api/timeslot/';

        service.createTimeslot = function(timeslotData) {
            return $http.post(baseUrl, timeslotData);
        };

        service.getAllTimeslots= function(perioddsId) {
            return $http.get(baseUrl, { params:{ periodds_id: perioddsId } });
        };
        service.getTimeslotById= function(timeslotId) {
            return $http.get(baseUrl + timeslotId);
        };
        service.updateTimeslot= function(timeslotId, timeslotData) {
            return $http.put(baseUrl + timeslotId, timeslotData);
        };
        service.deleteTimeslot= function(timeslotId) {
            return $http.delete(baseUrl + timeslotId);
        };

        return service;
}]);
