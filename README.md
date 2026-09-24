# To Do List App

A simple, accessible To Do List app built with HTML, CSS, and Vanilla JavaScript.

The app allows users to create, complete, delete, filter, and clear to do items. To do list data is saved to the browser's localStorage so the list items remain available when the page is revisited/reopened/reloaded.

## Features

- Add new list items
- Validate input
- Mark as completed
- Delete individual list items
- Filter list items by:
  - All
  - Active
  - Completed
- Clear all completed list items
- Display the number of remaining and total list items
- Remember list items using localStorage
- Responsive layout
- Keyboard accessible
- Screen reader-friendly
- Visible keyboard focus

## Tech Stack

- HTML5
- CSS3
- JavaScript
- DOM API
- Browser localStorage

## How It Works

To do list items are stored as JavaScript objects in an array:

```js
{
  id: Date.now().toString(),
  text: "Example to do list item",
  completed: false,
  createdAt: new Date().toISOString()
}# to-do-list
```
[**Run the To Do List App**](https://queenrania.github.io/to-do-list-vanilla-javascript/)

