const Router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validator = require('validator');

const User = require('../models/User.model');

Router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if(!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if(!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email provided' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if(existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

Router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }   

        if(!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email provided' });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

Router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        
        const token = authHeader.split(' ')[1]; 
        if(!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        if(jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

Router.delete('/me/delete', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        
        const token = authHeader.split(' ')[1]; 
        if(!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        if(jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await User.findByIdAndDelete(decoded.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = Router;