const express = require("express");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;
const SECRET_KEY = "supersecret";

app.use(express.json());
app.use(cors());

const USERS_FILE = "users.json";


const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE));
};


const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};


app.post("/register", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    let users = readUsers();

    if (users.some((user) => user.email === email)) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), firstname, lastname, email, password: hashedPassword };
    
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: "User registered successfully" });
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    
    const user = users.find((user) => user.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
