document.getElementById('queueForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
        title: formData.get('title'),
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        phone: formData.get('phone'),
        userId: 'YOUR_USER_ID'  // แทนที่ด้วยวิธีการรับค่า userId ที่ต้องการ
    };

    fetch('https://script.google.com/macros/s/AKfycbx-PeZi9XhPlPRDnclCW7Q9bkauOEyU4lSLo0v5OCoC0m_1vRsloIV0kzru7dEcy69yGA/exec', {  // ตรวจสอบ URL ตรงนี้
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
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
