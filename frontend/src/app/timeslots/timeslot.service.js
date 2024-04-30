angular.module('frontend').factory('TimeslotService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/timeslot/';

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
