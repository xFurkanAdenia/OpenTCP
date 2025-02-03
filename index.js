const ngrok = require("ngrok")

const fs = require("fs");
const path = require("path");

const app = require("express")();
ngrok.authtoken("2h6e4iiVj0qyScz8QybYIiX5fOZ_43g1iYeyAGhxsgwenA8at")
app.set("view engine", "ejs")

const adminKey = "ALcqnNG2YV78cML"

if (!fs.existsSync("users.json")) fs.writeFileSync("users.json", "{}")

let active = false;

let tcpUrl;

function userCheck(req, res, next) {
    const username = req.query.username
    const password = req.query.password



    const users = JSON.parse(fs.readFileSync("users.json", { encoding: "utf-8" }))

    if (users[username]) {
        if (users[username]["password"] != password) return res.render("incorrectpass")
        next()
    } else {
        res.render("accNotFound", {
            username
        })
    }
}

app.get("/images/:path", (req, res) => {
    return res.sendFile(path.join("assets", req.params.path), {root: __dirname})
})

app.get("/acc/create", userCheck, (req, res) => {

})

app.get("/tcp/get", userCheck, async (req, res) => {
    if (active) await ngrok.kill()
    ngrok.connect({
        proto: "tcp",
        addr: 3389
    }).then((val) => {
        res.render("success", {
            tcp: val
        }); active = true
    }).catch((err) => {
        res.send(err.toString())
    })

})

app.listen(3000, () => {
    console.log("Aktif 3000")
})