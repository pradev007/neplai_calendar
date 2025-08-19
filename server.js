const express = require('express');
const webpush = require('web-push');
const app = express();
app.use(express.json());

// Set VAPID details
webpush.setVapidDetails(
    'pradipdevkota007@gmail.com', // Replace with your email
    'BOnFVmQVdrFQkSjjiAeL38URIkISYcCsyiUnPEd2zfZORiImrIYUqYhDjR1g-D1l7qLE9qIRVEEtzoDRdkN3MrI', // Replace with your public key
    'M7ujvMsHEGCLpWstJVHnT_8lgh6c__gGcmbDfOfu9Mk' // Replace with your private key
);

// Store subscriptions (use a database in production)
const subscriptions = [];

// Endpoint to save subscriptions
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({ success: true });
});

// Endpoint to send notifications
app.post('/send-notification', (req, res) => {
    const payload = {
        title: 'Nepali Calendar Update',
        body: 'Today is ' + formatNepaliDate(currentNepaliDate.year, currentNepaliDate.month, currentNepaliDate.day),
        url: 'https://yourwebsite.com'
    };
    Promise.all(
            subscriptions.map(sub =>
                webpush.sendNotification(sub, JSON.stringify(payload)).catch(err => console.error('Error sending to sub:', err))
            )
        )
        .then(() => res.status(200).json({ success: true }))
        .catch(err => {
            console.error('Error sending notifications:', err);
            res.status(500).json({ error: 'Failed to send notifications' });
        });
});

app.listen(3000, () => console.log('Server running on port 3000'));