public with sharing class WeatherService {
    
@AuraEnabled
public static WeatherInfo__c getOrCreateWeather(Id locationId) {
    // Query for the Location__c record
    Location__c location = [SELECT Id, Latitude__c, Longitude__c FROM Location__c WHERE Id = :locationId LIMIT 1];
    
    // Query for existing weather info for today
    Date today = Date.today();
    List<WeatherInfo__c> existingWeather = [
        SELECT Id, Temperature__c, Description__c, CreatedDate
        FROM WeatherInfo__c
        WHERE Location__c = :location.Id 
        AND CreatedDate = TODAY
        LIMIT 1
    ];
    
    // If weather exists, return it
    if (!existingWeather.isEmpty()) {
        return existingWeather[0];
    } else {
        // Call the API to get weather data
        WeatherInfo__c newWeather = callWeatherAPI((Double)location.Latitude__c, (Double)location.Longitude__c, locationId);
        newWeather.Location__c = locationId;
        insert newWeather; // Insert the new weather data
        return newWeather;
    }
}

    // Helper method to call weather API
    private static WeatherInfo__c callWeatherAPI(Double latitude, Double longitude, Id location) {
        String apiKey = '7f27d8d3d9e2838d6e9e85b0fb9eea09'; 
        String url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        WeatherInfo__c weatherInfo = new WeatherInfo__c();
        
        if (res.getStatusCode() == 200) {
            Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            Map<String, Object> main = (Map<String, Object>) results.get('main');
            Map<String, Object> weather = (Map<String, Object>) ((List<Object>) results.get('weather'))[0];

            weatherInfo.Temperature__c = (Double) main.get('temp') - 273.15; // Convert from Kelvin to Celsius
            weatherInfo.Description__c = (String) weather.get('description');
            weatherInfo.Location__c = location;
        } else {
            throw new CalloutException('Failed to retrieve weather');
        }

        return weatherInfo;
    }
}