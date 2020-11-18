mutation CreateTask {
createTask(input: { name: "Task 15", completed: false }) {
id
name
completed
}
}

query GetAllTasks {
tasks(limit: 5) {
taskFeed {
id
name
}
pageInfo {
nextPageCursor
hasNextPage
}
}
}

query GetTaskById {
task(id: "5f86dbafd5fffc27c7c770da") {
name
completed
user {
name
email
}
}
}

mutation DeleteTask {
deleteTask(id: "5f86f290f951fb2c0721ea23") {
name
completed
id
}
}

mutation UpdateTask {
updateTask(
id: "5f86dbafd5fffc27c7c770da"
input: { completed: true, name: "Shopping For Kicks" }
) {
id
name
completed
}
}
