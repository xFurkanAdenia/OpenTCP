const ngrok = require("ngrok")

const fs = require("fs");
const path = require("path");

const app = require("express")();
ngrok.authtoken("YOUR-NGROK-TOKEN")
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
        if (users[username]["password"] != password) return res.render("error",{ reason: "Hatalı Şifre!" })
        next()
    } else {
        res.render("error",{ reason: username + " adında bir kullanıcı bulunamadı!" })
    }
}

app.get("/images/:path", (req, res) => {
    return res.sendFile(path.join("assets", req.params.path), {root: process.cwd()})
})


app.get("/tcp/get", userCheck, async (req, res) => {
    if (active) await ngrok.disconnect(tcpUrl)
    ngrok.connect({
        proto: "tcp",
        addr: 3389
    }).then((val) => {
        res.render("success", {
            tcp: val.substring(6, val.length),
            rdpUsername: "furka"
        }); active = true; tcpUrl = val
    }).catch((err) => {
        res.send(err.toString())
    })

})


app.listen(3000, () => {
    console.log("Aktif 3000")
    ngrok.connect({
        proto: "http",
        hostname: "noted-fast-mallard.ngrok-free.app",
        addr:3000
    })
})