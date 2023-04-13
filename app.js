/*
 * Title : TodoList MEN
 * Author : Kean Duque
 * Description : Todo App MEN
 */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const date = require(__dirname + "/public/js/date.js");
const { connectToDB } = require(__dirname + "/public/db.js");
const { Todo, todoSchema, Page, pageSchema } = require("./models/todo");

// init app & middleware
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set("strictQuery", false);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// connect db
connectToDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Listening on PORT ${PORT}`);
		});
	})
	.catch((err) => console.log(err));

const defaultTodos = [
	{ name: "Welcome to my TodoList!" },
	{ name: "Press the (+) button to add new Todo" },
	{ name: "Press Checkbox to Delete Todo" },
];

app.get("/", async (req, res) => {
	const day = date.getDate();

	await Todo.find({}).then((items) => {
		if (items.length === 0) {
			InsertTodoMany(defaultTodos);
			res.redirect("/");
		} else {
			Page.find({}).then((pages) => {
				res.render("list", {
					listTitle: day,
					newListItem: items,
					navigation: pages,
				});
			});
		}
	});
});

app.get("/:TodoPage", async (req, res) => {
	const todoTitle = _.capitalize(req.params.TodoPage);

	await Page.findOne({ name: todoTitle })
		.then((page) => {
			if (!page) {
				console.log("Page Not Exist, preparing to add..");
				const page = new Page({
					name: todoTitle,
					todos: defaultTodos,
				})
					.save()
					.then(() => console.log("New Page Succesfully Added!"))
					.catch((err) => console.log(err));

				res.redirect(`/${todoTitle}`);
			} else {
				Page.find({}).then((pages) => {
					console.log(`${page.name} Page Exist`);

					res.render("page", {
						pageTitle: page.name,
						pageContentTodo: page.todos,
						navigation: pages,
					});
				});
			}
		})
		.catch((err) => console.log(err));
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.post("/", async (req, res) => {
	const itemName = req.body.todoItem;
	const day = date.getDate().split(" ")[0];
	const listTitle = req.body.list.split(" ")[0];

	const item = new Todo({
		name: itemName,
	});

	if (listTitle === day) {
		await item.save();
		console.log(item.name + " Successfully Added...");
		res.redirect("/");
	} else {
		await Page.findOne({ name: listTitle })
			.then((pageFound) => {
				pageFound.todos.push(item);
				pageFound.save();
				console.log(item.name + " Successfully Added...");
				res.redirect(`/${listTitle}`);
			})
			.catch((err) => console.log(err));
	}
});

app.post("/delete", async (req, res) => {
	const itemId = req.body.checkbox;
	const day = date.getDate().split(" ")[0];
	const pageName = req.body.pageTitle.split(" ")[0];

	if (pageName === day) {
		await DeleteTodo({ _id: itemId });
		res.redirect("/");
	} else {
		await Page.findOneAndUpdate(
			{ name: pageName },
			{ $pull: { todos: { _id: itemId } } }
		)
			.then((result) => {
				console.log("Successfully Deleted...");
				res.redirect(`/${pageName}`);
			})
			.catch((err) => console.log(err));
	}
});

async function InsertTodoMany(list) {
	await Todo.insertMany(list)
		.then(() => {
			console.log("datas successfully inserted...");
			mongoose.disconnect();
		})
		.catch((err) => console.log(err));
}
async function InsertTodo(list) {
	await Todo(list)
		.save()
		.then(() => console.log("New Todo Succesfully Added!"))
		.catch((err) => console.log(err));
}
async function DeleteTodo(list) {
	await Todo.findByIdAndRemove(list)
		.then(() => {
			console.log("Successfully Deleted");
		})
		.catch((err) => console.log(err));
}
