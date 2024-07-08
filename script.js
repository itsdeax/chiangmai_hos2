document.getElementById('queueForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('https://script.google.com/macros/s/AKfycbzIxneso1FAkuAM6sMX-9xlGBRaI3z6FeDyZ4I1yvSHhQ_17zBMnQh5QhWtGyLcWzsEng/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => response.json())
    .then(result => {
        if (result.result == 'success') {
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

