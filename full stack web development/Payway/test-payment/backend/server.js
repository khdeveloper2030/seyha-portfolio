const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(cors());
app.use(express.json());

// ព័ត៌មានដែលបងផ្ដល់ឱ្យ
const MERCHANT_ID = 'ec460188';
const API_KEY = '1b1d4aa23b9b4a0a21451805b41f514d1902d1f6';
const PURCHASE_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
const CHECK_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/check-transaction';

// កន្លែងរក្សាទុកបញ្ជីឈ្មោះអ្នកបង់លុយរួចសម្រាប់ Admin
let paidUsers = [];

// 1. API បង្កើត QR Code (ទាញយក qrString ពី ABA)
app.post('/api/create-qr', async (req, res) => {
    try {
        const { req_time, tran_id, amount, firstname, lastname, email, phone } = req.body;

        // បង្កើត Hash តាមច្បាប់ ABA (លំដាប់នេះត្រូវតែត្រឹមត្រូវ ១០០%)
        const rawString = req_time + MERCHANT_ID + tran_id + amount + firstname + lastname + email + phone + 'purchase' + 'abapay';
        const hash = crypto.createHmac('sha512', API_KEY).update(rawString).digest('base64');

        const body = new FormData();
        body.append('merchant_id', MERCHANT_ID);
        body.append('req_time', req_time);
        body.append('tran_id', tran_id);
        body.append('amount', amount);
        body.append('firstname', firstname);
        body.append('lastname', lastname);
        body.append('email', email);
        body.append('phone', phone);
        body.append('type', 'purchase');
        body.append('payment_option', 'abapay');
        body.append('hash', hash);

        // ហៅទៅ ABA ដោយបង្ខំយក JSON (ដាក់ Header Accept: application/json)
        const response = await axios.post(PURCHASE_URL, body, {
            headers: { 
                ...body.getHeaders(),
                'Accept': 'application/json' 
            }
        });

        // បញ្ជូន JSON ដែលមាន qrString ទៅឱ្យ Frontend
        console.log("ABA Response:", response.data);
        res.json(response.data);

    } catch (error) {
        console.error("Error connecting to ABA:", error.message);
        res.status(500).json({ status: 1, description: "Backend connection error" });
    }
});

// 2. API ឆែកស្ថានភាពបង់ប្រាក់
app.post('/api/check-status', async (req, res) => {
    try {
        const { req_time, tran_id, customer_name } = req.body;
        const rawString = req_time + MERCHANT_ID + tran_id;
        const hash = crypto.createHmac('sha512', API_KEY).update(rawString).digest('base64');

        const body = new FormData();
        body.append('merchant_id', MERCHANT_ID);
        body.append('req_time', req_time);
        body.append('tran_id', tran_id);
        body.append('hash', hash);

        const response = await axios.post(CHECK_URL, body, { headers: body.getHeaders() });

        if (response.data.status === 0) {
            // បើបង់ជោគជ័យ ថែមចូលក្នុងបញ្ជី Admin
            const exists = paidUsers.find(u => u.tran_id === tran_id);
            if (!exists) {
                paidUsers.push({
                    name: customer_name,
                    tran_id: tran_id,
                    amount: "1.00",
                    date: new Date().toLocaleString()
                });
            }
        }
        res.json(response.data);
    } catch (error) { res.json({ status: 1 }); }
});

// 3. API សម្រាប់ Admin មើលរបាយការណ៍
app.get('/api/admin/payments', (req, res) => res.json(paidUsers));

app.listen(3000, () => console.log('✅ Backend ដំណើរការលើ Port 3000'));