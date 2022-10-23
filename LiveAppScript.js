function onOpen() {
    var ui         = SpreadsheetApp.getActiveSpreadsheet();
    var entries    = [];
    entries.push({name : "Import", functionName : "JSONimport"});
    ui.addMenu("Import", entries);
};
  
function debug(){
    const ss       = SpreadsheetApp.getActiveSpreadsheet();
    const sheet    = ss.getSheets()[0];
    var rows       = sheet.getMaxRows();
    for(i=1;i<=rows;i++){
      sheet.getRange(i,4).setNumberFormat('hh:mm:ss a/p"m"');
    }
   /* var name       = sheet.getName();
    var date       = sheet.getRange(1,3).getValue();
    var time       = sheet.getRange(1,4).getValue();
    var time2      = sheet.getRange(1,4).getDisplayValue();
    Logger.log(date);
    Logger.log(time);
    Logger.log(time2);*/
}
  
function JSONimport() {
    const url      = "https://web.sa.sc.edu/wusc/feeds";
    var jsondata   = UrlFetchApp.fetch(url);
    var data       = JSON.parse(jsondata.getContentText());
    var entries = data.feeds;
    Utilities.sleep(1000);
    //Logger.log(entries);
    //debugger;
    return dateandtime(entries);
}
  
function dateandtime(entries){
    var date      = [];
    var time      = [];
    for(i = 0; i < entries.length; i++){
      date[i] = entries[i].timestamp.substring(0,12);
      time[i] = entries[i].timestamp.substring(14);
    }
    //Logger.log(date + time);
    //debugger;
    return comparator(entries, date, time)
}
  
function comparator(entries, date, time){
    const ss       = SpreadsheetApp.getActiveSpreadsheet();
    const sheet    = ss.getSheets()[0];
    //Arrays start at position 0, entries.length = 1-10, but we can only read from 0-9. 
    var newvalues = entries.length-1;
    for(i = 0; i < time.length; i++){
      var stamp1 = time[i].substr(0,8);
      for(j = 1; j <= entries.length; j++){
        var stamp2 = sheet.getRange(j,6).getDisplayValue().substring(0,8);
        if(stamp1 == stamp2){newvalues-=1; Logger.log("Same " + i);};
        //debugger;
      }
    }
    Logger.log(newvalues);
    debugger;
    return storeData(entries, newvalues, date, time);
}
  
function storeData(entries, newvalues, date, time){
    const ss       = SpreadsheetApp.getActiveSpreadsheet();
    const sheet    = ss.getSheets()[0];
    const formats  = ["@STRING@","@STRING@","@STRING@", "@STRING@", "mmm dd, yyyy", 'hh:mm:ss a/p"m"'];
    Logger.log(time);
    for(i = newvalues; i >= 0; i--){
      sheet.insertRowsBefore(1,1);
      var outputdata = [entries[i].artist, entries[i].title, date[i], time[i], date[i], time[i]];
      Logger.log("time: " + time[i]);
      debugger;
      sheet.getRange("A1:F1").setValues([outputdata]);
      sheet.getRange("A1:F1").setNumberFormats([formats]);
    }
}
  
function period() {
    const ss       = SpreadsheetApp.getActiveSpreadsheet();
    const sheet    = ss.getSheets()[0];
    var month      = sheet.getRange(50,5).getDisplayValue().substring(0,3);
    var year       = sheet.getRange(50,5).getDisplayValue().substring(8,12);
    var day        = sheet.getRange(50,5).getDisplayValue().substring(4,6);
    var tabName    = month + "-" + day + "-" + year;
    sheet.setName(tabName);
    debugger;
    ss.insertSheet("Current", 0, {template: sheet});
    return cleanup(day);
}
  
function cleanup(day) {
    const ss       = SpreadsheetApp.getActiveSpreadsheet();
    const sheet    = ss.getSheets()[1];
    const sheet2   = ss.getSheets()[0];
    var rows       = sheet.getLastRow().toString().replace(".0","");
    var rows2      = sheet2.getLastRow().toString().replace(".0","");
    var day2       = sheet.getRange(1,3).getDisplayValue().substring(4,6);
    var todelete   = [];
    var todelete2  = [];
    //Logger.log(rows);
    for(i = 1; i <= rows; i++){
      var compare = sheet.getRange(i,5).getDisplayValue().toString().substring(4,6);
      //debugger;
      if(compare != day){todelete.push(i.toString().replace(".0",""))}
    }
    for(i = todelete.length-1; i >= 0; i--){
      sheet.deleteRow(todelete[i]);
    }
    for(i = 1; i <= rows2; i++){
      var compare = sheet2.getRange(i,5).getDisplayValue().toString().substring(4,6);
      //debugger;
      if(compare != day2){todelete2.push(i.toString().replace(".0",""))}
    }
    for(i = todelete2.length-1; i >= 0; i--){
      sheet2.deleteRow(todelete2[i]);
    }
    //Logger.log(todelete);
    //debugger;
}  