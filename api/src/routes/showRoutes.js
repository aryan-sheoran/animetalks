const  express = require("express");
const { getAllShows, getShowById } = require("../controllers/ShowController.js");

const router = express.Router();

router.get("/", getAllShows);
router.get("/:id", getShowById);

module.exports = router;