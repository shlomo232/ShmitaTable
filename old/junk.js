//  calcGregSerial  --  Update from Gregorian serial day number
function calcGregSerial()
{setJulian((new Number(document.gregserial.day.value)) + J0000);}

var nextday=false;
//  calcModifiedJulian  --  Update from Modified Julian day
function calcModifiedJulian() {
    setJulian((new Number(document.modifiedjulianday.day.value)) + JMJD);
}
