require("dotenv").config();
const mongoose = require("mongoose");
//const uri = "mongodb://localhost:27017/todoListDB";
module.exports = {
	connectToDB: async () => {
		await mongoose
			.connect(process.env.MONGO_URI)
			.then((conn) => {
				console.log(
					`Successfully Connected to ${conn.connections[0].host}`
				);
			})
			.catch((err) => {
				console.log(err);
				process.exit(1);
			});
	},
};
