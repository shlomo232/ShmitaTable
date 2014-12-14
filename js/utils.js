Shmita.app.factory('utils', function() {
	function monthToNum(str) {
			var num;
			switch (str) {
				case "Tishrei":
					num=7; break;
				case "Cheshvan":
				case "Heshvan":
					num=8; break;
				case "Kislev":
					num=9; break;
				case "Tevet":
					num=10; break;
				case "Shevat":
				case "Shvat":
					num=11; break;
				case "Adar":
				case "Adar I":
				case "Adar 1":
					num=12; break;
				case "Adar II":
				case "Adar 2":
					num=13; break;
				case "Nissan":
				case "Nisan":
					num=1; break;
				case "Iyyar":
				case "Iyar":
					num=2; break;
				case "Sivan":
					num=3; break;
				case "Tammuz":
				case "Tamuz":
					num=4; break;
				case "Av":
					num=5; break;
				case "Elul":
					num=6; break;
			}
			return num;
		}

		function parseDate(input) {
				var dateArray;
				if (input=="None") return new Date(2017,0,1); // A 2017 date means no biur and no kedusha/sefihin intervals
				var parts = input.split(' ');
				dateArray=jd_to_gregorian(hebrew_to_jd(Number(parts[2]), Number(monthToNum(parts[1])), Number(parts[0])));
		//    alert(parts[2]+" "+monthToNum(parts[1])+" "+parts[0]+" "+dateArray);
				return new Date(dateArray[0], dateArray[1]-1, dateArray[2]);
		}
	return {
		monthToNum : monthToNum,
		parseDate : parseDate
	}
});
			