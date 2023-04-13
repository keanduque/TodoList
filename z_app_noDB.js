/*
 * Title : Blog Site MEN
 * Author : Kean Duque
 * Description : Blog App MEN
 */

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const _ = require("lodash");
const ejs = require("ejs");
const connectDB = require("./db");
const date = require("./libs/date");
const blog = require("./controllers/posts");
const Post = require("./models/Post").Post;

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set("strictQuery", false);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Connect to DB
connectDB()
	.then(() => {
		app.listen(PORT, function () {
			console.log(`Server started on port ${PORT}`);
		});
	})
	.catch((err) => console.log(err));

/* blog.insertPost({
	title: "Hello to kean Blog",
	author: "Kean Duque",
	date: date.getDate(),
	content:
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue imperdiet lacus quis malesuada. Vivamus est ex, feugiat ac blandit sed, facilisis eget neque. Nullam ut accumsan erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin elementum fringilla mauris, quis venenatis magna blandit nec. Nullam aliquam lorem vitae consectetur consectetur. In imperdiet efficitur dui. Morbi id venenatis ex, vitae consequat ligula. Aenean placerat blandit eros, vel commodo sem sagittis dapibus. In tincidunt, lorem sed mattis blandit, est augue lacinia ipsum, ut semper nibh magna ac augue. Ut a nisi non neque faucibus dignissim. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed id quam vel metus placerat aliquet.",
}); */

const homeStartingContent =
	"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
	"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
	"Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const posts = [];

app.get("/", (req, res) => {
	res.render("home", {
		homeContent: homeStartingContent,
		postedList: posts,
	});
});
app.get("/about", (req, res) => {
	res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", (req, res) => {
	res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
	res.render("compose");
});
app.post("/compose", async (req, res) => {
	const post_title = req.body.post_title;
	const post_author = req.body.post_author;
	const post_date = req.body.post_date;
	const post_content = req.body.post_content;

	const formatDate = new Date(post_date);
	const options = {
		month: "long",
		day: "numeric",
		year: "numeric",
	};

	const post = {
		title: _.capitalize(post_title),
		author: _.capitalize(post_author),
		dateCreated: formatDate.toLocaleDateString("en-US", options),
		content: post_content,
		titleURI: _.kebabCase(post_title),
	};

	posts.push(post);

	await Post.findOne({ title: post_title }).then((post) => {
		if (!post) {
			console.log("not exist");
		} else {
			console.log("existing");
		}
	});

	res.redirect("/");
});

app.get("/posts/:postTitle", (req, res) => {
	const postTitleParam = _.lowerCase(req.params.postTitle);

	posts.forEach((post) => {
		const postTitle = _.lowerCase(post.title);
		if (postTitle === postTitleParam) {
			res.render("post", {
				title: post.title,
				content: post.content,
			});
		}
	});
});

app.get("/posts", (req, res) => {
	res.render("posts", {
		postedList: posts,
	});
});
