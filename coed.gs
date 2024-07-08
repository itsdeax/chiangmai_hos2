var sheetId = '10PLflIEwQhYbzw0O2wU4YhXlzvHHpchYHpxzNIFIM3s'; // แทนที่ด้วย ID ของ Google Spreadsheet ที่ใช้เก็บข้อมูล

function doGet(e) {
    return HtmlService.createHtmlOutput('Google Apps Script is deployed successfully.');
}

function doPost(e) {
    try {
        if (e.postData && e.postData.contents) {
            var contentType = e.postData.type;
            var postData;

            if (contentType === 'application/json') {
                postData = JSON.parse(e.postData.contents);
            } else {
                postData = parseQueryString(e.postData.contents);
            }

            Logger.log('Post Data: ' + JSON.stringify(postData));

            if (postData.events) {
                var events = postData.events;

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
            } else if (postData.title && postData.firstname && postData.lastname && postData.phone) {
                var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('database');

                // ดึงค่าจากฟอร์ม
                var title = postData.title;
                var firstname = postData.firstname;
                var lastname = postData.lastname;
                var phone = postData.phone;

                // ทำการบันทึกข้อมูลลงใน Google Spreadsheet
                sheet.appendRow([new Date(), title, firstname, lastname, phone]);

                // ส่งคำตอบกลับไปยัง JavaScript ในรูปแบบ JSON
                return ContentService.createTextOutput(JSON.stringify({result: 'success'})).setMimeType(ContentService.MimeType.JSON);
            } else {
                throw new Error('ไม่มีข้อมูลที่ถูกส่งมา');
            }
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
            if (values[i][1] == userId) { // ตรวจสอบคอลัมน์ที่ 1 (หลักคอลัมน์ B) เป็น userId ที่ต้องการลบ
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
    if (!message) {
        Logger.log('Error: message is empty');
        return;
    }

    var url = 'https://api.line.me/v2/bot/message/push';
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer z5+XBeeWe7b/P8RLP3vbkLQMucyEgaFeQBkFaoNl2M1FYekiw5br45poqbybnvs1qupnH7TYJS0lV0QWj8kiIwbwa4HibEyAvWCG7WkFAIomkJqeewxRGWMM9Hl39Fpc+Tsv9TQ+xGjM+EbPxor/CQdB04t89/1O/w1cDnyilFU=' // แทนที่ด้วย Channel Access Token ของคุณ
    };
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
        'payload': JSON.stringify(postData),
        'muteHttpExceptions': true
    };

    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
}

// ฟังก์ชันสำหรับแปลงข้อมูล query string เป็น JSON
function parseQueryString(query) {
    if (!query) {
        return {};
    }
    var params = query.split('&');
    var obj = {};
    params.forEach(function(param) {
        var keyValue = param.split('=');
        var key = decodeURIComponent(keyValue[0]);
        var value = decodeURIComponent(keyValue[1]);
        obj[key] = value;
    });
    return obj;
}
