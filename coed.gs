var sheetName = 'database';
var scriptProp = PropertiesService.getScriptProperties();
var sheetId = '10PLflIEwQhYbzw0O2wU4YhXlzvHHpchYHpxzNIFIM3s'; // แทนที่ด้วย ID ของ Google Spreadsheet ที่ใช้เก็บข้อมูล

function initialSetup() {
    var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doGet(e) {
    return HtmlService.createHtmlOutput('Google Apps Script is deployed successfully.');
}

function doPost(e) {
    try {
        if (e && e.parameter) {
            var params = e.parameter; // ดึงข้อมูลจากพารามิเตอร์ที่ส่งเข้ามา

            var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
            
            // ดึงค่าจากฟอร์ม
            var title = params.title;
            var firstname = params.firstname;
            var lastname = params.lastname;
            var phone = params.phone;
            
            // ทำการบันทึกข้อมูลลงใน Google Spreadsheet
            sheet.appendRow([new Date(), title, firstname, lastname, phone]);
            
            // ส่งคำตอบกลับไปยัง JavaScript ในรูปแบบ JSON
            return ContentService.createTextOutput(JSON.stringify({result: 'success'})).setMimeType(ContentService.MimeType.JSON);
        } else if (e && e.postData && e.postData.contents) {
            var json = JSON.parse(e.postData.contents);
            var eventType = json.events[0].type;
            
            if (eventType === 'message') {
                var messageText = json.events[0].message.text.trim();
                var userId = json.events[0].source.userId;
        
                // ตรวจสอบว่าข้อความที่ส่งมาเป็นคำสั่งลบหรือไม่
                if (messageText === 'delete') {
                    var success = deleteData(userId); // เรียกใช้ฟังก์ชันลบข้อมูลโดยส่ง userId เข้าไป
                    if (success) {
                        replyMessage(userId, 'ลบข้อมูลเรียบร้อยแล้ว');
                    } else {
                        replyMessage(userId, 'เกิดข้อผิดพลาดในการลบข้อมูล');
                    }
                }
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
        var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
        
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
        'payload': JSON.stringify(postData)
    };
    UrlFetchApp.fetch(url, options);
}
