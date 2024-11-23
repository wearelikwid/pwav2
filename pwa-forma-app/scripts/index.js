document.addEventListener('DOMContentLoaded', function() {
    const weeksContainer = document.getElementById('weeks-container');
    let weeksHTML = '';
    let weekNumber = 1;
    
    function checkNextWeek() {
        fetch(`workouts/week${weekNumber}.json`)
            .then(response => response.json())
            .then(data => {
                // Add the week section to HTML
                weeksHTML += createWeekSection(weekNumber);
                weekNumber++;
                checkNextWeek(); // Check for next week
            })
            .catch(error => {
                // No more workout files found or error occurred
                if (weekNumber === 1) {
                    weeksContainer.innerHTML = '<div class="error-message">No workout files found</div>';
                } else {
                    weeksContainer.innerHTML = weeksHTML;
                    
                    // Load saved progress
                    loadProgress();
                    
                    // Add click handlers to all complete buttons
                    document.querySelectorAll('.complete-button').forEach(button => {
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            const week = this.dataset.week;
                            const type = this.dataset.type;
                            toggleWorkoutCompletion(week, type, this);
                        });
                    });
                }
            });
    }
    
    // Start checking for workout files
    checkNextWeek();
});

function createWeekSection(weekNumber) {
    return `
        <div class="week-section">
            <h2>Week ${weekNumber}</h2>
            <div class="workout-links">
                <div class="workout-item">
                    <a href="workout.html?week=${weekNumber}&type=upperBody" class="workout-link" data-week="${weekNumber}" data-type="upperBody">Upper Body</a>
                    <button class="complete-button" data-week="${weekNumber}" data-type="upperBody">✓</button>
                </div>
                <div class="workout-item">
                    <a href="workout.html?week=${weekNumber}&type=lowerBody" class="workout-link" data-week="${weekNumber}" data-type="lowerBody">Lower Body</a>
                    <button class="complete-button" data-week="${weekNumber}" data-type="lowerBody">✓</button>
                </div>
                <div class="workout-item">
                    <a href="workout.html?week=${weekNumber}&type=core" class="workout-link" data-week="${weekNumber}" data-type="core">Core</a>
                    <button class="complete-button" data-week="${weekNumber}" data-type="core">✓</button>
                </div>
                <div class="workout-item">
                    <a href="workout.html?week=${weekNumber}&type=fullBody" class="workout-link" data-week="${weekNumber}" data-type="fullBody">Full Body</a>
                    <button class="complete-button" data-week="${weekNumber}" data-type="fullBody">✓</button>
                </div>
            </div>
        </div>
    `;
}

function toggleWorkoutCompletion(week, type, button) {
    let completedWorkouts = [];
    const savedProgress = localStorage.getItem('workoutProgress');
    
    if (savedProgress) {
        completedWorkouts = JSON.parse(savedProgress);
    }

    const workoutItem = button.closest('.workout-item');
    const workoutLink = workoutItem.querySelector('.workout-link');
    const workoutIndex = completedWorkouts.findIndex(workout => 
        workout.week === week && workout.type === type);

    if (workoutIndex === -1) {
        // Add to completed workouts
        completedWorkouts.push({ week, type });
        workoutLink.classList.add('completed');
        button.classList.add('active');
    } else {
        // Remove from completed workouts
        completedWorkouts.splice(workoutIndex, 1);
        workoutLink.classList.remove('completed');
        button.classList.remove('active');
    }

    localStorage.setItem('workoutProgress', JSON.stringify(completedWorkouts));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('workoutProgress');
    if (savedProgress) {
        const completedWorkouts = JSON.parse(savedProgress);
        completedWorkouts.forEach(workout => {
            const selector = `.workout-link[data-week="${workout.week}"][data-type="${workout.type}"]`;
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('completed');
                const button = element.closest('.workout-item').querySelector('.complete-button');
                if (button) {
                    button.classList.add('active');
                }
            }
        });
    }
}
