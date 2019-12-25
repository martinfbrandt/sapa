const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const initialize = require("./dao/initialize");
const {
  createUser,
  deleteUser,
  loginUser,
  patchUser,
  getUsers,
  retrieveUser
} = require("./controllers/userController");
const { authValidation, hasRole } = require("./controllers/middleware");
const { validateExperience } = require('./validation/experiences');
const { validateUserCreate, validateUserRoles, validateUserUpdate } = require('./validation/users');

const {
  getExperiences,
  deleteExperience,
  createExperience,
  retrieveExperience,
  patchExperience,

} = require("./controllers/experienceController");

const {
  postCalendar,
  postDefaultCalendarExperience,
  findCalendarExperienceById,
  deleteDefaultCalendarExperience,
  findDefaultCalendarExperiences
} = require('./controllers/calendarController')

const {
  addCalendarExperience
} = require('./dao/controllers/calendarDao');

const {
  createWishlists,
  updateWishlists,
  getAllWishlists,
  deleteWishlists,
  addWishlistExperience,
  removeWishlistExperience,
  getAllUserWishlists,
  getAllWishlistExperiences,
  getWishlistById,
  getWishlistExperienceById
} = require("./controllers/wishlistController");
const https = require("https");
const fs = require("fs");
const { pathOr, assoc } = require("ramda");

var privateKey = fs.readFileSync(
  "/users/martinbrandt/certs/server.key",
  "utf8"
);
var certificate = fs.readFileSync(
  "/users/martinbrandt/certs/server.cert",
  "utf8"
);

var credentials = { key: privateKey, cert: certificate };

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Authorization, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "POST, PATCH, OPTIONS, DELETE, GET")
  next();
});

app.post("/api/login", (req, res) => {
  loginUser(req.body, res);
});

app.post("/api/initialize", async (req, res) => {
  initialize();
  res.send({ initialized: "true" });
});

// route middleware to decode JWT

app.get("/api", (req, res) => res.send("Server is available"));

//user services

// signup API, unauthenticated
app.post("/api/signup", validateUserCreate, async (req, res) => {
  const userWithRole = assoc('roles', ["user"], req.body)
  createUser(userWithRole, res);
});

app.post("/api/users",
  authValidation,
  hasRole(["user-manager", "admin"]),
  validateUserCreate,
  validateUserRoles,
  async (req, res) => createUser(req.body, res))

app.get(
  "/api/users/:id",
  authValidation,
  hasRole(["user-manager", "admin"]),
  (req, res) => {
    retrieveUser(req.params.id, res);
  }
);

app.get("/api/users", authValidation, hasRole(["user-manager", "admin"]), (req, res) => {
  getUsers(res);
});

app.patch(
  "/api/users/:id",
  authValidation,
  hasRole(["user-manager", "admin"]),
  validateUserUpdate,
  (req, res) => {
    patchUser(req.params.id, req.body, res);
  }
);

app.delete(
  "/api/users/:id",
  authValidation,
  hasRole(["user-manager", "admin"]),
  (req, res) => {
    deleteUser(req.params.id, res);
  }
);

//experience services
app.post("/api/experiences", authValidation, hasRole(["user", "admin"]), validateExperience, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  createExperience(userId, req.body, res);
});

app.get("/api/experiences/:id", authValidation, hasRole(["user", "admin"]), (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  retrieveExperience(userId, req.params.id, res);
});

app.get("/api/experiences", authValidation, hasRole(["user", "admin"]), (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  getExperiences(userId, res);
});

app.patch("/api/experiences/:id", authValidation, hasRole(["user", "admin"]), validateExperience, (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  patchExperience(userId, req.params.id, req.body, res);
});

app.delete("/api/experiences/:id", authValidation, hasRole(["user", "admin"]), (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  deleteExperience(userId, req.params.id, res);
});


// wishlist services 
app.post("/api/wishlists", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  createWishlists(userId, req.body, res);
});

app.patch("/api/wishlists/:id", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  updateWishlists(userId, req.params.id, req.body, res);
});

app.delete("/api/wishlists/:id", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  deleteWishlists(userId, req.params.id, res);
});

app.get("/api/wishlists", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  hasRole(["user", "admin"]) ? getAllWishlists(res) : getAllUserWishlists(userId, res);
});

app.get("/api/wishlists/:wishlistId", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  const {wishlistId} = req.params;
  getWishlistById(userId, wishlistId, res);
});

// wishlist experience services
app.post("/api/wishlists/:wishlistId/experiences/:experienceId", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  const { wishlistId, experienceId } = req.params;
  addWishlistExperience(userId, wishlistId, experienceId, res);
});

app.get("/api/wishlists/:wishlistId/experiences", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  const { wishlistId } = req.params;
  getAllWishlistExperiences(wishlistId, userId, res);
})

app.get("/api/wishlists/:wishlistId/experiences/:experienceId", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  const { wishlistId, experienceId } = req.params;
  getWishlistExperienceById(wishlistId, experienceId, userId, res);
})

app.delete("/api/wishlists/:wishlistId/experiences/:experienceId", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  const { wishlistId, experienceId } = req.params;
  removeWishlistExperience(userId, wishlistId, experienceId, res);
});

// calendar experience services
app.post("/api/calendar/experiences/:experienceId", authValidation, validateExperience, postDefaultCalendarExperience);


// calendar experience services
app.get("/api/calendar/experiences/:experienceId", authValidation, findCalendarExperienceById);


app.post("/api/calendars/:calendarId/experiences/:experienceId", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  const { calendarId, experienceId } = req.params;

  addCalendarExperience(userId, calendarId, experienceId, req.body, res);
});

app.get("/api/calendar/experiences", authValidation, findDefaultCalendarExperiences);

app.delete("/api/calendar/experiences/:experienceId", authValidation, deleteDefaultCalendarExperience);

app.delete("/api/calendars/:calendarId/experiences/:experienceId", authValidation, async (req, res) => {
  const userId = pathOr(0, ["decoded", "data", "id"], req);
  const { calendarId, experienceId } = req.params;

  removeCalendarExperience(userId, calendarId, experienceId, res);
});


https
  .createServer(credentials, app)
  .listen(3443, () => console.log("listening on ssl"));

app.listen(port, () => console.log(`listening on port ${port}`));
