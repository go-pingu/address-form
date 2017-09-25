const form = document.getElementById("form-validate");
const requiredFields = document.getElementsByClassName("required-entry");
const lettersFields = document.getElementsByClassName("letters");
const namesListWrapper = document.getElementById("names-list-wrapper");
const firstName = document.getElementById("firstname");
const namesList = document.getElementById("names-list");
const companyName = document.getElementById('company');
const phoneNum = document.getElementById('telephone');
const eMail = document.getElementById('email');
const street1 = document.getElementById('street_1');
const street2 = document.getElementById('street_2');
const zipCode = document.getElementById('zip');
const submitButton = document.getElementById('submit-button');
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlay-content');

const lettersOnly = /^[a-zA-Z]+$/;
const numbersOnly = /^[0-9-]+$/;
const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

firstName.addEventListener('focus', autocompleteTrigger, true);
companyName.addEventListener('blur', companyVerify, true);
phoneNum.addEventListener('blur', phoneVerify, true);
eMail.addEventListener('blur', emailVerify, true);
street1.addEventListener('blur', streetVerify, true);
street2.addEventListener('blur', streetVerify, true);
zipCode.addEventListener('blur', zipVerify, true);
submitButton.addEventListener('click', formSubmit, true);

form.addEventListener("focus", function(event) {
  event.target.style.background = "#e0fcff";
}, true);
form.addEventListener("blur", function(event) {
  event.target.style.background = "";
}, true);

function autocompleteTrigger(){
  var listRequest = new XMLHttpRequest();
  listRequest.open('GET', "https://raw.githubusercontent.com/dominictarr/random-name/master/first-names.json", true);

  listRequest.onload = function(){
    var namesArray = JSON.parse(listRequest.responseText);

    firstName.addEventListener("keyup", changeInput);
    function nameFilter(val){
      if (event.target.value.length > 1 && lettersOnly.test(event.target.value) == true){
        var filteredNames = namesArray.filter(function(firstname){
          if (firstname.startsWith(event.target.value) == true){
            return firstname;
          }
        })
      } return filteredNames;
    }

    function changeInput(val, event) {
      if (nameFilter(val) == undefined){
        namesListWrapper.classList.remove('show');
      } else {
        var autoCompleteResult = nameFilter(val);
        var listContent = "";
        namesListWrapper.classList.toggle('show');
        var listItemsCounter = 1;
        for (var j = 0; j < autoCompleteResult.length; j++){
          listContent += '<option value="'+ autoCompleteResult[j] + '" id="item' + listItemsCounter +'" class="listItem">' + autoCompleteResult[j] + '</option>';
          listItemsCounter++;
        }
        namesList.insertAdjacentHTML('afterbegin', listContent);
      }
    }
  };
  listRequest.send();
}

function selectListItem(){
  var selectedOption = namesList.value;
  firstName.value = selectedOption;

  var target = event.target;
   if (event.currentTarget == target) {
      if (namesListWrapper.classList.contains('show')){
        namesListWrapper.classList.remove('show').addClass('hide');
      } else {
        namesListWrapper.classList.toggle('show');
      };
    }
  }

function addFocus(){
  for (var i = 0; i < requiredFields.length; i++){
    requiredFields[i].addEventListener('focus', function(event){
      event.target.nextElementSibling.textContent = "";
    }, true);
  }
}

function addBorder(){
  for (var i = 0; i < requiredFields.length; i++){
    requiredFields[i].addEventListener('blur', function(event){
      if (event.target.value == ""){
        event.target.style.border = "1px solid #fc3f0a";
        event.target.nextElementSibling.textContent = "This field is required"
        event.target.nextElementSibling.classList.toggle('warning-visible');
      }
    }, true);
    requiredFields[i].addEventListener('focus', function(event){
      event.target.style.border = "";
      event.target.nextElementSibling.classList.remove('warning-visible');
    }, true)
  }
}

function checkLettersOnly(){
  for (var i = 0; i < lettersFields.length; i++){
    lettersFields[i].addEventListener('blur', function(event){
      if (event.target.value != "" && lettersOnly.test(event.target.value) == false){
        event.target.nextElementSibling.textContent = "Letters only, mate!";
      } else{
        event.target.value = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
      }
    }, true);
  }
}

function companyVerify(event){
  if (/[<|>]+$/.test(event.target.value) == true){
    companyName.nextElementSibling.textContent = "Don't try to hack us! Angle brackets are forbidden";
  } else {
    companyName.nextElementSibling.textContent = "";
  }
}

function phoneVerify(event){
  if (numbersOnly.test(phoneNum.value) == false){
    phoneNum.nextElementSibling.textContent = "Numbers only, please";
  } else if (phoneNum.value.length != 9){
    phoneNum.nextElementSibling.textContent = "This number is invalid";
  }
}

function emailVerify(event){
  if (emailReg.test(eMail.value) == false){
    eMail.nextElementSibling.textContent = "Valid e-mail please. Spam is waiting";
  }
}

function streetVerify(event){
  if (/^[A-z0-9 ,/-]+$/.test(event.target.value) == false){
    event.target.nextElementSibling.textContent = "Invalid input";
  } else {
    event.target.value = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
    evet.target.nextElementSibling.textContent = "";
  }
}

function zipVerify(){
  if (numbersOnly.test(zipCode.value) == false){
    zipCode.nextElementSibling.textContent = "Numbers only, please";
  } else if (zipCode.value.length != 5){
      zipCode.nextElementSibling.textContent = "Valid zip code would be appreciated";
  }
}

function addDash(){
  zipCode.addEventListener('focus', function(){
    if (/-/.test(zipCode.value) == true){
      zipCode.value = zipCode.value.replace("-", "");
    }
  }, true);
  zipCode.addEventListener('blur', function(){
    zipCode.value = zipCode.value.replace(/(\d{2})(\d{3})/, "$1-$2");
  }, true);
}


function formSubmit(){
  var empty = true;
  for (var i = 0; i < requiredFields.length; i++){
    if (requiredFields[i].value == ""){
      empty = false;
      requiredFields[i].style.border = "1px solid #fc3f0a";
      requiredFields[i].nextElementSibling.textContent = "This field is required";
    }
  }
  if (empty){
    overlay.classList.toggle('show');
    event.stopPropagation();
  }
}

overlayContent.addEventListener('click', function(event){
  var target = event.target;
   if (event.currentTarget == target) {
      overlay.classList.remove('show');
    }

})

addFocus();
addBorder();
checkLettersOnly();
addDash();
