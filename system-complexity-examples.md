5.2 System Complexity 
5.2.1 Personalized Recommendation System 
The purpose of the personalized recommendation system in the WanderMy application is to 
enhance user experience by providing tailored suggestions for places to visit. This feature curates 
recommendations based on individual preferences, past interactions, geographical relevance, and 
cultural considerations. By integrating personalization at its core, the system helps users discover 
locations that align with their interests, habits, and requirements, promoting engagement and 
satisfaction within the app. 
The recommendation system is a highly complex, multi-layered component of the application. Its 
architecture combines sophisticated algorithms, dynamic data integration, and real-time 
adaptability to ensure high relevance and accuracy in the suggestions provided. The system 
retrieves a wide range of user data, including profiles, preferences, interaction history, and details 
of available places, from Firebase Realtime Database. This data acquisition occurs in real time, 
ensuring recommendations are based on the latest updates. 
User actions such as bookmarking places or interacting with recommendations are logged in real 
time using Firebase SDK, which influences future suggestions. Places already interacted with or 
bookmarked are excluded from the recommendation pool, ensuring fresh and diverse 
suggestions. Additionally, the modular design supports the integration of new scoring 
dimensions, such as seasonal trends or social ratings, without requiring significant rework. 
Figure 5.2.1.1 : Debugging output showing user attributes, interactions, and the recommendation 
generation process in real time. 
The system employs a machine learning-based TF-IDF (Term Frequency-Inverse Document 
Frequency) model to analyze textual data from places (tags, descriptions, and addresses) and 
transform it into numerical vectors. Cosine similarity is then calculated to rank places based on 
their relevance to the user's preferences and interaction history. Recommendations are refined 
using a multi-factor scoring mechanism, which balances the following: 
● Content Similarity: Places with matching tags and descriptions are ranked higher based 
on TF-IDF calculations. 
● User Preferences: Explicitly stated keywords or categories increase the score for 
matching places. 
● Geographical Relevance: Places in states matching the user’s profile are prioritized. 
● Religious Considerations: Non-Halal places are penalized or excluded for Muslim users. 
The output of this algorithm is illustrated in the following screenshot, displaying top-ranked 
places with their respective similarity scores. This ensures that users receive relevant and 
personalized suggestions. 
Figure 5.2.1.2 : Output of the personalized recommendation system displaying ranked places and their 
similarity scores. 
Key Features and Strengths 
1. Personalization  
Explicit signals like user preferences and religion are complemented by implicit signals, 
such as past interactions and geographical context, to tailor recommendations uniquely 
for each user. 
2. Error Handling and Fallbacks 
Errors in data retrieval or recommendation processing are logged to facilitate debugging. 
For new users with insufficient data, the system defaults to general recommendations, 
such as popular or recently added places, to maintain functionality. 
3. Seamless Integration 
By leveraging Firebase SDK and a Flask-based backend service, the system combines 
real-time updates with heavy computational tasks. The backend processes requests and 
returns recommendations in JSON format, while Axios on the frontend ensures efficient 
communication and error handling. 
By incorporating advanced algorithms, dynamic data handling, and multi-factor scoring, the 
WanderMy recommendation system provides highly personalized suggestions. Its ability to adapt 
to user preferences and behavior in real time, coupled with its robust error handling and modular 
architecture, ensures a seamless and engaging user experience. The technical sophistication and 
scalability of the system make it a valuable feature for enhancing user engagement and 
satisfaction. 
5.2.2 Nearby Services REcommendation 
A key enhancement of the WanderMy application is the Nearby Services Recommendation 
feature, which is particularly valuable for travelers seeking convenience during their journeys. 
This feature complements the personalized recommendation system by offering tailored 
suggestions for essential services, such as accommodations and prayer places, based on the user's 
travel itinerary. 
Accommodation Recommendations 
Figure 5.2.2.1 : Hotel Recommendation based on location of the trip 
The accommodation recommendation engine is designed to cater to diverse traveler preferences. 
It takes into account specific factors such as: 
● Budget Preferences: Users can choose between options classified as cheap, standard, or 
luxury accommodations. 
● Traveler Type: Recommendations are tailored for solo travelers, couples, families, or 
groups, ensuring the suggested options align with the user's needs and group dynamics. 
The system leverages the Google Places API to fetch highly rated hotels within a specified 
radius from the user's current or planned destination. By incorporating real-time data from the 
API, it ensures that users receive updated and accurate recommendations. The results are then 
filtered and ranked according to the user’s preferences, ensuring that each suggestion is relevant 
and meets their requirements. This personalized approach simplifies the decision-making process 
and enhances the overall travel experience. 
Nearest Prayer Facilities 
Figure 5.2.2.2 : Recommendation on the nearest praying place 
To further enrich the travel experience, the system also includes a feature for locating nearby 
prayer facilities. This functionality is particularly beneficial for Muslim travelers, ensuring they 
can easily find mosques or prayer rooms during their journeys. Using the Google Places API, the 
system identifies the nearest mosques or designated prayer areas and presents them to the user, 
complete with directions and other relevant details. This feature aligns with the app’s emphasis 
on accommodating cultural and religious needs, reinforcing its role as a comprehensive travel 
assistant. 
Integration with System Architecture 
The Nearby Services Recommendation feature seamlessly integrates with the existing 
architecture of the WanderMy application. Data retrieval from the Google Places API is 
combined with Firebase Realtime Database to enhance scalability and ensure real-time 
adaptability. User preferences for budget, traveler type, and religious considerations are 
dynamically processed, enabling the system to generate recommendations that are both accurate 
and personalized. 
By addressing practical needs such as accommodation and prayer facilities, the WanderMy 
application not only simplifies travel planning but also ensures users can enjoy a more 
convenient and culturally sensitive journey. This integration of personalized recommendations 
for nearby services further underscores the technical sophistication and user-centric design of the 
system. 
5.2.3 Gamification system (Extra Feature) 
The gamification system in the WanderMy application is designed to boost user engagement and 
encourage active participation by rewarding users with points and badges for their interactions. 
This system fosters a sense of accomplishment and motivates users to explore more destinations 
and contribute to the app, ultimately enhancing their overall experience. 
The points system is the foundation of the gamification feature. Users earn points for specific 
activities: 
Figure 5.2.3.1 : How to Earn Points Guidelines section 
● +5 Points: For submitting a review of an attraction or dining place. 
● +15 Points: For submitting a listing request that is approved by the admin. 
Points are prominently displayed in the user’s profile, alongside a progress bar that visualizes 
their advancement toward the next milestone. This clear and tangible feedback mechanism 
encourages users to engage further with the app by providing a sense of progress and 
achievement. 
Complementing the points system is the badges system, which rewards users for reaching 
specific milestones. The badges and their corresponding thresholds are: 
Figure 5.2.3.2 : Badges section 
● Horizon Seeker (100 points): Recognizing initial exploration efforts. 
● Wanderer’s Crest (200 points): Rewarding consistent engagement in exploring new 
destinations. 
● Odyssey Voyager (300 points): Celebrating extensive travel and exploration. 
● Pinnacle Explorer (400 points): The ultimate badge for users who reach the highest 
level of achievement 
Figure 5.2.3.3 and 5.2.3.4 : Badges Seeker page &My Badges page 
Badges are displayed in the "My Badges" section, where achieved badges are visually 
highlighted with their icons and descriptions. Unearned badges are also displayed, along with the 
points required to unlock them, creating clear goals for users to strive toward. 
Real-time feedback is a key feature of the system. Points and badges are updated instantly after a 
user performs an action, ensuring that their achievements are immediately visible. This instant 
gratification reinforces positive behavior and maintains user motivation. Progress bars and 
motivational messages, such as "Keep earning points to unlock exciting badges!" or "Earn 20 
more points to unlock the Wanderer’s Crest badge," provide additional encouragement. 
The combination of points, badges, and visual feedback creates a rewarding and engaging user 
experience. It transforms routine interactions, like submitting reviews or listing requests, into 
meaningful milestones that users can work toward. This system aligns with the app’s mission to 
inspire exploration and discovery while fostering user loyalty and satisfaction. 
The gamification system in WanderMy leverages well-designed incentives and progress 
visualization to enhance user engagement. By providing clear goals, real-time rewards, and a 
sense of achievement, it ensures users remain motivated to explore, contribute, and fully 
experience what the app has to offer.