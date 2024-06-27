const scriptURL = 'https://script.google.com/macros/s/AKfycbysoc16x4t3piYiYoCsuXTbG3pxSFHVK6CrUg-OT2e5SY6bUFK1fc1O_-zCTHErzxHp0Q/exec';
const form = document.getElementById('queueForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    
    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            alert('บันทึกข้อมูลสำเร็จ!');
            form.reset();
        } else {
            alert('เกิดข้อผิดพลาด: ' + data.error); 
        }
    })
    .catch(error => {
        console.error('Error!', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    });
});
