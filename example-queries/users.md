mutation Login {
login(input: { email: "ash@gmail.com", password: "password" }) {
token
}
}

mutation CreateUser {
signup(
input: { name: "Ashley", email: "ash@gmail.com", password: "password" }
){
name
}
}
