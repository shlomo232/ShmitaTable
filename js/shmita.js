
        /* TODO:
                    Description box when clicking; content includes infoHe and infoEn - http://stackoverflow.com/questions/27346563/havoc-while-escaping-quotes-in-javascript
                    http://robertnyman.com/2008/11/20/why-inline-css-and-javascript-code-is-such-a-bad-thing/
                    Appearance
                    App wrapper
                    */
        var language = "en";
        var now = new Date();
        var nowHe = jd_to_hebrew(gregorian_to_jd(now.getFullYear(), now.getMonth() + 1, now.getDate())); // in special array format
        var recent = new Date(); // A number of days ago - anything whose status changed in last # days gets an "updated" flag.
        recent.setTime(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        // Functions
        function monthToNum(str) {
            var num;
            switch (str) {
                case "Tishrei":
                    num = 7;
                    break;
                case "Cheshvan":
                case "Heshvan":
                    num = 8;
                    break;
                case "Kislev":
                    num = 9;
                    break;
                case "Tevet":
                    num = 10;
                    break;
                case "Shevat":
                case "Shvat":
                    num = 11;
                    break;
                case "Adar":
                case "Adar I":
                case "Adar 1":
                    num = 12;
                    break;
                case "Adar II":
                case "Adar 2":
                    num = 13;
                    break;
                case "Nissan":
                case "Nisan":
                    num = 1;
                    break;
                case "Iyyar":
                case "Iyar":
                    num = 2;
                    break;
                case "Sivan":
                    num = 3;
                    break;
                case "Tammuz":
                case "Tamuz":
                    num = 4;
                    break;
                case "Av":
                    num = 5;
                    break;
                case "Elul":
                    num = 6;
                    break;
            }
            return num;
        }

        function parseDate(input) {
            var dateArray;
            if (input == "None") return new Date(2017, 0, 1); // A 2017 date means no biur and no kedusha/sefihin intervals
            var parts = input.split(' ');
            dateArray = jd_to_gregorian(hebrew_to_jd(Number(parts[2]), Number(monthToNum(parts[1])), Number(parts[0])));
            return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        }

        function kedusha(food) {
            return (food.beginKedusha < now && food.endKedusha > now);
        }

        function noKedusha(food) {
            return !kedusha(food);
        }

        function sefihin(food) {
            return (food.beginSefihin < now && food.endSefihin > now);
        }

        function noSefihin(food) {
            return !sefihin(food);
        }

        function needsBiur(food) {
            return (food.biur < now);
        }

        function kedushaRecent(food) {
            return (food.beginKedusha < recent && food.endKedusha > recent);
        }

        function noKedushaRecent(food) {
            return !kedushaRecent(food);
        }

        function sefihinRecent(food) {
            return (food.beginSefihin < recent && food.endSefihin > recent);
        }

        function noSefihinRecent(food) {
            return !sefihinRecent(food);
        }

        function needsBiurRecent(food) {
            return (food.biur < recent);
        }

        function makeList(listFunc) {
            var list = [];
            for (var i = 0; i < foodsImport.length; i++)
                if (listFunc(foodsImport[i])) list.push(foodsImport[i]);
            if (language == "en")
                list.sort(function(a, b) {
                    return a.English.localeCompare(b.English);
                });
            else
                list.sort(function(a, b) {
                    return a.Hebrew.localeCompare(b.Hebrew);
                });
            return list;
        }

        function showDialog(text) {
            $("#dialog").dialog();
            $("#dialogText").text(text);
        }

        function displayItem(item) {
            var str = "";
            var dialogText = "";
            // Prepare dialog
            if (language == "en") dialogText = item.English;
            else dialogText = item.Hebrew;
            str = str + "<span onClick=showDialog('" + dialogText + "')>";
            // Text to display
            if (item.Type == "vegetable") str = str + "<font color=green>";
            if (item.Type == "fruit") str = str + "<font color=red>";
            if (language == "en") str = str + item.English;
            else str = str + item.Hebrew;
            if (item.Type == "vegetable" || item.Type == "fruit") str = str + "</font>";
            str = str + "</span>";
            return str;
        }

        function displayList(list, recentFunc) {
            var text = "";
            if (language == "he") text = text + "<span dir=rtl>";
            for (var i = 0; i < list.length; i++) {
                text = text + displayItem(list[i]);
                if (!recentFunc(list[i])) { // Mark entries updated recently
                    if (language == "en") text = text + " <span style=\"background-color: #FFFF00\">(New!)</span>";
                    else text = text + " <span style=\"background-color: #FFFF00\">(חדש!)</span>";
                }
                text = text + "<br>";
            }
            if (language == "he") text = text + "</span>";
            return text;
        }

        function displayListNew(list, recentFunc) {
                /*
                            var span = document.createElement('span');
                            span.addEventListener('click', function (event) { showDialog(dialogText); });
                            */
            }
            // Make page elements
        var foodsText = null;
        jQuery.ajax({
            url: './shmita.csv',
            success: function(result) {
                foodsText = result;
            },
            dataType: "text",
            async: false
        });
        foodsImport = $.csv.toObjects(foodsText);
        for (var i = 0; i < foodsImport.length; i++) {
            foodsImport[i].beginKedusha = parseDate(foodsImport[i].Kedusha);
            foodsImport[i].endKedusha = parseDate(foodsImport[i].NoKedusha);
            foodsImport[i].beginSefihin = parseDate(foodsImport[i].Sefihin);
            foodsImport[i].endSefihin = parseDate(foodsImport[i].NoSefihin);
            foodsImport[i].biur = parseDate(foodsImport[i].Biur);
        }
        var monthListEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var monthListEnHe = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
        var monthListHe = ["Nisan", "Iyar", "Sivan", "Tammuz", "Av", "Elul", "Tishrei", "Heshvan", "Kislev", "Tevet", "Shvat", "Adar", "Adar II"];
        var monthListHeHe = ["ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "חשון", "כסלו", "טבת", "שבט", "אדר", "אדר ב"];
        var aboutEn = "<p>The \"Shmita Table\" app displays the shmita status of each species of fruit and vegetable based on the current date.</p>" +
            "<p>Data is taken mostly from the table at " +
            "<a href=\"http://www.hamachon.co.il/web/project/project.asp?id=18777&modul=40&codeclient=1738&codesubweb=0#\">hamachon.co.il</a>" +
            " with some data from <a href=\"http://www.toraland.org.il/%D7%91%D7%99%D7%AA-%D7%94%D7%9E%D7%93%D7%A8%D7%A9/%D7%A9%D7%A0%D7%AA-%D7%A9%D7%9E%D7%99%D7%98%D7%94-%D7%AA%D7%A9%D7%A2%D7%94/%D7%9C%D7%95%D7%97-%D7%A7%D7%93%D7%95%D7%A9%D7%AA-%D7%A9%D7%91%D7%99%D7%A2%D7%99%D7%AA-%D7%95%D7%91%D7%99%D7%A2%D7%95%D7%A8-%D7%91%D7%A4%D7%99%D7%A8%D7%95%D7%AA-%D7%94%D7%90%D7%99%D7%9C%D7%9F.aspx\">" +
            "Otzar Haaretz</a>.</p>" +
            "<p>Today's date is " + now.getDate() + " " + monthListEn[now.getMonth()] + " " + now.getFullYear() +
            " (" + nowHe[2] + " " + monthListHe[nowHe[1] - 1] + " " + nowHe[0] + ").</p>" +
            "<p>Fruits are displayed in <font color=red>red</font> text, and vegetables in <font color=green>green</font> text. Other foods (like grains and spices) are in black.</p>";
        var aboutHe = "<p dir=\"rtl\">אפליקציית Shmita Table (לוח שמיטה) מראה את הסטטוס לגבי שמטיה של כל פרי וירק בתאריך הנוכחי. </p>" +
            "<p dir=\"rtl\">" + " הנתונים לוקחו מהטבלאות באתר " +
            "<a href=\"http://www.hamachon.co.il/web/project/project.asp?id=18777&modul=40&codeclient=1738&codesubweb=0#\">המכון למצוות תלויות בארץ</a>" +
            " ובאתר " +
            "<a href=\"http://www.toraland.org.il/%D7%91%D7%99%D7%AA-%D7%94%D7%9E%D7%93%D7%A8%D7%A9/%D7%A9%D7%A0%D7%AA-%D7%A9%D7%9E%D7%99%D7%98%D7%94-%D7%AA%D7%A9%D7%A2%D7%94/%D7%9C%D7%95%D7%97-%D7%A7%D7%93%D7%95%D7%A9%D7%AA-%D7%A9%D7%91%D7%99%D7%A2%D7%99%D7%AA-%D7%95%D7%91%D7%99%D7%A2%D7%95%D7%A8-%D7%91%D7%A4%D7%99%D7%A8%D7%95%D7%AA-%D7%94%D7%90%D7%99%D7%9C%D7%9F.aspx\">" +
            "אוצר הארץ</a>.</p>" +
            "<p dir=rtl>התאריך היום הוא " + now.getDate() + " " + monthListEnHe[now.getMonth()] + " " + now.getFullYear() +
            " (" + nowHe[2] + " " + monthListHeHe[nowHe[1] - 1] + " " + nowHe[0] + ").</p>" +
            "<p dir=rtl>פירות מוצגים בצבע <font color=red>אדום</font>, ירקות בצבע <font color=green>ירוק</font>, ושאר מינים (כמו דגנים ותבלינים) בצבע שחור.</p>";

        function generateLists() {
            document.getElementById("listKedusha").innerHTML = displayList(makeList(kedusha), kedushaRecent);
            document.getElementById("listNoKedusha").innerHTML = displayList(makeList(noKedusha), noKedushaRecent);
            document.getElementById("listSefihin").innerHTML = displayList(makeList(sefihin), sefihinRecent);
            document.getElementById("listNoSefihin").innerHTML = displayList(makeList(noSefihin), noSefihinRecent);
            document.getElementById("listBiur").innerHTML = displayList(makeList(needsBiur), needsBiurRecent);
        }

        function changeLang() {
            if (language == "he") {
                language = "en";
                document.getElementById("tabKedusha").innerHTML = "Kedusha";
                document.getElementById("tabNoKedusha").innerHTML = "No kedusha";
                document.getElementById("tabSefihin").innerHTML = "Sefihin";
                document.getElementById("tabNoSefihin").innerHTML = "No sefihin";
                document.getElementById("tabBiur").innerHTML = "Needs biur";
                document.getElementById("tabAboutHelp").innerHTML = "About/Help";
                document.getElementById("titleKedusha").innerHTML = "Kedushat shviit";
                document.getElementById("titleNoKedusha").innerHTML = "No kedushat shviit";
                document.getElementById("titleSefihin").innerHTML = "Sefihin";
                document.getElementById("titleNoSefihin").innerHTML = "No sefihin";
                document.getElementById("titleBiur").innerHTML = "Needs Biur";
                document.getElementById("titleAbout").innerHTML = "About/Help";
                document.getElementById("aboutText").innerHTML = aboutEn;
            } else {
                language = "he";
                document.getElementById("tabKedusha").innerHTML = "קדושה";
                document.getElementById("tabNoKedusha").innerHTML = "ללא קדושה";
                document.getElementById("tabSefihin").innerHTML = "ספיחין";
                document.getElementById("tabNoSefihin").innerHTML = "ללא ספיחין";
                document.getElementById("tabBiur").innerHTML = "צריכים ביעור";
                document.getElementById("tabAboutHelp").innerHTML = "אודות/עזרה";
                document.getElementById("titleKedusha").innerHTML = "קדושת שביעית";
                document.getElementById("titleNoKedusha").innerHTML = "ללא קדושת שביעית";
                document.getElementById("titleSefihin").innerHTML = "ספיחין";
                document.getElementById("titleNoSefihin").innerHTML = "ללא ספיחין";
                document.getElementById("titleBiur").innerHTML = "צריכים ביעור";
                document.getElementById("titleAbout").innerHTML = "אודות/עזרה";
                document.getElementById("aboutText").innerHTML = aboutHe;
            }
            generateLists();
        }
        document.getElementById("aboutText").innerHTML = aboutEn;
        generateLists();
        