document.addEventListener('DOMContentLoaded', function() {
    loadPrograms();
});

function loadPrograms() {
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    displayPrograms(programs);
}

function displayPrograms(programs) {
    const programList = document.getElementById('program-list');
    programList.innerHTML = '';

    if (programs.length === 0) {
        programList.innerHTML = `
            <div class="empty-state">
                <p>No programs created yet.</p>
                <a href="create-program.html" class="button primary">Create Your First Program</a>
            </div>
        `;
        return;
    }

    programs.forEach(program => {
        const programCard = createProgramCard(program);
        programList.appendChild(programCard);
    });
}

function createProgramCard(program) {
    const card = document.createElement('div');
    card.className = 'program-card';
    
    const date = new Date(program.createdAt).toLocaleDateString();
    
    card.innerHTML = `
        <div class="program-header">
            <h2 class="program-title">${program.name}</h2>
            <span class="program-meta">${date}</span>
        </div>
        <div class="program-duration">
            ${program.duration} ${program.duration === 1 ? 'week' : 'weeks'}
        </div>
        <div class="program-actions">
            <button class="button primary" onclick="viewProgram(${program.id})">View Details</button>
            <button class="button secondary" onclick="deleteProgram(${program.id})">Delete</button>
        </div>
    `;
    
    return card;
}

function viewProgram(programId) {
    window.location.href = `program-details.html?id=${programId}`;
}

function deleteProgram(programId) {
    if (confirm('Are you sure you want to delete this program?')) {
        const programs = JSON.parse(localStorage.getItem('programs') || '[]');
        const updatedPrograms = programs.filter(program => program.id !== programId);
        localStorage.setItem('programs', JSON.stringify(updatedPrograms));
        loadPrograms();
    }
}
