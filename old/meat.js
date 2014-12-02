/* // Food data (I use meats so that my fake data won't eventually get mixed with real data)
var foods=[];
function makeDate(year, month, day) {
	return new Date(year, month-1, day); // -1 because January=0, February=1 in Javascript
}
var chicken = {
	English: "chicken",
	Hebrew: "עוף",
	beginKedusha: makeDate(2014,5,24),
	endKedusha: parseDate("2014.11.24"),
	beginSefihin: makeDate(2014,5,24),
	endSefihin: makeDate(2014,9,24),
	biur: makeDate(2014,11,24),
	type: "meat",
	info: "Everything tastes like chicken"
};
foods.push(chicken);
var beef = {
	English: "beef",
	Hebrew: "בקר",
	beginKedusha: makeDate(2014,5,24),
	endKedusha: makeDate(2014,5,24),
	beginSefihin: makeDate(2014,5,24),
	endSefihin: makeDate(2014,5,24),
	biur: makeDate(2014,5,24),
	type: "meat",
	info: "Yum yum yum"
};
foods.push(beef);
*/

