// Tämän piti alun perin olla trainingPlan classin oma tiedosto, mutta eihän ne
// suunnitelmat pidä, ellei niitä edes yritä pitää.
/* 
  ________  ___________  ________   
 /"       )("     _   ")|"      "\  
(:   \___/  )__/  \\__/ (.  ___  :) 
 \___  \       \\_ /    |: \   ) || 
  __/  \\      |.  |    (| (___\ || 
 /" \   :)     \:  |    |:       :) 
(_______/       \__|    (________/ 
   Self   Training    Director     v.2.0

classes.js

*/

// userData luokalla hallitaan käyttäjän asetuksia / Tai oikeastaan siis luodaan käyttäjä, jos sitä ei ole.
class UserData {
    constructor() {
        const storedData = localStorage.getItem('userData');
        // Tarkistetaan. Jos ei saatu käyttäjää userDatasta niin sellanen sit kai tehdää.
        if (storedData) {
            this.data = JSON.parse(storedData);
        } else {
            this.data = {
                name: 'Anonymous',
                targetWeight: 0,
                startWeight: 0,
                age: 42,
                gender: 0,
                currentWaist: 0,
                // laitetaan tää päivä aloituspäiväksi. Treeni siis alkaa, kun eka kertaa avaa appin
                startDate:  new Date().toISOString().split('T')[0] 
            };
            // Yllä oleva data vielä tallennetaan.
            this.saveToLocalStorage();
        }
    }

    // käytetään, kun halutaan käyttäjän tiedot localstoragesta. Tätä käytetään tuolla koodin lopussa.
    loadFromLocalStorage() {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            this.data = JSON.parse(storedData);
        }
    }

    // Tallennetaan tiedot. Yllättäen tässä kohtaa vielä mennään metodilla :)
    saveToLocalStorage() {
        localStorage.setItem('userData', JSON.stringify(this.data));
        const saveduser = JSON.parse(localStorage.getItem('userData')).name;
        console.log(`User data has been saved! ${saveduser}`);
    }

}

// Alustetaan käyttäjä ja haetaan tiedot tai luodaan tiedot. 
const userData = new UserData();


// 
//
// TrainingPlan Class - Tällä huolletaan meidän treeniohjelmaa.
// ToDo: 
// Funkkareista metodeiksi? 
class TrainingPlan {
    // Kun uusi pläni luodaan, niin se tehdään tällä. 
    constructor(options) {
        this.name = options.name || 'netflix & chill';
        this.weekDay = options.weekDay || 0;
        this.active = options.active || true;
        this.type = options.type || 'rest';
        this.reps = options.reps || 0;
        this.sets = options.sets || 0;
        this.aerobicType = options.aerobicType || ''; 
        this.aerobicMetric = options.aerobicMetric || '';
        this.uniqueId = options.uniqueId || '42';
        
        
        // addSchedule lisää tämän treenin viikko-ohjelmaan, jotta voidaan laskea efforttia ja ohjelmia piecharttiin
        TrainingPlan.addSchedule(this.weekDay);
        console.log("New plan created with uniqueID: "+this.uniqueId);
    }

    // Tätä käytetään script.js:ssä hieman erikoisesti. 
    saveThePlan() {
        const plans = TrainingPlan.getPlans();
        plans.push(this);
        console.log("Yes, this is saving?");
        TrainingPlan.setPlans(plans);
    }

// Haetaan nyt olevat plänit tällä
    static getPlans() {
        return JSON.parse(localStorage.getItem('plans')) || [];
    }
// Asetetaan muutettu Plänikanta takaisin. 
    static setPlans(plans) {
        localStorage.setItem('plans', JSON.stringify(plans));
    }
// Haetaan viikkoaikataulu tällä. Palauttaa 0,0,0,0,0,0 jos viikkoaikataulua ei saatu.
// Viikkoaikataulua tarvitaan, kun aletaan laskemaan paljonko tapahtumia on viikossa ja täten missattu.
    static getSchedule() {
        return JSON.parse(localStorage.getItem('changes')) || [0, 0, 0, 0, 0, 0, 0];
    }

// Ja sit laitetaan se aikataulu takas, jos sitä sormeillaan.
// Viikkoaikataulua sormeilee mm. uuden planin luonti ja planien editointi.
    static setSchedule(changes) {
        localStorage.setItem('changes', JSON.stringify(changes));
    }

    // DeletePlan tuhoaa plänin. Tämä
    static deletePlan(index) {
        const plans = TrainingPlan.getPlans();
        if (index >= 0 && index < plans.length) {
            const theday = plans[index].weekDay;
            console.log("Se oli "+theday);
            this.delSchedule(theday);
            plans.splice(index, 1);
            localStorage.setItem('plans', JSON.stringify(plans));
            console.log("Sinne meni se pläni");
            // Näytetään uudelleen kaikki pläänit, niin deletoitu poistuu.
            TrainingPlan.displayAllPlans();
        }
    }



    

    // PrevSync tallennetaan joka ajolla. Jos käyttäjä jättää useamman päivän välistä, 
    // niin PrevSyncillä lasketaan tapahtumapäivien ero ja saadaan menetyt tsäänsit listattua.
    static prevSync() {
        const thisday = new Date();
        const prevday = localStorage.getItem('prevSync');
        localStorage.setItem('prevSync', thisday.getTime());
        return prevday; 
    }

    static countChanges() {
        // Haetaan tieto, kuinka monta mahista meillä on ollut tähän mennessä.
        // Mahikset = suorituksia viikko-ohjelmassa.
        // countChanges on oikeastaan aika pitkälti vain sen takia, että pieChart on olemassa.
        let total = localStorage.getItem('youhadyourchange');
        const thisday = new Date();
        const prevday = this.prevSync();
        console.log("Previous sync: "+prevday);

        // Haetaan tieto kuinka monta mitäkin päivää on harjoittelujen välissä.
        // Eli jos tyyppi ei avaa appia viikkoon, niin lasketaan kuinka monta mitäkin päivää on ollut
        // ja ...
        const mondayChanges = countWeekDays(thisday.getTime(), prevday, "Monday");
        const tuesdayChanges = countWeekDays(thisday.getTime(), prevday, "Tuesday");
        const wednesdayChanges = countWeekDays(thisday.getTime(), prevday, "Wednesday");
        const thursdayChanges = countWeekDays(thisday.getTime(), prevday, "Thursday");
        const fridayChanges = countWeekDays(thisday.getTime(), prevday, "Friday");
        const saturdayChanges = countWeekDays(thisday.getTime(), prevday, "Saturday");
        const sundayChanges = countWeekDays(thisday.getTime(), prevday, "Sunday");
        // ... haetaan viikko-ohjelma ...
        let days = this.getSchedule();
        // ... jotta voidaan laskea montako missattua treeniä tuohon väliin mahtus.
        total = parseInt(total) + parseInt(days[0]) * parseInt(mondayChanges);
        total = parseInt(total) + parseInt(days[1]) * parseInt(tuesdayChanges);
        total = parseInt(total) + parseInt(days[2]) * parseInt(wednesdayChanges);
        total = parseInt(total) + parseInt(days[3]) * parseInt(thursdayChanges);
        total = parseInt(total) + parseInt(days[4]) * parseInt(fridayChanges);
        total = parseInt(total) + parseInt(days[5]) * parseInt(saturdayChanges);
        total = parseInt(total) + parseInt(days[6]) * parseInt(sundayChanges);
        console.log("Mahdollisuuksia on nyt ollut: " + total);
        // Lopulta muutetaan youhadyourchange[gorman...] localstorageen uusi arvo.
        localStorage.setItem('youhadyourchange', parseInt(total));
    }

    // Tää antaa yksinkertaisesti numerona sen, kuinka monta mahdollisuutta on aikojen alusta ollut
    static getNumOfChanges() {
        const mahikset = localStorage.getItem('youhadyourchange');
        if (isNaN(mahikset)) {
            localStorage.setItem('youhadyourchange', 0);
            return 0;
        }
        return parseInt(mahikset, 10);
    }

    // Tää lukee effortit (eli tallennetut "mä tein tän" plänin) ja .lenght kertoo montaks niitä oli.
    // Yllättäen pieChart dataa.
    static getEffortsCount() {
        const efforts = JSON.parse(localStorage.getItem('efforts')) || [];
        return efforts.length;
    }
    
    // Tää palauttaa ne indexit, joissa on tämä päivä. Tällä siis lasketaan treenien määrät + helpotetaan päivähakua
    /*  Ei käytössä enää, mutta tässä on hyvii juttui. En tuhoa viel.
    static workingHard(weekday) { 
        const plans = this.getPlans();
        const todos = [];
        plans.forEach((plan, index) => {
            if (plan.weekDay == weekday) {
                todos.push(index);
            }
        });
        return todos;
    }
    */ 

    static updatePlan(index, thisplan) {
        console.log("Saving Edited: "+index+": "+thisplan.name);
        const weekdayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const plans = this.getPlans();
        const changes = this.getSchedule();
        if (index >= 0 && index < plans.length) {
            const prevday = plans[index].weekDay; // Otetaan talteen tämän plänin aikaisempi schedule
            plans[index] = thisplan; // Päivitetään tämä pläni uudella datalla
            const newday = plans[index].weekDay; // Otetaan talteen tämän plänin uusi schedule
            console.log("Calling for Updating day: "+newday);
            this.delSchedule(prevday); // Vähennetään yksi pläni pois aikaisemmalta päivältä
            this.addSchedule(newday); // Lisätään uuteen päivään.
            this.setPlans(plans); // Päivitetään Plänit uudella versiolla.
            this.countChanges(); // Lasketaan mahdollisuudet uudelleen, koska schedule muuttu.
            console.log(`Updated plan at index ${index}: ${JSON.stringify(thisplan)}`);
          } else {
            console.log(`Invalid index: ${index}`);
          }

    }

    // Haetaan vain yhden plänin tiedot lomaketta varten (editti)
    static fetchPlanData(thisID) {
        // thisID tulee kutsulta. Se saadaan kutsulle HTML napista, johon se on tungettu (kts. displaAllPlans)
        console.log("Looking for: "+thisID);
        const plans = this.getPlans();
        const thePlan = plans[thisID];
        return thePlan;
    }
    // Tää on se taika. Näytetään siis tämän päivän eventit. Tässä kohtaa ollaan vielä etusivulla ja kutsussa 
    // tulee mukana päivä, joka halutaan. Tää luuppaa plänien läpi ja ottaa ne joissa päivä mätsää.
    static showPlansByWeekday(weekday) {
        const plans = this.getPlans();
        // Divi johon nää tungetaan.
        const plansContainer = document.getElementById('doToday');
        // Ja tyhjätää se, jos vaikka siellä olikin jotain.
        plansContainer.innerHTML = '';
        // Tähän tulee plänien otsikko, joka määritellään funkkarin lopussa.
        const planHeader = document.getElementById('planHeader');
        // Kuha laskis plänejä.
        let counter = 0;
        
        plans.forEach((plan, index) => {
                if ((plan.weekDay == weekday) && (plan.active)) { // jos weekday täsmää ja pläni on aktive
                    // Obs - == on syystä. Jos vaikka tyyppi ei täsmää, mutta muuten on sama.
                
                const planDiv = document.createElement('div');
                planDiv.classList.add('todaysplans');
                planDiv.innerHTML = `
                    <h3>${plan.name}</h3>
                    ${plan.type === 'bodyBuilding' ? `How many: ${plan.reps}<br>Sets or acts: ${plan.sets}<br>` : ''}
                    ${plan.type === 'aerobic' ? `What to do: ${plan.aerobicType}<br>How to measure: ${plan.aerobicMetric}<br>` : ''}
                    <button class="deeds" data-plan-uniqueid="${plan.uniqueId}">Did or not?</button>
                `;
                counter++;
                plansContainer.appendChild(planDiv);
            }
        });
        // Ja lopuks tosiaan laitetaan otsikko sen mukaan, oliko löytöjä.
        if (counter > 0) {
            planHeader.innerHTML = "<h2>Your plans for Today</h2>";
        } else {
            planHeader.innerHTML = "<h2>Nothing to do!</h2><p>This might be a good thing, or a bad thing. It is up to you. This is not a rest-day so you can still choose! Or fix it and add a plan for today!</p>";
        }
        // Löydöksien napit aktivoidaan. 
        deedsDoneClickListener();
    }


    // Display All Plans on editorin toiminto. Plani editorissa näytetään kaikki pläänit.
    static displayAllPlans() {
        const plans = this.getPlans();
        const plansContainer = document.getElementById('plansContainer');
        // Käännetää numerona oleva päivä ihmisen kielelle tämän taulun avulla.
        const weekdayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        plansContainer.innerHTML = '';
        plans.forEach((plan, index) => {
            const thisID = index;
            const planDiv = document.createElement('div');
            planDiv.classList.add('planlist');
            planDiv.innerHTML = `
                <h3>${plan.name}</h3>
                ${plan.type === 'bodyBuilding' ? `<strong>Bodybuilding</strong><br>` : ''}
                ${plan.type === 'aerobic' ? `<strong>Aerobic</strong><br>` : ''}
                ${plan.type === 'rest' ? `<strong>Rest day</strong><br>` : ''}
                ${plan.type === 'weighting' ? `<strong>Weighting day</strong><br>` : ''}
                Planned for every <strong>${weekdayNames[plan.weekDay]}</strong><br>
                ${plan.type === 'bodyBuilding' ? `Reps: ${plan.reps}<br>Sets: ${plan.sets}<br>` : ''}
                ${plan.type === 'aerobic' ? `Aerobic Type: ${plan.aerobicType} <br>Aerobic Metric: ${plan.aerobicMetric}<br>` : ''}
                Plan Active? ${plan.active ? 'Yes' : '<span style="color: red">No</span>'}<br>
                <small>Unique ID: ${plan.uniqueId}</small><br>
                <input type="button" id="editPlan" value="Edit Plan" class="planeditor" data-plan-id="${thisID}"> | <input type="button" id="deletePlan" value="Delete Plan" class="plandeletor" data-plan-id="${thisID}">
            `;
            plansContainer.appendChild(planDiv);
        });
        // Lisätään vielä deletenapit.
        addDeletePlanButtonClickListeners();
    }

    // add ja del Schedulet hallinnoi viikko-ohjelman ylläpitoa.
    static addSchedule(day) {
        console.log("Updating day: "+day);
        const shed = this.getSchedule();
        shed[day]++;
        this.setSchedule(shed);
    }

    static delSchedule(day) {
        console.log("Updating day: "+day);
        const shed = this.getSchedule();
        shed[day]--;
        if (shed[day] < 0) {
            shed[day] = 0;
        }
        this.setSchedule(shed);
    }
}




// Tällä funktiolla kirjoitetaan asetuskenttiin nykyiset datat. 
// Minimum Viable Product lähti tästä koodista. :D Tätä käytetään tämän skritpin lopussa.
function populateInputFields() {
    document.getElementById('setStartDate').value = userData.data.startDate;
    document.getElementById('setName').value = userData.data.name;
    document.getElementById('setTarget').value = userData.data.targetWeight;
    document.getElementById('setStart').value = userData.data.startWeight;
    document.getElementById('setAge').value = userData.data.age;
    document.getElementById('setGender').value = userData.data.gender;
    document.getElementById('setWaist').value = userData.data.currentWaist;
}



function isLocalStorageSupported() {
    try {
        const testKey = 'testLocalStorageSupport';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

// Lasketaan kuinka monta mitäkin päivää oli synkkayksien välissä. 
// Jos käyttäjä ajaa tätä ohjelmaa päivittäin, niin tää antaa yleensä vain yhden päivän, mutta jos 
// käyttäjä jättää päiviä välistä, niin saadaan parempaa dataa jo...
// Tää meinas hajottaa pienen ihmisen... :D
function countWeekDays(syncDate, prevDate, needleDay) {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const needle = weekdays.indexOf(needleDay);
    const oneDay = 24 * 60 * 60 * 1000; // Yks päivä millisekuntteina.
    console.log(syncDate+" : "+prevDate+" : "+needleDay);
    let counts = 0;
    // Asetetaan ajat ja nollataan niiden minuutit, jotta voidaan verrata järkevästi.
    let startDate = new Date(+prevDate);
    startDate.setHours(0, 0, 0, 0);
    let targetDate = new Date(+syncDate);
    targetDate.setHours(0, 0, 0, 0);
    // Jep. Jos vertailu tapahtuu tasan samalla sekunnilla, on resulttina mäyhem.
    console.log(startDate);
    while (startDate < targetDate) {
        console.log("Uijui!");
        if (startDate.getDay() == needle) {
            counts++;
        }
      startDate.setTime(startDate.getTime() + oneDay);
    }
    // Lopulta palautetaan kuinka monta needleday päivää tässä välissä oli.
    return counts;
  }


userData.loadFromLocalStorage();
populateInputFields();
