var sheetId = '10PLflIEwQhYbzw0O2wU4YhXlzvHHpchYHpxzNIFIM3s'; // แทนที่ด้วย ID ของ Google Spreadsheet ที่ใช้เก็บข้อมูล

function doPost(e) {
    try {
        if (!e.postData || !e.postData.contents) {
            throw new Error('No data received or postData.contents is empty.');
        }

        var json = JSON.parse(e.postData.contents);
        var events = json.events;

        for (var i = 0; i < events.length; i++) {
            var eventType = events[i].type;

            if (eventType === 'message') {
                var messageText = events[i].message.text.trim();
                var userId = events[i].source.userId;

                // ตรวจสอบว่าข้อความที่ส่งมาเป็นคำสั่งลบหรือไม่
                if (messageText === 'ยกเลิกคิว') {
                    var success = deleteData(userId); // เรียกใช้ฟังก์ชันลบข้อมูลโดยส่ง userId เข้าไป
                    if (success) {
                        replyMessage(userId, 'ลบข้อมูลเรียบร้อยแล้ว');
                    } else {
                        replyMessage(userId, 'เกิดข้อผิดพลาดในการลบข้อมูล');
                    }
                }
            } else if (eventType === 'postback') {
                var postbackData = events[i].postback.data;
                // ตรวจสอบข้อมูล postbackData แล้วดำเนินการตามต้องการ
            }
        }

        if (e.parameter) {
            var params = e.parameter; // ดึงข้อมูลจากพารามิเตอร์ที่ส่งเข้ามา

            var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('database');

            var title = params.title;
            var firstname = params.firstname;
            var lastname = params.lastname;
            var phone = params.phone;
            var userId = params.userId; // เพิ่มการรับค่า userId

            sheet.appendRow([new Date(), title, firstname, lastname, phone, userId]); // เพิ่ม userId ในการบันทึกข้อมูล

            return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(ContentService.MimeType.JSON);
        } else {
            throw new Error('ไม่มีข้อมูลที่ถูกส่งมา');
        }
    } catch (error) {
        Logger.log(error);
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.message })).setMimeType(ContentService.MimeType.JSON);
    }
}

// ฟังก์ชันลบข้อมูลใน Google Sheets โดยใช้ userId
function deleteData(userId) {
    try {
        var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('database');

        var dataRange = sheet.getDataRange();
        var values = dataRange.getValues();
        var rowIndexToDelete = -1;

        // ค้นหาแถวที่มี userId ที่ต้องการลบ
        for (var i = 1; i < values.length; i++) {
            if (values[i][5] == userId) { // ตรวจสอบคอลัมน์ที่ 6 (หลักคอลัมน์ F) เป็น userId ที่ต้องการลบ
                rowIndexToDelete = i + 1; // ระบุ index ของแถวที่จะลบโดยเพิ่ม 1 เนื่องจากข้อมูลใน values นับแถวเริ่มต้นที่ 0
                break;
            }
        }

        if (rowIndexToDelete > 0) {
            // ลบแถวที่พบ userId ที่ต้องการ
            sheet.deleteRow(rowIndexToDelete);
            return true;
        } else {
            return false; // ไม่พบ userId ที่ต้องการลบ
        }
    } catch (error) {
        Logger.log(error);
        return false;
    }
}

// ฟังก์ชันสำหรับตอบกลับข้อความไปยัง LINE OA
function replyMessage(userId, message) {
    var url = 'https://api.line.me/v2/bot/message/push';
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer O0EWlYQreieO4zasx9jX32H0m3z5HGXSkF6vfkptJa85hCAJJ9GpE2wLoG8yetb52E6J+0R59H22ErffFX0MokHar2W9kih1KC++KRYa+vFuWJRsqy+f8XLvshJ5ad4UdZWah+vk/tMYwYOn2xOpNAdB04t89/1O/w1cDnyilFU=' // แทนที่ด้วย Channel Access Token ของคุณ
    };
    if (!message) {
    throw new Error('Message cannot be empty');
}
    var postData = {
        'to': userId,
        'messages': [{
            'type': 'text',
            'text': message
        }]
    };
    var options = {
        'method': 'post',
        'headers': headers,
        'payload': JSON.stringify(postData)
    };
    UrlFetchApp.fetch(url, options);
}
