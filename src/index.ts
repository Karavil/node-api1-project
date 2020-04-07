import express from "express";
import http from "http-status-codes";

// Create a new express app instance
const app: express.Application = express();
const SERVER_PORT: number = 5000;
app.use(express.json());

// The structure of a user object
interface User {
   id: number;
   name: string;
   bio: string;
}

let id: number = 0;
let users: Array<User> = [];

app.get("/api/users", (req, res) => {
   if (users.length > 0) {
      res.status(200).json({ users });
   }
   res.status(http.INTERNAL_SERVER_ERROR).json({
      errorMessage:
         "Users are not yet populated. Please add users before making a GET request.",
   });
});

app.post("/api/users", (req, res) => {
   //Create new user object from the request body and assign an id
   const newUser: User = { id: id++, name: req.body.name, bio: req.body.bio };
   users.push(newUser);

   //Log to server console
   console.log("New user added", newUser);

   res.status(http.CREATED).json({
      message: "New user added, returning updated list of users.",
      users: users,
   });
});

app.delete("/api/users/:id", (req, res) => {
   const searchID: number = parseInt(req.params.id);
   users = users.filter((user) => user.id !== searchID);
   res.json({ users: users });
});

app.patch("/api/users/:id", (req, res) => {
   const searchID: number = parseInt(req.params.id);
   users = users.map((user) => {
      if (user.id === searchID) {
         return {
            ...user,
            ...req.body,
         };
      }
      return user;
   });
   res.status(http.OK).json({ users: users });
});

app.get("/api/users/:id", (req, res) => {
   const searchID: number = parseInt(req.params.id);
   const user = users.find((user) => user.id === searchID);

   if (user) res.status(http.OK).json({ user: user });
   res.status(http.NOT_FOUND).json({
      errorMessage: "User not found.",
   });
});

app.listen(SERVER_PORT, () => {
   console.log("App is listening on port", SERVER_PORT);
});
