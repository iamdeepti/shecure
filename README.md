

<p align='center'><img src = 'https://github.com/iamdeepti/shecure/blob/master/client/src/component/images/shecure.png'/></p>

<p align='center'> <h1 align='center'>ShECURE </h1></p>
Website link : http://shecure.herokuapp.com/

[![HitCount](http://hits.dwyl.com/iamdeepti/shecure.svg)](http://hits.dwyl.com/iamdeepti/shecure)

### INSPIRATION
Unsafe streets limits women’s choices in life forcing them to miss those important opportunities and moments where they can feel proud,confident and empowered.While many initiatives have been taken by the Ministry of Women and Child development like installation of CCTV monitors in railways stations with 24*7 monitoring , equipping phones with emergency helpline numbers(181) and panic buttons etc.
Our contribution in circumventing this problem is through ShECURE,a web-application which behaves like a personal safety map for women

#### ShECURE provides 2 utilities depending on user’s choice:

##### 1)Detecting the safest route:
The user enters the source and destination, the application extracts different possible routes using the Mapbox Directions API and for each route, it uses reverse geocoding API  to extract all the streets names in a particular route. For each street lying in the route, the k nearest neighbours model is used to predict the safety score of the street lying between 1- 4 (4 being highly safe and 1 being unsafe). Datasets used for the value of different factors specified were collected . Safety of a route is calculated by taking an average of all the safety scores from the streets lying in the route. 
The application then shows the safety score of each route and mark the safest route with green. It is the user’s choice to choose her path accordingly.

##### 2)Detecting the safety score of current position:
The application takes the current position of the user by using the Mapbox geolocation API. For the returned longitude and latitude, all the streets and places lying within the radius of 500m are extracted using the Mapbox Geocoding API. The safety scores of all these places are predicted using the machine learning model on taking the average of all the safety scores of the region. If the safety score is below a certain threshold an emergency SOS is activated and the user is alerted. We also depict the safety of the region by marking it green (safe) / red (unsafe).

##### 3)Feedback form:
We used feedback form to get few details like lighting that are not originally extracted through public datasets. User is asked to enter a rating and remark, sentiment analysis is done on the remark and a rating between 1-5 (1 suggesting safe and 5 suggesting safe) is assigned to it,an average of this score and the rating entered by user is taken, and if it's above a certain threshold (which we have taken to be 3) then the route is considered to be safe by user. This score isn't reflected in safety score, it's shown separately as the '*percentage of users who found this route safe*'.

### How to use this repo?
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

## Screenshots:
1) Safest route 
![MAP](https://github.com/iamdeepti/shecure/screenshots/blob/master/Capture1.PNG)
2) Current Location
![MY LOCATION](https://github.com/iamdeepti/shecure/screenshots/blob/master/Capture2.PNG)
3) Feedback Form
![Feedback form](https://github.com/iamdeepti/shecure/screenshots/blob/master/Capture3.png)
