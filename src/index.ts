import express from "express";
import http from "http-status-codes";

// Create a new express app instance
const app: express.Application = express();
const SERVER_PORT: number = 5000;
app.use(express.json());

// The structure of a user object
interface User {
   name: string;
   bio: string;
}

let id: number = 0;
let users: Map<number, User> = new Map<number, User>();

app.get("/api/users", (req, res) => {
   if (users.size > 0) {
      res.status(200).json({ users });
   }
   res.status(http.INTERNAL_SERVER_ERROR).json({
      errorMessage:
         "Users are not yet populated. Please add users before making a GET request.",
   });
});

app.post("/api/users", (req, res) => {
   //Create new user object from the request body and assign an id
   let newUser: User = { name: req.body.name, bio: req.body.bio };
   users.set(id++, newUser);
   console.log(users);

   //Log to server console
   console.log("New user added", newUser);

   //Return updated list with a successful post request
   const userList: Array<any> = [];
   users.forEach((value, key) => {
      userList.push({
         ...value,
         id: key,
      });
   });

   res.status(http.CREATED).json({
      message: "New user added, returning updated list of users.",
      users: userList,
   });
});

app.listen(SERVER_PORT, () => {
   console.log("App is listening on port", SERVER_PORT);
});
