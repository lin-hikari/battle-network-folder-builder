# Battle Network Folder Builder

This is an API for a folder (or deck) builder based on the game Mega Man Battle Network 2 by Capcom. It's not full-feature yet, but has a good amount of functionalities added!

It is currently deployed on Fly.io at https://bn-folder-builder.fly.dev (although it lacks a front-end for now, so most interactions must be made with Postman or a similar tool).

If you want to see something quick, here's a small example folder I made: https://bn-folder-builder.fly.dev/view-folder/6474c771e9b6d7089aeefa7d

## Current Features

- [x] Create and modify folders, which are tied to an account
- [x] Security with JWT, e-mail verification, safe headers, and data validation
- [x] View and download (as JSON) folders without an account
- [x] NoSQL database usage and online deployment
- [x] Code testing (Partially implemented)

## Future Features

- [ ] Implement code testing for more methods
- [ ] Add more chips to the database and make it publicly available
- [ ] Restrict deck building based on the in-game rules

## Stack

- JavaScript
- NodeJS (npm + express)
- Mongoose
- Mocha + Chai + Sinon

---

![Mega Man and Lan from the Battle Network series.](https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1798010/66d1d6a100b150cca49ab353b8d18b1e1e000a54.jpg)
<sup> Art from the game Mega Man Battle Network Legacy Collection, by Capcom </sup>
