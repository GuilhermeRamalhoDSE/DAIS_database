angular.module('frontend').factory('TimeslotService', ['$http', function($http) {
    const baseUrl = 'http://127.0.0.1:8000/api/timeslot/';

    return {
        createTimeslot: function(timeslotData) {
            return $http.post(baseUrl, timeslotData);
        },
        getAllTimeslots: function(perioddsId) {
            return $http.get(baseUrl, { period_id: perioddsId });
        },
        getTimeslotById: function(timeslotId) {
            return $http.get(baseUrl + timeslotId);
        },
        updateTimeslot: function(timeslotId, timeslotData) {
            return $http.put(baseUrl + timeslotId, timeslotData);
        },
        deleteTimeslot: function(timeslotId) {
            return $http.delete(baseUrl + timeslotId);
        }
    };
}]);
