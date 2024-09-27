let teams = [0, 0, 0, 0];
let selectedTeam = null;
const cardsContainer = document.querySelector('.cards');
const notification = document.getElementById('notification');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateCards() {
    cardsContainer.innerHTML = '';

    const operations = [];

    // Add addition cards
    for (let i = 0; i < 6; i++) {
        operations.push(`+${(i + 1) * 100}`);
    }

    // Add subtraction cards
    for (let i = 0; i < 4; i++) {
        operations.push(`-${(i + 1) * 100}`);
    }

    // Add multiplication cards with factors below 10
    for (let i = 1; i <= 3; i++) {
        operations.push(`x${i}`); // Using factors 1, 2, and 3
    }

    // Add one division card
    operations.push('÷100');

    // Add one switch points card
    operations.push('switch');

    // Shuffle the operations
    for (let i = operations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [operations[i], operations[j]] = [operations[j], operations[i]];
    }

    // Create card elements
    for (let operation of operations) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.operation = operation;
        card.style.backgroundColor = getRandomColor();
        card.onclick = () => revealCard(card);
        cardsContainer.appendChild(card);
    }
}

function selectTeam(teamNumber) {
    selectedTeam = teamNumber;
    document.querySelectorAll('.team-box').forEach((box, index) => {
        box.style.backgroundColor = index + 1 === teamNumber ? 'lightgreen' : 'lightgray';
    });
}

function revealCard(card) {
    if (selectedTeam === null) {
        alert('Please select a team first!');
        return;
    }

    if (!card.classList.contains('revealed')) {
        card.classList.add('revealed');
        card.style.backgroundColor = 'darkgray';
        const operation = card.dataset.operation;

        if (operation === 'switch') {
            card.innerHTML = 'Switch Two Teams!'; // Update card text immediately
            showSwitchPrompt();
            return;
        }

        const pointsChange = parseInt(operation.slice(1));
        let resultMessage = '';

        switch (operation[0]) {
            case '+':
                teams[selectedTeam - 1] += pointsChange;
                resultMessage = `+${pointsChange} Points!`;
                break;
            case '-':
                teams[selectedTeam - 1] -= pointsChange;
                resultMessage = `-${pointsChange} Points!`;
                break;
            case '÷':
                teams[selectedTeam - 1] = Math.floor(teams[selectedTeam - 1] / pointsChange);
                resultMessage = `÷${pointsChange}!`;
                break;
            case 'x':
                teams[selectedTeam - 1] *= pointsChange; // Multiplication with factors below 10
                resultMessage = `x${pointsChange}!`;
                break;
        }
        card.innerHTML = `<span style="color: ${operation[0] === '+' || operation[0] === 'x' ? 'green' : 'red'}; background-color: black; padding: 2px;">${resultMessage}</span>`;
        updatePoints();
    }
}

function showSwitchPrompt() {
    const switchPrompt = document.createElement('div');
    switchPrompt.classList.add('switch-prompt');
    switchPrompt.innerHTML = `
        <h3>Whose Points Would You Like To Switch?</h3>
        <div class="team-selection">
            <button onclick="selectTeamForSwitch(1)">Team 1</button>
            <button onclick="selectTeamForSwitch(2)">Team 2</button>
            <button onclick="selectTeamForSwitch(3)">Team 3</button>
            <button onclick="selectTeamForSwitch(4)">Team 4</button>
        </div>
        <button class="close-button" onclick="closeSwitchPrompt()">Close</button>
    `;
    document.body.appendChild(switchPrompt);
}

let selectedForSwitch = [];

function selectTeamForSwitch(teamNumber) {
    if (selectedForSwitch.includes(teamNumber)) {
        alert('You have already selected this team. Please select another one.');
        return;
    }

    selectedForSwitch.push(teamNumber);
    if (selectedForSwitch.length === 2) {
        const confirmSwitch = confirm(`Are you sure you want to switch points between Team ${selectedForSwitch[0]} and Team ${selectedForSwitch[1]}?`);
        if (confirmSwitch) {
            switchPoints(selectedForSwitch[0] - 1, selectedForSwitch[1] - 1);
        }
        closeSwitchPrompt();
    }
}

function switchPoints(index1, index2) {
    [teams[index1], teams[index2]] = [teams[index2], teams[index1]];
    updatePoints();
}

function closeSwitchPrompt() {
    document.querySelector('.switch-prompt').remove();
    selectedForSwitch = [];
}

function updatePoints() {
    for (let i = 0; i < teams.length; i++) {
        document.getElementById(`points${i + 1}`).innerText = `Points: ${teams[i]}`;
    }
}

function resetGame() {
    teams = [0, 0, 0, 0];
    selectedTeam = null;
    updatePoints();
    generateCards();
    resetTeamHighlights();
}

function resetTeamHighlights() {
    document.querySelectorAll('.team-box').forEach(box => {
        box.style.backgroundColor = 'lightgray';
    });
}

// Initialize the game
generateCards();
