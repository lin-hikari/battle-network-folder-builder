This is a folder (or deck) builder based on Mega Man Battle Network 2 by Capcom.

It's a project I made to sharpen my back-end programming skills! It uses Node.js, NoSQL (mongoose), and other fun stuff. Some testing has been implemented with Mocha/Chai/Sinon, but not all of it yet.

It also uses tokens to verify user-related routes, has improved header security, and through data validation! It is currently deployed on Fly.io at https://bn-folder-builder.fly.dev (although it lacks a front-end for now, so most interactions must be made with Postman or a similar tool).

So far, you can:
>Create an account with email verification (required to edit folders) - 
>View and download folders (as JSON) without needing an account - 
>Freely create, edit, and delete folders. One account can create up to 10 folders

And lastly, the chips data are preemptively to the database. Currently not all chips are in there, and once they are, I will make available a JSON file with all of them.

If you want to see something quick, here's a small example folder I made: https://bn-folder-builder.fly.dev/view-folder/6474c771e9b6d7089aeefa7d

To-do:
>Finish tests for all methods - 
>Add more chips to the database - 
>Add more restrictions based on the in-game folder rules - 
>Refactor the method that adds chips to folder so that it can add multiple chips in one go
