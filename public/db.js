const mongoose = require("mongoose");
//const uri = "mongodb://localhost:27017/todoListDB";
const uri =
	"mongodb+srv://vizen27:test123@cluster0.hsfxug2.mongodb.net/todoListDB?retryWrites=true&w=majority";

module.exports = {
	connectToDB: (cb) => {
		mongoose
			.connect(uri)
			.then(() => {
				console.log("Successfully connected to DB!");
				return cb();
			})
			.catch((err) => {
				console.log(err);
				return cb(err);
			});
	},
};
