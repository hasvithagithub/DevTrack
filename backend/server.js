require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const GITEA_URL = process.env.GITEA_URL || 'http://localhost:3000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- GITEA PROXY & AUTHENTICATION ---

// In a real app, this would use Gitea's OAuth endpoint.
// For this setup, we'll accept a token from the frontend and verify it, 
// or proxy requests to Gitea directly.
app.post('/api/auth/login', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Verify the token by fetching user info from Gitea
    const response = await axios.get(`${GITEA_URL}/api/v1/user`, {
      headers: { Authorization: `token ${token}` }
    });

    // If successful, set a cookie and return user
    res.cookie('gitea_token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({ user: response.data });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ error: 'Invalid token or Gitea server unreachable' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('gitea_token');
  res.json({ message: 'Logged out successfully' });
});

// Generic proxy middleware for Gitea API
app.use('/api/gitea', async (req, res) => {
  const token = req.cookies.gitea_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const url = `${GITEA_URL}/api/v1${req.path}`;
    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      params: req.query,
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Gitea Proxy Error on path:', req.path);
    if (error.response) {
      console.error('Gitea returned status:', error.response.status);
      console.error('Gitea returned data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { error: 'Internal Server Error' };
    res.status(status).json(data);
  }
});

// --- CUSTOM DEVTRACK FEATURES ---

// Attendance Logs
app.get('/api/attendance', (req, res) => {
  db.all('SELECT * FROM attendance_logs ORDER BY timestamp DESC LIMIT 50', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/attendance', (req, res) => {
  const { username, type } = req.body; // type should be 'check-in' or 'check-out'
  if (!username || !type) {
    return res.status(400).json({ error: 'Username and type are required' });
  }

  db.run(`INSERT INTO attendance_logs (username, type) VALUES (?, ?)`, [username, type], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, username, type, message: `Successfully logged ${type}` });
  });
});

// Developers extended info
app.get('/api/developers', (req, res) => {
  db.all('SELECT * FROM developers', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


app.listen(PORT, () => {
  console.log(`DevTrack custom backend running on port ${PORT}`);
  console.log(`Proxying Gitea requests to: ${GITEA_URL}`);
});
