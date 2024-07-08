document.getElementById('queueForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const userId = 'unique_identifier_here'; // ตัวอย่างการกำหนด userID แบบ hard-coded

    formData.append('userId', userId); // เพิ่ม userId เข้าไปใน formData

    fetch('https://script.google.com/macros/s/AKfycbx-PeZi9XhPlPRDnclCW7Q9bkauOEyU4lSLo0v5OCoC0m_1vRsloIV0kzru7dEcy69yGA/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => response.json())
    .then(result => {
        if (result.result === 'success') {
            alert('บันทึกข้อมูลสำเร็จ');
            document.getElementById('queueForm').reset();
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    });
});
document.getElementById('queueForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const userId = 'unique_identifier_here'; // ตัวอย่างการกำหนด userID แบบ hard-coded

    formData.append('userId', userId); // เพิ่ม userId เข้าไปใน formData

    fetch('https://script.google.com/macros/s/AKfycbx-PeZi9XhPlPRDnclCW7Q9bkauOEyU4lSLo0v5OCoC0m_1vRsloIV0kzru7dEcy69yGA/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => response.json())
    .then(result => {
        if (result.result === 'success') {
            alert('บันทึกข้อมูลสำเร็จ');
            document.getElementById('queueForm').reset();
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    });
});
