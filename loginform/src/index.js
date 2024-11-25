const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const { User } = require('./mongo');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to register user' });
    }
});
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const user = await User.findOne({ username });

        if (!user) return res.status(401).send({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(401).send({ error: 'Invalid credentials' });
         const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({ error: 'Login failed' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
