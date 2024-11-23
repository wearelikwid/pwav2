document.addEventListener('DOMContentLoaded', function() {
    initializeProgramForm();
});

function initializeProgramForm() {
    const form = document.getElementById('create-program-form');
    const durationInput = document.getElementById('program-duration');
    const programWeeks = document.getElementById('program-weeks');

    // Handle duration changes
    durationInput.addEventListener('change', function() {
        updateWeeks(parseInt(this.value));
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProgram();
    });
}

function updateWeeks(numWeeks) {
    const programWeeks = document.getElementById('program-weeks');
    programWeeks.innerHTML = '';

    for (let i = 1; i <= numWeeks; i++) {
        const weekElement = createWeekElement(i);
        programWeeks.appendChild(weekElement);
    }
}

function createWeekElement(weekNumber) {
    const weekDiv = document.createElement('div');
    weekDiv.className = 'program-week';
    weekDiv.innerHTML = `
        <div class='week-header'>
            <h2 class='week-title'>Week ${weekNumber}</h2>
        </div>
        <div class='week-days'></div>
        <button type='button' class='button secondary' onclick='addDay(${weekNumber})'>
            Add Training Day
        </button>
    `;
    return weekDiv;
}

function addDay(weekNumber) {
    const weekElement = document.querySelector(`.program-week:nth-child(${weekNumber})`);
    const daysContainer = weekElement.querySelector('.week-days');
    const dayNumber = daysContainer.children.length + 1;
    
    const dayElement = createDayElement(weekNumber, dayNumber);
    daysContainer.appendChild(dayElement);
}

function createDayElement(weekNumber, dayNumber) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'program-day';
    dayDiv.innerHTML = `
        <div class='day-header'>
            <h3>Day ${dayNumber}</h3>
            <button type='button' class='button secondary remove-day' onclick='removeDay(this)'>Remove Day</button>
        </div>
        <div class='workout-details'>
            <div class='form-group'>
                <input type='text' class='workout-name' placeholder='Workout Name (e.g., Full Body, Upper Body, etc.)'>
            </div>
            <div class='exercise-list' id='exercises-w${weekNumber}d${dayNumber}'></div>
            <button type='button' class='button secondary' onclick='addExercise(${weekNumber}, ${dayNumber})'>
                Add Exercise
            </button>
        </div>
    `;
    return dayDiv;
}

function removeDay(button) {
    button.closest('.program-day').remove();
}

function addExercise(weekNumber, dayNumber) {
    const exerciseList = document.getElementById(`exercises-w${weekNumber}d${dayNumber}`);
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exercise-item';
    exerciseDiv.innerHTML = `
        <div class='form-group'>
            <input type='text' placeholder='Exercise name' required>
            <input type='text' placeholder='Sets x Reps' required>
            <input type='text' placeholder='Notes (optional)'>
            <button type='button' class='button secondary' onclick='removeExercise(this)'>Remove</button>
        </div>
    `;
    exerciseList.appendChild(exerciseDiv);
}

function removeExercise(button) {
    button.closest('.exercise-item').remove();
}

function saveProgram() {
    // Collect all form data
    const programData = {
        name: document.getElementById('program-name').value,
        duration: parseInt(document.getElementById('program-duration').value),
        weeks: collectWeeksData()
    };

    // Save to localStorage
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    programs.push({
        ...programData,
        id: Date.now(),
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('programs', JSON.stringify(programs));

    // Redirect to programs list
    window.location.href = 'programs.html';
}

function collectWeeksData() {
    const weeks = [];
    const weekElements = document.querySelectorAll('.program-week');
    
    weekElements.forEach((weekElement, weekIndex) => {
        const days = [];
        const dayElements = weekElement.querySelectorAll('.program-day');
        
        dayElements.forEach((dayElement, dayIndex) => {
            const workoutName = dayElement.querySelector('.workout-name').value;
            const exercises = [];
            
            const exerciseItems = dayElement.querySelectorAll('.exercise-item');
            exerciseItems.forEach(exerciseItem => {
                const inputs = exerciseItem.querySelectorAll('input');
                exercises.push({
                    name: inputs[0].value,
                    setsReps: inputs[1].value,
                    notes: inputs[2].value
                });
            });

            days.push({
                dayNumber: dayIndex + 1,
                workoutName: workoutName,
                exercises: exercises
            });
        });

        weeks.push({
            weekNumber: weekIndex + 1,
            days: days
        });
    });

    return weeks;
}
