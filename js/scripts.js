/*  John Layher JS-Project-5-Public-API-Requests
 *  I want my project to be graded with the exceeds expectations requirements.
 *  If my project does not meet these requirements, I would prefer for my
 *  project to be rejected.
 *  Additional information regarding Extra Credit CSS contained within the README file
*/

//Declare Global Variables
const randomUserAPI = 'https://randomuser.me/api/?results=12&nat=us';
const galleryDiv = document.getElementById('gallery');

/* Function to fetch data from API, parse to JSON, and pass this data to
 * the writeHTML function, while also catching any errors, and displaying an error msg.
*/
function getEmployees() {
  fetch(randomUserAPI)
    .then(result => result.json())
    .then(employeeData => writeHTML(employeeData.results))
    .catch(err => {
      console.log(new Error(err));
      galleryDiv.innerHTML = '<h2>An error occured when fetching user data.</h2>';
    });
}

//function to map json data, and display array elements as HTML
//also calls clickListener on every employee
const writeHTML = (employeeData) => {
  const employees = employeeData.map((employee, index)=> {
    const html =
          `<div class="card" id='${employee.name.first}${employee.name.last}'>
              <div class="card-img-container">
                  <img class="card-img" src="${employee.picture.large}" alt="${employee.name.first} ${employee.name.last}">
              </div>
              <div class="card-info-container">
                  <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                  <p class="card-text">${employee.email}</p>
                  <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
              </div>
          </div>`;
    return html;
  }).join('');
  galleryDiv.insertAdjacentHTML('beforeend',employees);
  employeeData.map((employee, index) => {
    clickListener(employee, employeeData, index)
  })
}

//click event listener to display modal window by calling createModalWindow function
function clickListener(employee, employeeData, index) {
    const modalWindow = document.getElementById(`${employee.name.first}${employee.name.last}`);
    modalWindow.addEventListener('click', e => createModalWindow(employee, employeeData, index));
}

//create modal window
function createModalWindow(employee, employeeData, index) {
  const modalDiv = document.createElement('div');
  modalDiv.className = modal-container;
  const dob = formatBday(employee.dob.date);

  const modalHTML = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.large}" alt="${employee.name.first} ${employee.name.last}">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">Cell Phone: ${employee.cell}</p>
                <p class="modal-text">Address: ${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.postcode}</p>
                <p class="modal-text">Birthday: ${dob}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`

//Remove the Previous/Next Button if the employee's index is at the beginning or
//end of the array of employees
    if(index === 0){
        modalDiv.insertAdjacentHTML('beforeend', modalHTML);
        document.querySelector('body').appendChild(modalDiv);
        document.querySelector('#modal-prev').remove();
    } else if(index === 11){
        modalDiv.insertAdjacentHTML('beforeend', modalHTML);
        document.querySelector('body').appendChild(modalDiv);
        document.querySelector('#modal-next').remove();
    } else {
        modalDiv.insertAdjacentHTML('beforeend', modalHTML);
        document.querySelector('body').appendChild(modalDiv);
        console.log(modalDiv);
    }

  //Add event listener for close button
  const closeButton = document.getElementById('modal-close-btn');
    closeButton.addEventListener('click', e => {
      modalDiv.remove();
    })

  //Add event listener for next button
  if(index<11){
    const nextButton = document.getElementById('modal-next').addEventListener('click', e => {
        modalDiv.remove();
        nextEmployee(employeeData, index)
    })
  }
  //Add event listener for previous button
  if (index>0){
    const prevButton = document.getElementById('modal-prev').addEventListener('click', e => {
      modalDiv.remove();
      prevEmployee(employeeData, index)
    })
  }
}

//Format the DOB
const formatBday = (dob) => {
  let bday = new Date (dob);
  let month = bday.getMonth();
  let day = bday.getDate();
  let year = bday.getFullYear();
  return month + '/' + day + '/' + year;
}


//Next button
const nextEmployee = (employeeData, index) => {
  let employee = employeeData[index += 1];
  createModalWindow(employee, employeeData, index);
  if (index > 11){
    document.getElementById('modal-next').style.display = 'none';
  }
}

//Previous button
const prevEmployee = (employeeData, index) => {
  let employee = employeeData[index -= 1];
  createModalWindow(employee, employeeData, index);
  if (index < 0){
    document.getElementById('modal-prev').style.display = 'none';
  }
}

//Create and Append the Search Function
//Uses 'search' function below to both filter employees as a user types, as well
//as when they click the submit button (even though this is redundant and unnecessary)
function createSearch() {
  const searchContainer = document.querySelector('.search-container');
  const form = `<form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>`;
  searchContainer.insertAdjacentHTML('beforeend', form);

  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    search(e.target[0].value);
    console.log(e.target);
  });

  document.querySelector('#search-input').addEventListener('input', e => {
    search(e.target.value);
    console.log(e.target);
  });
};
createSearch();

//function to search for users
function search(input) {
  let search = input.toLowerCase();
  let employees = galleryDiv.children;
  for (let i = 0; i< employees.length; i++) {
    let person = employees[i].querySelector('h3');
    let input = person.textContent;
    if (input.toLowerCase().indexOf(search) > -1) {
      employees[i].style.display = "";
    } else {
      employees[i].style.display = "none";
    }
  }
}

//Main Function Call
getEmployees();
