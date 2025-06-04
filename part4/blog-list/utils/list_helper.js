const countBy = require("lodash/countBy");
const sumBy = require("lodash/sumBy");
const groupBy = require("lodash/groupBy");
const mapValues = require("lodash/mapValues");
const toPairs = require("lodash/toPairs");
const maxBy = require("lodash/maxBy");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (listOfPosts) => {
  return listOfPosts.reduce((acc, post) => (acc += post.likes), 0);
};

const favouriteBlog = (listOfBlogs) => {
  if (listOfBlogs.length === 0) return null;

  return listOfBlogs.reduce((favourite, curr) =>
    curr.likes > favourite.likes ? curr : favourite
  );
};

const mostLikes = (listOfBlogs) => {
  if (listOfBlogs.length === 0) return null;

  const grouped = groupBy(listOfBlogs, "author");
  const totalLikesByAuthor = mapValues(grouped, (authorPosts) =>
    sumBy(authorPosts, "likes")
  );
  const pairs = toPairs(totalLikesByAuthor);
  const maxCount = maxBy(pairs, (pair) => pair[1]);

  return { author: maxCount[0], likes: maxCount[1] };
};

const mostBlogs = (listOfBlogs) => {
  if (listOfBlogs.length === 0) return null;

  const counted = countBy(listOfBlogs, "author");
  const pairs = toPairs(counted);
  const maxCount = maxBy(pairs, (pair) => pair[1]);
  return { author: maxCount[0], blogs: maxCount[1] };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
