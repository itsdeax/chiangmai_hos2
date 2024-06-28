const scriptURL = 'https://script.google.com/macros/s/AKfycbyfxyzPO3y_06c9zuptHcCI4vfVFhDEA77hjWz7yPNMyKAxfmiof5nAZucFjI_NsydoBA/exec';
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
