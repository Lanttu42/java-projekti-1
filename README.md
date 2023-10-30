# java-projekti-1
This is a school project to learn basics of Java applications. The goal is to create first application and publish it on Netlify when it is done. You can do what ever you want to do with this code, but please undertand that the author of this code has very limited understanding of coding and might not even follow any discussions or suggestions. 

# The Assignment
Create an application for Weekly training counter, sheduling or some other with the similar functionality. 
While you can choose the theme, there are several features that the application must have:

Functional Requirements:

Recording Hours and Descriptions:
- Users should be able to enter various hours worked or spent on an activity.
- Users should also be able to provide descriptions for these activities. These descriptions can either be ready-made options or free-form text.

Displaying Summaries:
- The system should display a summary of the total hours recorded.
- The summary should also provide a breakdown by categories (e.g., work, study, training).
- You should calculate and display percentages for each category to give users an overview of where their time is spent.

Error Handling:
- Input fields should be validated to prevent incorrect or inappropriate content. For example, negative values for hours should not be allowed.
- When incorrect content is detected in an input field, the application should display an error message to inform the user of the issue.
- Additionally, the erroneous field should be visually highlighted, such as with a red border.

External CSS and JavaScript:
- The styling (CSS) and interactivity (JavaScript) of the application must be specified in separate external files. This promotes maintainability and separation of concerns in web development.

Data Persistence:
- The information entered by the user should be stored locally in the browser, typically using the localStorage feature. This allows users to return to the website and access their recorded data even after closing the browser.

# What I did
Well... As usually, I started with a few lines of code, went to full mäyhem and almost missed the deadline. But here it is: Self Training Director, or STD as... short. What is the STD you might ask. Well. To put it in only a one sentence, it is personal training app, where you can add, edit or delete your wellness trainings. Yes. Absolutely nothing to do with school trainings, because I totally misunderstood the original assignment and "training" means bicycling or cross jumping for me. Not school stuff.

# Security
There Is No Security At all. Good God! Never, ever use Localstorage to store your application data like this app does. :D 

# Usage
- Begin your joyrney by adding some new Plans from Plan menu. You can do something normal like Bicycling or just add Rest-days like any normal people would do.
- Now that you have some plans, you just need to open the app daily and check that you have done your choirs.
- If you miss a day, the app will punish you by saying that you had X amount of changes.

# Data issues
If you need to correct data, just use inspector and edit the data.

# "There is lots of unused code..."
Yes. Sorry about that. Read again about the deadline. :D
