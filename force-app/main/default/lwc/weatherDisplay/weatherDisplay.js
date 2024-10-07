import { LightningElement, api } from 'lwc';
import getOrCreateWeather from '@salesforce/apex/WeatherService.getOrCreateWeather';

export default class WeatherDisplay extends LightningElement {
    @api recordId;
    temperature;
    description;

    connectedCallback() {
        // Call Apex method with the recordId
        getOrCreateWeather({ locationId: this.recordId })
            .then(result => {
                this.temperature = result.Temperature__c;
                this.description = result.Description__c;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }
}