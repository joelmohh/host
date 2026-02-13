const Router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Applications = require('../models/Applications.model');
const { removeAllListeners } = require('../models/User.model');

Router.get('/', async (req, res) => {
    try {
        
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        
        if(jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        const applications = await Applications.find({ ownerId: decoded.id });

        if(!applications) {
            return res.status(404).json({ message: 'No applications found', length: 0, success: true });
        }
        
        res.status(200).json(applications);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

Router.get('/:id', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        
        if(jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const application = await Applications.findOne({ _id: req.params.id, ownerId: decoded.id });

        if(!application) {
            return res.status(404).json({ message: 'Application not found', success: false });
        }

        res.status(200).json({
            status: "success",
            result: {
                name: application.name,
                id: application._id,
                ownerId: application.ownerId,
                ram: application.ram,
                lang: application.lang,
                domain: application.domain,
                customDomain: application.customDomain,
                createdAt: application.createdAt,
                updatedAt: application.updatedAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

Router.get('/:id/status', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        
        if(jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        const application = await Applications.findOne({ _id: req.params.id, ownerId: decoded.id });

        if(!application) {
            return res.status(404).json({ message: 'Application not found', success: false });
        }

        res.status(200).json({
            status: "success",
            result: {
                cpu: application.cpu,
                ram: application.ram,
                status: application.status,
                storage: application.storage,
                network: application.network,
                uptime: application.uptime
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

Router.get('/:id/logs', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        
        if(jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        const application = await Applications.findOne({ _id: req.params.id, ownerId: decoded.id });

        if(!application) {
            return res.status(404).json({ message: 'Application not found', success: false });
        }

        res.status(200).json({
            status: "success",
            result: application.logs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

/*
    APLICATION CONTROL (START, STOP, RESTART, ETC)
*/

Router.get('/:id/start', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        
        if(jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        const application = await Applications.findOne({ _id: req.params.id, ownerId: decoded.id });

        if(!application) {
            return res.status(404).json({ message: 'Application not found', success: false });
        }

        application.status = "running";
        await application.save();

        res.status(200).json({
            status: "success",
            message: "Application started successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

Router.get('/:id/stop', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        
        if(jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        const application = await Applications.findOne({ _id: req.params.id, ownerId: decoded.id });

        if(!application) {
            return res.status(404).json({ message: 'Application not found', success: false });
        }

        application.status = "stopped";
        await application.save();
        
        res.status(200).json({
            status: "success",
            message: "Application stopped successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})
Router.get('/:id/restart', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        
        if(jwt.verify(token, process.env.JWT_SECRET)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        const application = await Applications.findOne({ _id: req.params.id, ownerId: decoded.id });

        if(!application) {
            return res.status(404).json({ message: 'Application not found', success: false });
        }

        application.status = "restarting";
        await application.save();

        setTimeout(async () => {
            application.status = "running";
            await application.save();
        }, 5000);

        res.status(200).json({
            status: "success",
            message: "Application restarting successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})


module.exports = Router;