"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_status_codes_1 = __importDefault(require("http-status-codes"));
// Create a new express app instance
var app = express_1.default();
var SERVER_PORT = 5000;
app.use(express_1.default.json());
var id = 0;
var users = [];
app.get("/api/users", function (req, res) {
    if (users.length > 0) {
        res.status(200).json({ users: users });
    }
    res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
        errorMessage: "Users are not yet populated. Please add users before making a GET request.",
    });
});
app.post("/api/users", function (req, res) {
    //Create new user object from the request body and assign an id
    var newUser = { id: id++, name: req.body.name, bio: req.body.bio };
    users.push(newUser);
    //Log to server console
    console.log("New user added", newUser);
    res.status(http_status_codes_1.default.CREATED).json({
        message: "New user added, returning updated list of users.",
        users: users,
    });
});
app.delete("/api/users/:id", function (req, res) {
    var searchID = parseInt(req.params.id);
    users = users.filter(function (user) { return user.id !== searchID; });
    res.json({ users: users });
});
app.patch("/api/users/:id", function (req, res) {
    var searchID = parseInt(req.params.id);
    users = users.map(function (user) {
        if (user.id === searchID) {
            return __assign(__assign({}, user), req.body);
        }
        return user;
    });
    res.status(http_status_codes_1.default.OK).json({ users: users });
});
app.get("/api/users/:id", function (req, res) {
    var searchID = parseInt(req.params.id);
    var user = users.find(function (user) { return user.id === searchID; });
    if (user)
        res.status(http_status_codes_1.default.OK).json({ user: user });
    res.status(http_status_codes_1.default.NOT_FOUND).json({
        errorMessage: "User not found.",
    });
});
app.listen(SERVER_PORT, function () {
    console.log("App is listening on port", SERVER_PORT);
});
