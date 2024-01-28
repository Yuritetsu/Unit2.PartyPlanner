const cohort = '2311-FSA-ET-WEB-PT-SF';
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohort}/events`;

const eventElement = document.querySelector('#events');
const deleteButton = document.querySelector('.delete');


const state = {
    events: [],
};

async function render() {
    await getEvent();
    renderEvent();
};

render();
console.log(state);

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete')) {
        deleteEvent();
    }
});

async function getEvent() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
};

function renderEvent() {
    if(!state.events.length) {
        eventElement.innerHTML = '<li>No Events</li>';
        return;
    }
    
    const eventPost = state.events.map((i) => {
        const li = document.createElement('li');
        li.innerHTML = `
        <h2 class='name'>${i.name}</h2>
        <h3 class='date'>Date: ${i.date}</h3>
        <h3 class='location'>Where: ${i.location}</h3>
        <p class='description'>${i.description}</p>
        <button class='delete' onClick='${deleteEvent}'>Delete</button>
        `;
        return li;
    });
    
    eventElement.replaceChildren(...eventPost);
}

async function addEvent(event) {
    event.preventDefault();
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: eventElement.name.value,
                date: eventElement.date.value,
                description: eventElement.description.value,
                location: eventElement.location.value,
            }),
        });
        
        if (!response.ok) {
            throw new Error("Failed to create Event");
        };
        
        render();
    } catch (error) {
        console.error(error);
    }
};

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete')) {
        deleteEvent(event);
    }
});

function deleteEvent(i) {
    state.events.pop(i);
    renderEvent();
}