import React, { useState, useEffect } from 'react';

const PaymentForm = () => {
    const [qrImage, setQrImage] = useState('');
    const [tranId, setTranId] = useState('');
    const [status, setStatus] = useState('idle');
    const [adminData, setAdminData] = useState([]);

    const generateQR = async () => {
        const req_time = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        const tid = "STORES-" + Date.now();
        
        try {
            const res = await fetch('http://localhost:3000/api/create-qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    req_time, tran_id: tid, amount: "1.00",
                    firstname: "Seyha", lastname: "Em", email: "seyha@example.com", phone: "012345678"
                })
            });
            const data = await res.json();
            
            if (data.status && data.status.code === "00") {
                setQrImage(data.qrImage); 
                setTranId(data.status.tran_id);
                setStatus('pending');
            } else {
                alert("កំហុស៖ " + (data.description || "ABA Error"));
            }
        } catch (err) {
            alert("Connection error! សូមប្រាកដថាបងបាន Run Backend (node server.js)");
        }
    };

    useEffect(() => {
        let interval;
        if (status === 'pending' && tranId) {
            interval = setInterval(async () => {
                const req_time = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
                try {
                    const res = await fetch('http://localhost:3000/api/check-status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ req_time, tran_id: tranId, customer_name: "Seyha Em" })
                    });
                    const data = await res.json();
                    if (data.status && data.status.code === "00") {
                        setStatus('success');
                        clearInterval(interval);
                        fetchAdminData();
                    }
                } catch (err) {
                    console.log("កំពុងឆែកស្ថានភាពបង់ប្រាក់...");
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [status, tranId]);

    const fetchAdminData = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/admin/payments');
            const data = await res.json();
            setAdminData(data);
        } catch (err) {
            console.log("Admin API error");
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
            <h2 style={{ color: '#005a8d' }}>ប្រព័ន្ធបង់ប្រាក់ ABA</h2>
            
            {status === 'idle' && (
                <button onClick={generateQR} style={styles.btn}>បង្ហាញ QR Code $1.00</button>
            )}

            {status === 'pending' && qrImage && (
                <div style={{ marginTop: '20px' }}>
                    <img src={qrImage} alt="ABA QR" style={{ width: '280px', border: '5px solid #005a8d', borderRadius: '10px' }} />
                    <p style={{ marginTop: '10px' }}>សូមស្កេនជាមួយ <b>ABA Mobile</b></p>
                </div>
            )}

            {status === 'success' && (
                <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
                    <h2 style={{ color: 'green' }}>✓ បង់ប្រាក់ជោគជ័យ!</h2>
                </div>
            )}

            <div style={{ marginTop: '50px', textAlign: 'left' }}>
                <h3>របាយការណ៍អ្នកបង់រួច (Admin)</h3>
                <table border="1" style={styles.table}>
                    <thead>
                        <tr style={{ background: '#f2f2f2' }}>
                            <th style={{ padding: '10px' }}>ឈ្មោះ</th><th>Tran ID</th><th>ទឹកប្រាក់</th><th>កាលបរិច្ឆេទ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminData.map((u, i) => (
                            <tr key={i}>
                                <td style={{ padding: '10px' }}>{u.name}</td><td>{u.tran_id}</td><td>${u.amount}</td><td>{u.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    btn: { padding: '12px 24px', background: '#005a8d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' }
};

export default PaymentForm;