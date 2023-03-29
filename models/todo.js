const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Insert Todo List!"],
	},
});
const Todo = mongoose.model("Todo", todoSchema);

const pageSchema = new mongoose.Schema({
	name: String,
	todos: [todoSchema],
});
const Page = mongoose.model("Page", pageSchema);

module.exports = { Todo, todoSchema, Page, pageSchema };
