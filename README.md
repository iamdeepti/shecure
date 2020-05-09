# SheCURE
![LOGO]()
## A personal safety map app for women

While it is physically not feasible to simply rebuild the roads and streets, a number of measures are being taken to make women feel more secure while travelling. Our contribution to circumventing this problem is through ShECURE.
ShECURE is a web-application which behaves like a personal safety map for women. 

#### ShECURE provides 2 utilities depending on user’s choice:

##### 1)Detecting the safest route:
The user enters the source and destination, the application extracts different possible routes using the Mapbox Directions API and for each route, it uses reverse geocoding API  to extract all the streets names in a particular route. For each street lying in the route, the k nearest neighbours model is used to predict the safety score of the street lying between 1- 4 (4 being highly safe and 1 being unsafe). Datasets used for the value of different factors specified were collected from ... Safety of a route is calculated by taking an average of all the safety scores from the streets lying in the route. 
The application then shows the safety score of each route and mark the safest route with green. It is the user’s choice to choose her path accordingly.

##### 2)Detecting the safety score of current position:
The application takes the current position of the user by using the Mapbox geolocation API. For the returned longitude and latitude, all the streets and places lying within the radius of 500m are extracted using the Mapbox Geocoding API. The safety scores of all these places are predicted using the machine learning model on taking the average of all the safety scores of the region. If the safety score is below a certain threshold an emergency SOS is activated and the user is alerted. We also depict the safety of the region by marking it green (safe) / red (unsafe).

##### 3)Feedback form:
We used feedback form to get few details that are not originally extracted through public   datasets 

### How to use this repo
Fork or clone this repo, then run the following commands in sequence
1) cd to the directory
   *cd path_to_directory*
2) npm install
*This will install all the node modules for server files*
3) cd client
*Moving to client folder*
4) npm install
*this will install all the node modules for client directory*
5) cd ..
6) npm run dev 
*This command will run both back-end and front-end simultaneously*

#Screenshots:
1) Safest route 
![MAP](https://github.com/iamdeepti/shecure/blob/master/Capture1.PNG)
2) Current Location
![MY LOCATION](https://github.com/iamdeepti/shecure/blob/master/Capture2.PNG)
3) Feedback Form
![Feedback form](https://github.com/iamdeepti/shecure/blob/master/Capture3.png)
