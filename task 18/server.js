const express = require("express")
const jwt = require("jsonwebtoken")
const mysql = require("mysql2")

const app = express()
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rk1108",
    database: "products_db"
})

db.connect()

const auth = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return res.send("Access denied")
    try {
        jwt.verify(token.split(" ")[1], "secretkey")
        next()
    } catch {
        res.send("Invalid token")
    }
}

app.post("/login", (req, res) => {
    const token = jwt.sign({ user: "admin" }, "secretkey")
    res.json({ token })
})

app.post("/products", auth, (req, res) => {
    const { name, description, price, category } = req.body
    db.query(
        "INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)",
        [name, description, price, category],
        (err, result) => {
            res.json(result)
        }
    )
})

app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        res.json(result)
    })
})

app.get("/products/:id", (req, res) => {
    db.query("SELECT * FROM products WHERE id=?", [req.params.id], (err, result) => {
        res.json(result)
    })
})

app.put("/products/:id", auth, (req, res) => {
    const { name, description, price, category } = req.body
    db.query(
        "UPDATE products SET name=?, description=?, price=?, category=? WHERE id=?",
        [name, description, price, category, req.params.id],
        (err, result) => {
            res.json(result)
        }
    )
})

app.delete("/products/:id", auth, (req, res) => {
    db.query("DELETE FROM products WHERE id=?", [req.params.id], (err, result) => {
        res.json({ message: "Deleted" })
    })
})

app.listen(3000)