# Salesforce LWC Components: TaskManager & WeatherInfo

## Overview
This repository contains two Salesforce Lightning Web Components (LWC):

1. **TaskManager**: A component for managing tasks.
2. **WeatherInfo**: A component that retrieves and displays real-time weather data.

## Features

### TaskManager
- View, mark, and create tasks.
- SLDS-styled for consistent UI.
  
### WeatherInfo
- Fetches weather data using the OpenWeather API.
- Displays real-time temperature and conditions.

## Installation
1. Clone the repository:
   
   git clone git-username@github.com:rk-deve/sf-task-oct24.git 

2. Navigate to your project directory:

    cd <your_project_directory>

3. Authorize your Salesforce Org:

    sfdx auth:web:login

4. Deploy the code:

    sfdx force:source:deploy -p force-app

5. Manual step for Weather Display 

   Goto the 'Sales' App in Salesforce, Create Tab for Location__c 
   Add some test data 
   Name : London 
   Latitude: 51.50986500
   Longitude: -0.11809200

   Edit Location__c page, drop the component - weatherDisplay 

6. Manual step for taskManager 

   If you don't have a custom home page, goto Lightning App Builder
   Create a App Home Page and set it as org-default
   Edit page and drop - taskManager 

   the task can be marked complete by clicking the + sign 
   the tasks that are complete have tick sign (disabled)
   To create a new task - use the button 
