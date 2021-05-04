//This is the MVC of the guessing battleship game implemented by Edekobi Philip...
//Currently, I am unable to make a callback when a user presses the return key.
/*Also this code needs a lot of refactoring. Including but not limited to making the ship 
creation process cleaner by making use of a constructor and some parts still exhibit unexpected behavior*/
//controller.endgame isnt working.
//Hitting the same spot twice is permitted.

//Looking forward to collaboration.


var view = {
    displayMessage: function(msg){
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location){
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3, 
    shipsSunk: 0,

    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }],
    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("You hit my battleship!");
                if(this.isSunk(ship)){
                    this.shipsSunk++;
                    view.displayMessage("You sunk a ship!")
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.")
        return false;
    },
    isSunk: function(ship){
        for(let i =  0; i<this.numShips; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        if (direction === 1) { 
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else { 
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }    
        }
        return newShipLocations;
    },
    collision: function(locations){
        for( let i = 0; i < this.numShips; i++){
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++){
                if(ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
};

var controller = {
    guesses: 0,

    endgame: function(){
        setAttribute(document.getElementsByName("form"), null);
    },
    processGuess: function(guess){
        let location = parseGuess(guess);
        if(location){
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
}

function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        let firstChar = guess.charAt(0).toUpperCase();
        let row = alphabet.indexOf(firstChar); 
        let column = guess.charAt(1);
        
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleFireButton(){
    let guess = document.getElementById("guessInput").value;
    controller.processGuess(guess);
    document.getElementById("guessInput").value = '';    
}

function handleKeyPress(e){
    let fireButton = document.getElementById("fireButton");
    if (e.keycode === 13){
        fireButton.click();
        return false;
    }
}
window.onload = init;