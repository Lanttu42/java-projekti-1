// userData luokalla hallitaan käyttäjän asetuksia
class UserData {
    constructor() {
        const storedData = localStorage.getItem('userData');
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
                startDate:  new Date().toISOString().split('T')[0]
            };

            this.saveToLocalStorage();
        }
    }

    // käytetään, kun halutaan käyttäjän tiedot localstoragesta
    loadFromLocalStorage() {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            this.data = JSON.parse(storedData);
        }
    }

    // Tallennus
    saveToLocalStorage() {
        console.log("Tallentaa!!");
        console.log(this.data);
        localStorage.setItem('userData', JSON.stringify(this.data));
        const usernameFromLocalStorage = JSON.parse(localStorage.getItem('userData')).name;
        console.log(`Tallennettu: ${usernameFromLocalStorage}`);
    }

}
// Alustetaan käyttäjä
const userData = new UserData();

// TrainingPlan Class - Tällä huolletaan meidän treeniohjelmaa.
class TrainingPlan {
    constructor(name, weekDay, active, type, reps, sets, aerobicType, aerobicMetric, uniqueId) {
        this.name = name;
        this.weekDay = weekDay;
        this.active = active;
        this.type = type;
        this.reps = reps;
        this.sets = sets;
        this.aerobicType = aerobicType;
        this.aerobicMetric = aerobicMetric;
        this.uniqueId = uniqueId;

        const newchanges = JSON.parse(localStorage.getItem('changes')) || [0,0, 0, 0, 0, 0, 0]; // Ehkä tää olis kannattanut tehdä funkkarina...
        console.log("Adding new change to "+this.weekDay);
        newchanges[this.weekDay]++;

        localStorage.setItem('changes', JSON.stringify(newchanges));
        console.log("New plan created with uniqueID: "+this.uniqueId);
    }

    // Add a method to save the plan to local storage
    saveToLocalStorage() {
        const plans = JSON.parse(localStorage.getItem('plans')) || [];
        plans.push(this);
        console.log("Yes, this is saving?");
        localStorage.setItem('plans', JSON.stringify(plans));
    }


    static deletePlan(index) {
        const plans = JSON.parse(localStorage.getItem('plans')) || [];
        if (index >= 0 && index < plans.length) {
            plans.splice(index, 1);
            localStorage.setItem('plans', JSON.stringify(plans));
            console.log("PUM");
            TrainingPlan.displayAllPlans();
            addDeletePlanButtonClickListeners();
        }
    }
    
    static prevSync() {
        const thisday = new Date();
        const prevday = localStorage.getItem('prevSync');
        //let debug = new Date('2023-10-12'); // Debug - asetetaan tää päivä
        localStorage.setItem('prevSync', thisday.getTime());
        //debug = debug.getTime();
        //console.log("Palautan tän: "+debug);
        return prevday; 
        //return debug;
    }

    static countChanges() {
        let total = localStorage.getItem('youhadyourchange');
        //total = 42; // Resetoidaan mahdollisuudet DEBUG
        console.log('total is: '+total);
        const thisday = new Date();
        const prevday = this.prevSync();
        console.log("Previous sync: "+prevday);
        const mondayChanges = countWeekDays(thisday.getTime(), prevday, "Monday");
        console.log("Since your last visit, you missed "+mondayChanges+" mondays");
        const tuesdayChanges = countWeekDays(thisday.getTime(), prevday, "Tuesday");
        console.log("Since your last visit, you missed "+tuesdayChanges+" tuesdays");
        const wednesdayChanges = countWeekDays(thisday.getTime(), prevday, "Wednesday");
        console.log("Since your last visit, you missed "+wednesdayChanges+"  wednesdays");
        const thursdayChanges = countWeekDays(thisday.getTime(), prevday, "Thursday");
        console.log("Since your last visit, you missed "+thursdayChanges+" thursdays");
        const fridayChanges = countWeekDays(thisday.getTime(), prevday, "Friday");
        console.log("Since your last visit, you missed "+fridayChanges+" fridays");
        const saturdayChanges = countWeekDays(thisday.getTime(), prevday, "Saturday");
        console.log("Since your last visit, you missed "+saturdayChanges+" saturdays");
        const sundayChanges = countWeekDays(thisday.getTime(), prevday, "Sunday");
        console.log("Since your last visit, you missed "+sundayChanges+" sundays");
        let days = JSON.parse(localStorage.getItem('changes')) || [0,0, 0, 0, 0, 0, 0]; // Tässä kohtaa tavallaa toivon, ettei tuu tyhjää vastausta, mutta varaudutaan silti...
        // Tässä pitääki laskee vaan ne päivät, joilloin on treeniä!
        console.log("Your schedule has " + days[0] + "events on Mondays");
        total = parseInt(total) + parseInt(days[0]) * parseInt(mondayChanges);
        console.log("Your schedule has " + days[1] + "events on Tuesdays (Current total = " + total + ")");
        total = parseInt(total) + parseInt(days[1]) * parseInt(tuesdayChanges);
        console.log("Your schedule has " + days[2] + "events on Wednesdays (Current total = " + total + ")");
        total = parseInt(total) + parseInt(days[2]) * parseInt(wednesdayChanges);
        console.log("Your schedule has " + days[3] + "events on Thursdays (Current total = " + total + ")");
        total = parseInt(total) + parseInt(days[3]) * parseInt(thursdayChanges);
        console.log("Your schedule has " + days[4] + "events on Fridays (Current total = " + total + ")");
        total = parseInt(total) +parseInt(days[4]) * parseInt(fridayChanges);
        console.log("Your schedule has " + days[5] + "events on Saturdays (Current total = " + total + ")");
        total = parseInt(total) + parseInt(days[5]) * parseInt(saturdayChanges);
        console.log("Your schedule has " + days[6] + "events on Sundays (Current total = " + total + ")");
        total = parseInt(total) + parseInt(days[6]) * parseInt(sundayChanges);
        
        console.log("Mahdollisuuksia oli nyt: " + total);
        console.log("Torstain mahdollisuudet: " + days[6] + " torstaipäiviä oli: " + sundayChanges);
        localStorage.setItem('youhadyourchange', parseInt(total));

    }
    static getChanges() {
        const numofChanges = localStorage.getItem('youhadyourchange');
        return numofChanges;
    }
    static getEffortsCount() {
        const efforts = JSON.parse(localStorage.getItem('efforts')) || [];
        return efforts.length;
    }
    
    // Tää palauttaa ne indexit, joissa on tämä päivä. Tällä siis lasketaan treenien määrät + helpotetaan päivähakua
    static workingHard(weekday) { 
        const plans = JSON.parse(localStorage.getItem('plans')) || [];
        const todos = [];
        plans.forEach((plan, index) => {
            if (plan.weekDay == weekday) {
                todos.push(index);
            }
        });
        return todos;
    }

    static updatePlan(index, thisplan) {
        console.log("Saving Edited: "+index+": "+thisplan.name);
        const weekdayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const plans = JSON.parse(localStorage.getItem('plans')) || []; // Ehkä tää olis kannattanut tehdä funkkarina...
        const changes = JSON.parse(localStorage.getItem('changes')) || [0,0, 0, 0, 0, 0, 0]; // Ehkä tää olis kannattanut tehdä funkkarina...
        if (index >= 0 && index < plans.length) {
            const prevday = plans[index].weekDay; // Otetaan talteen tämän plänin aikaisempi schedule
            plans[index] = thisplan; // Päivitetään tämä pläni uudella datalla
            const newday = plans[index].weekDay; // Otetaan talteen tämän plänin uusi schedule
            
            changes[prevday]--; // Vähennetään yksi pläni pois aikaisemmalta päivältä
            
            if (changes[prevday] < 0) changes[prevday] = 0; // Double check, ettei menny miinukselle. ;)
            changes[newday]++; // Lisätään uuteen päivään.
            console.log(changes);
            localStorage.setItem('plans', JSON.stringify(plans));
            localStorage.setItem('changes', JSON.stringify(changes));
            this.countChanges();
            // Aijaaaa! Mä voin tallentaa suoraan tän hiton arrayn. No sinne sit vaan!
            console.log(`Updated plan at index ${index}: ${JSON.stringify(thisplan)}`);
          } else {
            console.log(`Invalid index: ${index}`);
          }

    }
    static fetchPlanData(thisID) {
        console.log("Looking for: "+thisID);
        const plans = JSON.parse(localStorage.getItem('plans')) || [];
        const thePlan = plans[thisID];
        // console.log("Found this: "+thePlan.name);
        return thePlan;
    }

    static showPlansByWeekday(weekday) {
        const plans = JSON.parse(localStorage.getItem('plans')) || [];
        const plansContainer = document.getElementById('doToday');
        const weekdayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        plansContainer.innerHTML = '';
        const planHeader = document.getElementById('planHeader');
        let counter = 0;
     
        // Loop through each plan and display it if the weekday matches
        plans.forEach((plan, index) => {
                if ((plan.weekDay == weekday) && (plan.active)) {
                const thisID = index;
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
        if (counter > 0) {
            planHeader.innerHTML = "<h2>Your plans for Today</h2>";
        } else {
            planHeader.innerHTML = "<h2>Nothing to do!</h2><p>This might be a good thing, or a bad thing. It is up to you. This is not a rest-day so you can still choose! Or fix it and add a plan for today!</p>";
        }
        deedsDoneClickListener();
    }


    static displayAllPlans() {
        const plans = JSON.parse(localStorage.getItem('plans')) || [];
        const plansContainer = document.getElementById('plansContainer');
        const weekdayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        plansContainer.innerHTML = '';


        // Loop through each plan and display it
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

    }
}




// Tällä funktiolla kirjoitetaan asetuskenttiin nykyiset datat.
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

// Get available storage space in bytes
function getLocalStorageSpace() {
    try {
        if ('localStorage' in window && window['localStorage'] !== null) {
            const usedSpace = JSON.stringify(localStorage).length;
            const totalSpace = 5 * 1024 * 1024; // 5 MB (typical default limit)
            const remainingSpace = totalSpace - usedSpace;
            return { used: usedSpace, total: totalSpace, remaining: remainingSpace };
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}
// Check if LocalStorage is supported and get available space
const localStorageSupported = isLocalStorageSupported();
const localStorageSpace = getLocalStorageSpace();

console.log('LocalStorage Supported:', localStorageSupported);
if (localStorageSupported) {
    console.log('Used Storage Space:', localStorageSpace.used + ' bytes');
    console.log('Total Storage Space:', localStorageSpace.total + ' bytes');
    console.log('Remaining Storage Space:', localStorageSpace.remaining + ' bytes');
}

// Lasketaan kuinka monta mitäkin päivää oli synkkayksien välissä. 
// Jos käyttäjä ajaa tätä ohjelmaa päivittäin, niin tää antaa yleensä vain yhden päivän, mutta jos 
// käyttäjä jättää päiviä välistä, niin saadaan parempaa dataa jo...
function countWeekDays(syncDate, prevDate, needleDay) {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const needle = weekdays.indexOf(needleDay);
    const oneDay = 24 * 60 * 60 * 1000; // Yks päivä millisekuntteina.
    console.log(syncDate+" : "+prevDate+" : "+needleDay);
    let counts = 0;
    let startDate = new Date(+prevDate);
    startDate.setHours(0, 0, 0, 0);
    let targetDate = new Date(+syncDate);
    targetDate.setHours(0, 0, 0, 0);
    console.log(startDate);
    while (startDate < targetDate) {
        console.log("Uijui!");
        if (startDate.getDay() == needle) {
            counts++;
        }
      startDate.setTime(startDate.getTime() + oneDay);
    }
    return counts;
  }


userData.loadFromLocalStorage();
populateInputFields();
