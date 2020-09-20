let EMAIL_SUBJECT = 'Enter your email subject here';

function installTrigger() {
  let triggers = ScriptApp.getUserTriggers(SpreadsheetApp.getActive());
  let existingTrigger = null;
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT) {
      existingTrigger = triggers[i];
      break;
    }
  } 
  if(!existingTrigger){ //check if trigger is installed
    ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onFormSubmit()
      .create();
  }
}

function onFormSubmit(e) {
  let responses = e.namedValues;
  let email = responses['Email Address'][0].trim();
  let name = responses.Name[0].trim();
  let ID = new Date().getTime();
  let file = DriveApp.getFileById('File ID which you want to use as attachment');
  
  let sheet = SpreadsheetApp.getActiveSheet();
  let row = sheet.getActiveRange().getRow();
  let statuscol = e.values.length + 2;
  let StatusCell = sheet.getRange(row, statuscol);
  if(StatusCell.getValue() == 'Sent'){
    return;
  }
  let idcol = e.values.length + 1;
  let IdCell = sheet.getRange(row, idcol);
  IdCell.setValue(ID);
  
  MailApp.sendEmail({
    to: email,
    subject: EMAIL_SUBJECT,
    htmlBody: createEmailBody(name),
    attachments: [file.getAs(MimeType.JPEG)],
  });
  
  StatusCell.setValue('Sent');

}

function createEmailBody(name){
  let templ = HtmlService
      .createTemplateFromFile('CustomizeMail');
  
  templ.name = name;
  let message = templ.evaluate().getContent();
  return message;
}
