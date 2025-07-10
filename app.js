const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = 3001;

// Variable to store client and connection status
let client = null;
let isConnected = false;
let groups = [];

// --- Modern HTML and CSS Template ---
const modernHtmlTemplate = (title, bodyContent) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #121212;
                color: #e0e0e0;
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                min-height: 100vh;
            }
            .container {
                width: 100%;
                max-width: 900px;
                background-color: #1e1e1e;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                padding: 30px;
            }
            h1 {
                color: #ffffff;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
                margin-top: 0;
            }
            p {
                line-height: 1.6;
            }
            .status-card {
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
            }
            .status-connected {
                background-color: #28a745;
                color: #ffffff;
            }
            .status-disconnected {
                background-color: #dc3545;
                color: #ffffff;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid #333;
            }
            th {
                background-color: #333;
                color: #ffffff;
            }
            tr:hover {
                background-color: #2c2c2c;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 15px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s;
            }
            .btn:hover {
                background-color: #0056b3;
            }
            .btn-secondary {
                background-color: #6c757d;
            }
            .btn-secondary:hover {
                background-color: #5a6268;
            }
            .actions {
                margin-top: 25px;
                display: flex;
                gap: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            ${bodyContent}
        </div>
    </body>
    </html>
`;

// Initialize WhatsApp client
async function initWhatsApp() {
    try {
        console.log('Starting WhatsApp Web...');
        client = new Client({
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ],
            }
        });

        client.on('qr', (qr) => {
            console.log('\n=== SCAN THIS QR CODE WITH YOUR WHATSAPP ===\n');
            qrcode.generate(qr, { small: true });
            console.log('\n==========================================\n');
        });

        client.on('ready', async () => {
            console.log('✅ WhatsApp connected successfully!');
            isConnected = true;
            await loadGroups();
        });

        client.on('disconnected', (reason) => {
            console.log('❌ WhatsApp disconnected:', reason);
            isConnected = false;
            groups = [];
        });

        await client.initialize();

    } catch (error) {
        console.error('❌ Error initializing WhatsApp:', error);
        isConnected = false;
    }
}

// Function to get the list of groups
async function loadGroups() {
    try {
        if (!client || !isConnected) {
            console.log('Client not available or not connected');
            return;
        }

        console.log('Fetching group list...');
        const chats = await client.getChats();
        
        groups = chats.filter(chat => chat.isGroup).map(group => ({
            id: group.id._serialized,
            name: group.name || 'Group Without Name',
            participantsCount: group.participants.length
        }));

        console.log(`✅ Successfully loaded ${groups.length} groups`);
        
    } catch (error) {
        console.error('❌ Error fetching group list:', error);
        groups = [];
    }
}

// Route for the main page
app.get('/', (req, res) => {
    const statusClass = isConnected ? 'status-connected' : 'status-disconnected';
    const statusText = isConnected ? '✅ Connected' : '❌ Not Connected';

    const bodyContent = `
        <h1>WhatsApp Group Viewer</h1>
        <p>An application to view your WhatsApp group list with a modern interface.</p>
        <div class="status-card ${statusClass}">${statusText}</div>
        <p>${!isConnected ? 'If not connected, please scan the QR code that appears in your terminal.' : 'You can now view your group list.'}</p>
        <a href="/grup" class="btn">View Group List</a>
    `;
    
    res.send(modernHtmlTemplate('WhatsApp Group Viewer', bodyContent));
});

// Route to display the group list
app.get('/grup', async (req, res) => {
    if (!isConnected) {
        const bodyContent = `
            <h1>WhatsApp Group List</h1>
            <div class="status-card status-disconnected">❌ WhatsApp is not connected.</div>
            <p>Please scan the QR code in the terminal first.</p>
            <div class="actions">
                <a href="/" class="btn btn-secondary">Back to Home</a>
            </div>
        `;
        return res.send(modernHtmlTemplate('Error', bodyContent));
    }

    await loadGroups();

    let groupsTable = '';
    if (groups.length === 0) {
        groupsTable = '<p>No groups found or failed to load groups.</p>';
    } else {
        groupsTable = '<table>';
        groupsTable += '<tr><th>No</th><th>Group Name</th><th>Group ID</th><th>Members</th></tr>';
        
        groups.forEach((group, index) => {
            groupsTable += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${group.name}</td>
                    <td>${group.id}</td>
                    <td>${group.participantsCount}</td>
                </tr>
            `;
        });
        
        groupsTable += '</table>';
    }

    const bodyContent = `
        <h1>WhatsApp Group List</h1>
        <p>Total groups: ${groups.length}</p>
        ${groupsTable}
        <div class="actions">
            <a href="/" class="btn btn-secondary">Back to Home</a>
            <a href="/grup" class="btn">Refresh List</a>
        </div>
    `;

    res.send(modernHtmlTemplate('WhatsApp Group List', bodyContent));
});

// Start Express server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📱 Access the group list at http://localhost:${PORT}/grup`);
    console.log('');
    
    initWhatsApp();
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down application...');
    if (client) {
        await client.destroy();
    }
    process.exit(0);
});
