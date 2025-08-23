/**
 * ONEIROBOT/GITHUB GENE 9000 - Web Server
 * Web interface for the autonomous trading swarm system
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { OneiroGene9000System } = require('./gene9000');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Global Gene 9000 system instance
let gene9000System = null;
const logs = [];
const maxLogs = 100;

// Capture console logs for web interface
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

function addLog(level, message) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        id: Date.now() + Math.random()
    };
    
    logs.push(logEntry);
    if (logs.length > maxLogs) {
        logs.shift(); // Remove oldest log
    }
    
    // Emit to all connected clients
    io.emit('log', logEntry);
}

console.log = (...args) => {
    const message = args.join(' ');
    addLog('info', message);
    originalConsoleLog(...args);
};

console.error = (...args) => {
    const message = args.join(' ');
    addLog('error', message);
    originalConsoleError(...args);
};

console.warn = (...args) => {
    const message = args.join(' ');
    addLog('warn', message);
    originalConsoleWarn(...args);
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/status', (req, res) => {
    if (!gene9000System) {
        return res.json({
            status: 'NOT_INITIALIZED',
            message: 'Gene 9000 system not started'
        });
    }
    
    res.json(gene9000System.getSystemInfo());
});

app.get('/api/logs', (req, res) => {
    res.json({
        logs: logs.slice(-50), // Return last 50 logs
        total: logs.length
    });
});

app.post('/api/start', async (req, res) => {
    try {
        if (gene9000System && gene9000System.getSystemInfo().status !== 'OFFLINE') {
            return res.json({
                success: false,
                message: 'System is already running'
            });
        }
        
        gene9000System = new OneiroGene9000System(req.body.config || {});
        await gene9000System.start();
        
        res.json({
            success: true,
            message: 'Gene 9000 system started successfully',
            status: gene9000System.getSystemInfo()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to start system',
            error: error.message
        });
    }
});

app.post('/api/stop', async (req, res) => {
    try {
        if (!gene9000System) {
            return res.json({
                success: false,
                message: 'System is not running'
            });
        }
        
        await gene9000System.stop();
        
        res.json({
            success: true,
            message: 'Gene 9000 system stopped successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to stop system',
            error: error.message
        });
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🌐 Web client connected');
    
    // Send recent logs to new client
    socket.emit('logs', logs.slice(-20));
    
    // Send current system status
    if (gene9000System) {
        socket.emit('status', gene9000System.getSystemInfo());
    }
    
    socket.on('disconnect', () => {
        console.log('🌐 Web client disconnected');
    });
    
    socket.on('requestStatus', () => {
        if (gene9000System) {
            socket.emit('status', gene9000System.getSystemInfo());
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 GENE 9000 Web Interface running on port ${PORT}`);
    console.log(`🔗 Access the web interface at: http://localhost:${PORT}`);
    console.log(`🚀 Ready to launch autonomous trading operations!`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down web server...');
    
    if (gene9000System) {
        await gene9000System.stop();
    }
    
    server.close(() => {
        console.log('✅ Web server shutdown complete');
        process.exit(0);
    });
});

module.exports = { app, server, io };