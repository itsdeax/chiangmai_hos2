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

            if (postData.title && postData.firstname && postData.lastname && postData.phone) {
                var userId = generateUserId(); // สร้าง UserID ใหม่
                var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('database');

                // ดึงค่าจากฟอร์ม
                var title = postData.title;
                var firstname = postData.firstname;
                var lastname = postData.lastname;
                var phone = postData.phone;

                // ทำการบันทึกข้อมูลลงใน Google Spreadsheet
                sheet.appendRow([new Date(), userId, title, firstname, lastname, phone]);

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
function generateUserId() {
    // สร้าง UserID จากเลขลำดับที่เพิ่มขึ้นอัตโนมัติ
    var sheet = SpreadsheetApp.openById('10PLflIEwQhYbzw0O2wU4YhXlzvHHpchYHpxzNIFIM3s').getSheetByName('database');
    var lastRow = sheet.getLastRow();
    var userId = lastRow + 1; // UserID เป็นเลขลำดับของแถวใหม่ที่จะเพิ่ม

    // สามารถสุ่ม UserID ได้โดยใช้เลขลำดับหรืออัลกอริธึมสุ่มอื่น ๆ ตามที่ต้องการ
    return userId;
}
// ฟังก์ชันเก็บ UserID ใน Google Spreadsheet
function storeUserId(userId) {
    try {
        var sheet = SpreadsheetApp.openById('10PLflIEwQhYbzw0O2wU4YhXlzvHHpchYHpxzNIFIM3s').getSheetByName('databases'); // ชื่อแผ่นข้อมูลใน Google Spreadsheet
        var lastRow = sheet.getLastRow();
        sheet.getRange(lastRow + 2, 1).setValue(userId); // เก็บ UserID ลงในคอลัมน์ A ของแถวสุดท้ายที่ว่าง
        Logger.log('Stored UserID: ' + userId);
    } catch (error) {
        Logger.log('Error storing UserID: ' + error.message);
    }
}
// ฟังก์ชันลบข้อมูลใน Google Sheets โดยใช้ userId
function deleteData(userId) {
    try {
        var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('database');

        var dataRange = sheet.getDataRange();
        var values = dataRange.getValues();
        var rowIndexToDelete = -1;

        // เพิ่มการบันทึกเพื่อดูข้อมูลในแต่ละแถว
        Logger.log('userId ที่ต้องการลบ: ' + userId);

        // ค้นหาแถวที่มี userId ที่ต้องการลบ
        for (var i = 1; i < values.length; i++) {
            Logger.log('Row ' + i + ': ' + values[i][1]); // เพิ่มการบันทึกค่าในคอลัมน์ userId
            if (values[i][1] == userId) { // ตรวจสอบคอลัมน์ที่ 1 (หลักคอลัมน์ B) เป็น userId ที่ต้องการลบ
                rowIndexToDelete = i + 1; // ระบุ index ของแถวที่จะลบโดยเพิ่ม 1 เนื่องจากข้อมูลใน values นับแถวเริ่มต้นที่ 0
                break;
            }
        }

        if (rowIndexToDelete > 0) {
            // ลบแถวที่พบ userId ที่ต้องการ
            sheet.deleteRow(rowIndexToDelete);
            Logger.log('ลบแถวที่: ' + rowIndexToDelete);
            return true;
        } else {
            Logger.log('ไม่พบ userId ที่ต้องการลบ');
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

// ฟังก์ชันแปลงข้อมูล query string เป็น JSON
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
