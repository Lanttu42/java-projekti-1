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
script.js
index.html
*/


// Nämä napit ovat käyttäjäeditoinnissa.
const editButton = document.getElementById('editPersonal');
const cancelEditButton = document.getElementById('cancelEdit');
const saveEditButton = document.getElementById('saveEdit');
// Tällä haetaan kaikki kentät, jotka liityy käyttäjän asetuksiin
const userSettingInputs = document.querySelectorAll('.userSetting');

// Sitten itse pihviin. 
const planTypeSelect = document.getElementById('planType');
const bodyBuildingFields = document.getElementById('bodyBuildingFields');
const aerobicFields = document.getElementById('aerobicFields');
const weightingFields = document.getElementById('weightingFields');
const restingFields = document.getElementById('restingFields');

// Kun uutta pläniä luodaan, niin modifioin formia sen mukaan, mitä on valittuna.
planTypeSelect.addEventListener('change', function() {
    const selectedOption = planTypeSelect.value;
    
    if (selectedOption === 'bodyBuilding') {
        bodyBuildingFields.style.display = 'block';
        aerobicFields.style.display = 'none';
        weightingFields.style.display = 'none';
        restingFields.style.display = 'none';
    } else if (selectedOption === 'aerobic') {
        bodyBuildingFields.style.display = 'none';
        aerobicFields.style.display = 'block';
        weightingFields.style.display = 'none';
        restingFields.style.display = 'none';
    } else if (selectedOption === 'rest') {
        bodyBuildingFields.style.display = 'none';
        aerobicFields.style.display = 'none';
        weightingFields.style.display = 'none';
        restingFields.style.display = 'block';
    } else if (selectedOption === 'weighting') {
        bodyBuildingFields.style.display = 'none';
        aerobicFields.style.display = 'none';
        weightingFields.style.display = 'block';
        restingFields.style.display = 'none';
    } else {
        bodyBuildingFields.style.display = 'none';
        aerobicFields.style.display = 'none';
        weightingFields.style.display = 'none';
        restingFields.style.display = 'none';
    }
});


// Ehkä laiskuutta, mutta ehkä ehkä ei. index.html:ssä on eri kenttien nimet, joten mäppäsin ne.
const fieldToPropertyMap = {
    setName: 'name',
    setTarget: 'targetWeight',
    setStart: 'startWeight',
    setAge: 'age',
    setGender: 'gender',
    setWaist: 'currentWaist',
    setStartDate: 'startDate'
};

// Laitetaans napeille toiminnot clikkiin. (Tää on user profiilin editti)
editButton.addEventListener('click', enableEdit);
cancelEditButton.addEventListener('click', cancelEdit);
saveEditButton.addEventListener('click', saveEdit);

// Tää on profiilin muokkauksen editti
function enableEdit() {
    editButton.style.visibility = 'hidden';
    cancelEditButton.style.visibility = 'visible';
    saveEditButton.style.visibility = 'visible';
    userSettingInputs.forEach(field => {
        field.removeAttribute('disabled');
    });
}

// Profiilin muokkauksen Cancel Edit
function cancelEdit() {
    editButton.style.visibility = 'visible';
    cancelEditButton.style.visibility = 'hidden';
    saveEditButton.style.visibility = 'hidden';
    // Ei tehtykkää! Palautetaan vanhat.
    populateInputFields();
    userSettingInputs.forEach(field => {
        field.setAttribute('disabled', 'true');
    });
}

// Profiilin muokkauksen tallennus
function saveEdit() {
    editButton.style.visibility = 'visible';
    cancelEditButton.style.visibility = 'hidden';
    saveEditButton.style.visibility = 'hidden';

    // versio 2.0 - Nyt ei tarvii enää muuttaa tätä jos lisään kenttii! Wohou!
    updateUserAndSave();
    userSettingInputs.forEach(field => {
        field.setAttribute('disabled', 'true');
    });
}

function updateUserAndSave() {
    userSettingInputs.forEach(input => {
        const fieldName = input.id;
        const fieldValue = input.value;
        // Tämä kohta meinas tappaa mut, kun en muistanut, että inputit on eri nimisii ku classin propertyt.
        const propertyName = fieldToPropertyMap[fieldName]; // Vaihdetaanpas nimeä kartan avulla...
        userData.data[propertyName] = fieldValue; // Käytetään mäpättyä nimeä
        userData.data[fieldName] = fieldValue;
    });
    userData.saveToLocalStorage();
}





function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.classList.remove('active'); 
    });

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }

    const selectedLink = document.querySelector(`.nav a[href="#${pageId}"]`);
    if (selectedLink) {
        selectedLink.classList.add('active'); 
    }
    console.log(pageId);
    if (pageId === "page1") {
        const todayIs = new Date();
        let today = todayIs.getDay() - 1;
        if (today < 0) {
            today = 6;
        }
        TrainingPlan.showPlansByWeekday(today);
    }
}


// Tallennusnappulan konffaus

document.getElementById('saveNewPlan').addEventListener('click', function() {
    // Uuh - kerätääns inputteja...
    const newname = document.getElementById('planName').value;
    const weekDay = document.getElementById('planWeekDay').value;
    const active = document.getElementById('planActive').checked;
    const type = document.getElementById('planType').value;
    const reps = document.getElementById('reps').value;
    const sets = document.getElementById('sets').value;
    const aerobicType = document.getElementById('aerobicType').value;
    const aerobicMetric = document.getElementById('aerobicMetric').value;
    var validationError = "";
    document.getElementById('newPlanError').innerHTML = "";
    
    if (!(typeof newname !== 'undefined' && newname !== '')) {
        validationError = "Name must be defined.<br>"+newname;
    }
    if (weekDay === 'none') {
         validationError += "Weekday is missing<br>";
    }
    if (!(type === "noSelection")) {   
        if (type === "bodyBuilding") {
            if (!reps) {
                validationError += "<br>Repeats must be defined";
            }
            if (!sets) {
                validationError += "<br>How many sets must be defined";
            }
         }
         if (type ==="aerobic") {
            if (!aerobicType) {
                validationError += "<br>Aerobic Type must be defined";
            }
            if (!aerobicMetric) {
                validationError += "<br>Aerobic Metric Type must be defined";
            }
        }
    } else {
        validationError += "AerobicType is not defined.<br>";
    }
    if (validationError) {
        document.getElementById('newPlanError').innerHTML = validationError;
        document.getElementById('newPlanError').style.display = "block";
    } else {
        console.log("OK. Creating new Plan!");
        const uniqueId = generateUniqueId();
        const latestPlan = new TrainingPlan({
            name: newname,
            weekDay: weekDay,
            active: active,
            type: type,
            reps: reps,
            sets: sets,
            aerobicType: aerobicType,
            aerobicMetric: aerobicMetric,
            uniqueId: uniqueId});
        latestPlan.saveThePlan();
        TrainingPlan.displayAllPlans();
        addEditPlanButtonClickListeners();

        
    }


});

// Edit-Modaali esiin
function showModal(thisplanid) {
    console.log("Fetching this: "+ thisplanid);
    const modalContainer = document.querySelector('.modaledit-container');
    const editContainer = document.querySelector('.modaledit');
    const thisplan = TrainingPlan.fetchPlanData(thisplanid);
    editfields = `
    <div class="Planbox" id="planEdit">
    <h3>Edit Plan</h3>
    <div id="editError"></div>
    <div>
        <label for="editPlanName">Plan Name:</label><br>
        <input type="text" name="editPlanName" id="editPlanName" value=${thisplan.name}>
    </div>
    <div id="editError"></div>
    <div>
    <label for="editPlanWeekDay">Day of the week:</label><br>
   <select name="editPlanWeekDay" id="editPlanWeekDay">
        <option value="0" ${thisplan.weekDay === '0' ? `Selected` : ''}>Mondays</option>
        <option value="1" ${thisplan.weekDay === '1' ? `Selected` : ''}>Tuesdays</option>
        <option value="2" ${thisplan.weekDay === '2' ? `Selected` : ''}>Wednesdays</option>
        <option value="3" ${thisplan.weekDay === '3' ? `Selected` : ''}>Thursdays</option>
        <option value="4" ${thisplan.weekDay === '4' ? `Selected` : ''}>Fridays</option>
        <option value="5" ${thisplan.weekDay === '5' ? `Selected` : ''}>Saturdays</option>
        <option value="6" ${thisplan.weekDay === '6' ? `Selected` : ''}>Sundays</option>
    </select><br>
                <label for="editPlanActive">Active?</label>
    <input type="checkbox" ${thisplan.active ? `checked` : ''} name="editPlanActive" id="editPlanActive">
    <label for="editPlanType">Plan type:</label>
    <select name="editPlanType" id="editPlanType">
        <option value="bodyBuilding" ${thisplan.type === 'bodyBuilding' ? `Selected` : ''}>Body Building</option>
        <option value="aerobic" ${thisplan.type === 'aerobic' ? `Selected` : ''}>Aerobic</option>
        <option value="rest" ${thisplan.type === 'rest' ? `Selected` : ''}>Rest</option>
        <option value="weighting" ${thisplan.type === 'weighting' ? `Selected` : ''}>Weighting</option>
        
    </select>
    
    <!-- Body Building Fields -->
    <div id="editBodyBuildingFields" style="display:  ${thisplan.type === 'bodyBuilding' ? `block` : 'none'};">
        <label for="editReps">Reps:</label>
        <input type="text" name="editReps" id="editReps" value="${thisplan.reps}">
        <label for="editSets">Sets:</label>
        <input type="text" name="editSets" id="editSets" value="${thisplan.sets}">
    </div>
    
    <!-- Aerobic Fields -->
    <div id="editAerobicFields" style="display: ${thisplan.type === 'aerobic' ? `block` : 'none'};">
        <label for="editAerobicType">Aerobic Type:</label>
        <input type="text" name="editAerobicType" id="editAerobicType" value="${thisplan.aerobicType}">
        <label for="editAerobicMetric">Aerobic Metric:</label>
        <input type="text" name="editAerobicMetric" id="editAerobicMetric" value="${thisplan.aerobicMetric}">
    </div>

    <!-- Weighting Fields -->
    <div id="editWeightingFields" style="display: ${thisplan.type === 'weighting' ? `block` : 'none'};">
         <p>Weighting day means that there should be no other plans assigned for this day. Record the weight and rest.</p>
    </div>

    <!-- Resting Fields -->
    <div id="editRestingFields" style="display: ${thisplan.type === 'rest' ? `block` : 'none'};">
        <p>Resting day means that there should definetly be no other plans. Just netflix and chill.</p>
   </div>
   <input type=text" hidden name="uniqueId" id="uniqueId" value="${thisplan.uniqueId}">
   <input type="button" id="saveEditedPlan" value="Save plan" data-plan-id="${thisplanid}"><input type="button" id="cancelPlanEdit" value="Cancel">
</div>
`;
    
    
    editContainer.innerHTML = editfields;
    const cancelPlanEdit = document.getElementById('cancelPlanEdit');
    cancelPlanEdit.addEventListener('click', hideModal);
    addSaveEditedPlanButtonClickListeners();
    // Lomakkeille dynaamisuutta (Täähän siis vain toistaa uuden tekemisen... )
    const planTypeSelect = document.getElementById('editPlanType');
    const bodyBuildingFields = document.getElementById('editBodyBuildingFields');
    const aerobicFields = document.getElementById('editAerobicFields');
    const weightingFields = document.getElementById('editWeightingFields');
    const restingFields = document.getElementById('editRestingFields');
    planTypeSelect.addEventListener('change', function() {
        const selectedOption = planTypeSelect.value;
        
        // Show/hide the additional fields based on the selected option
        if (selectedOption === 'bodyBuilding') {
            bodyBuildingFields.style.display = 'block';
            aerobicFields.style.display = 'none';
            weightingFields.style.display = 'none';
            restingFields.style.display = 'none';
        } else if (selectedOption === 'aerobic') {
            bodyBuildingFields.style.display = 'none';
            aerobicFields.style.display = 'block';
            weightingFields.style.display = 'none';
            restingFields.style.display = 'none';
        } else if (selectedOption === 'rest') {
            bodyBuildingFields.style.display = 'none';
            aerobicFields.style.display = 'none';
            weightingFields.style.display = 'none';
            restingFields.style.display = 'block';
        } else if (selectedOption === 'weighting') {
            bodyBuildingFields.style.display = 'none';
            aerobicFields.style.display = 'none';
            weightingFields.style.display = 'block';
            restingFields.style.display = 'none';
        } else {
            bodyBuildingFields.style.display = 'none';
            aerobicFields.style.display = 'none';
            weightingFields.style.display = 'none';
            restingFields.style.display = 'none';
        }
    });
    // Ja lopuksi näytetään valmisteltu Divi-modaali
    modalContainer.style.display = 'block';
}

// Edit-Modaali piiloon
function hideModal() {
    const modalContainer = document.querySelector('.modaledit-container');
    modalContainer.style.display = 'none';
}

// Deletenapin määrittely
function addDeletePlanButtonClickListeners() {
    const deletePlan = document.querySelectorAll('.plandeletor');
  

// Tää on antaa verbose alerting, koska tuo clickki jää jumiin, kunnes käyttäjä sanoo jotain. Korjaan joskus.
    deletePlan.forEach(button => {
      button.addEventListener('click', function() {
        const planID = this.getAttribute('data-plan-id');
        const plans = JSON.parse(localStorage.getItem('plans')) || [];
        const planName = plans[planID].name; // Get the plan name
        const confirmDelete = window.confirm(`Are you sure you want to delete the plan "${planName}"?`);
        if (confirmDelete) {
            TrainingPlan.deletePlan(planID);
            console.log("Sinne men.");
        }
      });
    });
  }



// Tää on samoin kuin se uusi Pläni. Hieman kakkelia nimeämistä, mutta koodi kehitty enkä jaksa enää editoida.
function addEditPlanButtonClickListeners() {
    const editPlanButtons = document.querySelectorAll('.planeditor');
  
    editPlanButtons.forEach(button => {
      button.addEventListener('click', function() {
        const planID = this.getAttribute('data-plan-id');
        showModal(planID);
      });
    });
  }




  function addSaveEditedPlanButtonClickListeners() {
    const editButton = document.getElementById('saveEditedPlan');
    editButton.addEventListener('click', function() {
        const uniqueId = document.getElementById('uniqueId').value;
        const planID = this.getAttribute('data-plan-id');
        const newname = document.getElementById('editPlanName').value;
        const weekDay = document.getElementById('editPlanWeekDay').value;
        const active = document.getElementById('editPlanActive').checked;
        const type = document.getElementById('editPlanType').value;
        const reps = document.getElementById('editReps').value;
        const sets = document.getElementById('editSets').value;
        const aerobicType = document.getElementById('editAerobicType').value;
        const aerobicMetric = document.getElementById('editAerobicMetric').value;
        var validationError = "";
        errorField = document.getElementById('editError')
        errorField.innerHTML = "";
    
    if (!(typeof newname !== 'undefined' && newname !== '')) {
        validationError = "Name must be defined.<br>"+newname;
    }
    // UUh! ChatGPT apuja! + merkki eteen, niin stringiä käsitellään integerinä. :)
    if ((+weekDay < 0) || (+weekDay > 6)) {
         validationError += "Weekday is missing<br> Provided WeekDay: "+weekDay ;
    }
    if (!(type === "noSelection")) {   
        if (type === "bodyBuilding") {
            if (!reps) {
                validationError += "<br>Repeats must be defined";
            }
            if (!sets) {
                validationError += "<br>How many sets must be defined";
            }
         }
         if (type ==="aerobic") {
            if (!aerobicType) {
                validationError += "<br>Aerobic Type must be defined";
            }
            if (!aerobicMetric) {
                validationError += "<br>Aerobic Metric Type must be defined";
            }
        }
    } else {
        validationError += "AerobicType is not defined.<br>";
    }
    if (validationError) {
        errorField.innerHTML = validationError;
        errorField.style.display = "block";
    } else {
        // Let save if!
        const editedPlan = {
            name: newname,
            weekDay: weekDay,
            active: active,
            type: type,
            reps: reps,
            sets: sets,
            aerobicType: aerobicType,
            aerobicMetric: aerobicMetric,
            uniqueId: uniqueId
          };
        TrainingPlan.updatePlan(planID, editedPlan);
        hideModal();
        TrainingPlan.displayAllPlans();
        addEditPlanButtonClickListeners();
        addDeletePlanButtonClickListeners();
  
    }




        
      });
  }

// Tällä tunnistetaan, että mitä käyttäjä just teki planeista ja mitkä siis on tehty.
// Tämä on siis uniqueID ilman kirjastoja. :)
  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const randomValue = Math.floor(Math.random() * 10000); 
    return `${timestamp}-${randomValue}`;
  }

  // Laitetaan tehtävä merkatuksi, jos didit -buttonia klikataan.
  function deedsDoneClickListener() {
    doneButtons = document.querySelectorAll('.deeds');
    const efforts = JSON.parse(localStorage.getItem('efforts')) || [];
    const s = new Date();
    s.setHours(0, 1, 0, 0);
    preFix = s.getTime();
    doneButtons.forEach(button => {
      let uniqueId = button.getAttribute('data-plan-uniqueid');
      console.log("preFix: "+preFix);
      let thisId = preFix + uniqueId;
      console.log("This ID: "+thisId);
      button.addEventListener('click', function () {
        if (isEffortDone(thisId)) {
            console.log("Uhm... Possible!");
          const indexToRemove = efforts.findIndex(item => item === thisId);
          efforts.splice(indexToRemove, 1);
          localStorage.setItem('efforts', JSON.stringify(efforts));
          button.textContent = 'I have Done it!';
          button.style = "background-color: lightgreen";
          freshstart();
        } else {
          // Kello 21.27... deadline lähestyy. Olisimpa tehnyt maitokauppalistan...
          console.log("Uhm... No, it wasn't done!");
          efforts.push(thisId);
          localStorage.setItem('efforts', JSON.stringify(efforts));
          button.textContent = 'I lied! Remove this!';
          button.style = "background-color: red";
          freshstart();
        }
      });
  
      
      if (isEffortDone(thisId)) {
        button.textContent = 'I lied! Remove this!';
        button.style = "background-color: red";
      } else {
        button.textContent = 'I have Done it!';
        button.style = "background-color: lightgreen";
      }
    });
  }
    // Tsekataan onko Efforti tehty
    function isEffortDone(uniqueId) {
        console.log("Now checking if it is done...");
        const efforts = JSON.parse(localStorage.getItem('efforts')) || [];
        return efforts.includes(uniqueId); // Palauttaa true / false
      }
    

    // Laitetaan tehtävä epämerkatuksi, jos undidit -buttonia klikataan.
    function markItDoneClickListener() {
        doneButtons = document.querySelectorAll('undidits')
        doneButtons.forEach(button => {
            button.addEventListener('click', function() {
                const efforts = JSON.parse(localStorage.getItem('efforts')) || [];
                const uniqueId = this.getAttribute('data-plan-uniqueid');
                efforts.push(uniqueId);
                localStorage.setItem('efforts', JSON.stringify(efforts));
            });
         });
      }

// Täytetään quickstatusta ja piirretää piechartti
function freshstart() {
    const quickStatus = document.getElementById('quickstatus');
    const piirakka = document.getElementById('thatpie');
    const myChanges = TrainingPlan.getNumOfChanges();
    const myEfforts = TrainingPlan.getEffortsCount();
    const mySuccess = myEfforts / myChanges * 100;
    quickStatus.innerHTML = "Possible Training days: "+myChanges+" Your efforts: "+myEfforts;
    quickStatus.innerHTML += "<br><h1>Your Current process</h1>";
    piirakka.innerHTML = parseInt(mySuccess)+"%";
    piirakka.style = "--p:"+mySuccess+";--b:10px;--c: green;";
}

function thisday() {
    const todayIs = new Date();
    let today = todayIs.getDay() - 1;
    if (today < 0) {
        today = 6;
    }
    return today;
}

// Lets roll!
TrainingPlan.displayAllPlans();
addEditPlanButtonClickListeners();
addDeletePlanButtonClickListeners();
TrainingPlan.countChanges();
TrainingPlan.showPlansByWeekday(thisday());
freshstart();