export class View {
    #model;

    constructor(model) {
        this.#model = model;
    }

    render(render_div) {
        render_div.innerHTML = "";

        let title = document.createElement("h1");
        title.textContent = "Snakes and Ladders";
        title.id = "game-title";

        let gameContainer = document.createElement("div");
        gameContainer.classList.add("game-container");

        let board_div = document.createElement("div");
        board_div.id = "board";
        const images = {
            100: "./img/gavel_logo.png",
            88: "./img/law_school_logo.webp",
            65: "./img/strava.svg",
            59: "./img/workout_logo.png",
            43: "./img/cooking_logo.png",
            28: "./img/spotify_logo.png",
        }
        for (let i = 100; i >= 1; i--) {
            let cell = document.createElement("div");
            cell.className = `cell cell-${i}`;
            if (i == 1) {
                cell.classList.add("current")
            }
            if (Object.keys(images).includes(i.toString())) {
                let img = document.createElement("img")
                img.src = images[i];
                img.alt = "some image lol";
                cell.append(img)
            } else {
                cell.textContent = i;
            }
            board_div.appendChild(cell);
        }
 

        let side_div = document.createElement("div");
        side_div.id = "side-panel";

        let heading = document.createElement("h3");
        heading.textContent = "Options";
        side_div.appendChild(heading);

        let options = ["Run", "Workout", "Read", "Music", "TV", "Study"]
        let option_moves = this.shuffle([1, 2, 3, 4, 5, 6]);
        for (let i = 0; i < 6; i++) {
            let diceButton = document.createElement("div");
            diceButton.className = "option-button";
            diceButton.textContent = options[i];

            diceButton.addEventListener("click", () => {
                console.log("click for " + option_moves[i]);
                this.#model.move_position(option_moves[i])
            });

            side_div.appendChild(diceButton);
        }

        let status = document.createElement("p");
        status.id = "status";
        status.textContent = "Choose an option to move!";
        side_div.appendChild(status);

        gameContainer.appendChild(board_div);
        gameContainer.appendChild(side_div);

        render_div.appendChild(title);
        render_div.appendChild(gameContainer);
        this.renderLaddersAndSnakes(board_div);
        let player_div = document.createElement("div");
        player_div.className = "player_div"
        let player_img = document.createElement("img");
        player_img.src = "./img/profile.png"
        player_div.append(player_img);
        board_div.append(player_div);
        this.addImageOnCurrent(board_div, player_div)
        document.addEventListener("model update", () => {
            const position = this.#model.get_position();
            const cell = document.querySelector(`.cell-${position}`);
            if (cell) {
                document.querySelectorAll('.cell').forEach(c => c.classList.remove('current'));
                cell.classList.add('current');
                this.addImageOnCurrent(board_div, player_div)
            } else {
                alert("ERROR");
            }

        }) 
        document.addEventListener("game finish", () => {
            alert("Josh made it to law school!")
            this.game_restart(render_div)
        })
    }

    addImageOnCurrent(board_div, img) {
        const currentCell = document.querySelector('.current');
        if (!currentCell) return;
        const currentRect = currentCell.getBoundingClientRect();
        const boardRect = board_div.getBoundingClientRect();
        const currentX = currentRect.left - boardRect.left + currentRect.width / 2;
        const currentY = currentRect.top - boardRect.top + currentRect.height / 2;
        img.style.position = "absolute"; 
        img.style.top = `${currentY - 50 / 2}px`; 
        img.style.left = `${currentX - 50 / 2}px`; 
        img.style.width = "50px"; 
        img.style.height = "50px"; 
        img.style.zIndex = "10"; 
        img.style.transition = "all 0.5s ease";
    }

    game_restart(render_div) {
    let restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.className = "restart-button"
    restartButton.addEventListener("click", () => {
        location.reload();
    });
    render_div.append(restartButton);
    }

    renderLaddersAndSnakes(board_div) {
        const ladders = this.#model.get_ladders();
        const snakes = this.#model.get_snakes();
        for (const start in ladders) {
            const end = ladders[start];
            const startCell = board_div.querySelector(`.cell-${start}`);
            const endCell = board_div.querySelector(`.cell-${end}`);
            this.addLineBetweenCells(startCell, endCell, 'ladder', board_div);
        }

        for (const start in snakes) {
            const end = snakes[start];
            const startCell = board_div.querySelector(`.cell-${start}`);
            const endCell = board_div.querySelector(`.cell-${end}`);
            this.addLineBetweenCells(startCell, endCell, 'snake', board_div);
        }
    }

    addLineBetweenCells(startCell, endCell, type, board_div) {
        if (!startCell || !endCell) return;
    
        let line = document.createElement("div");
        line.classList.add(type); 
    
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        const boardRect = board_div.getBoundingClientRect();
    
        const startX = startRect.left - boardRect.left + startRect.width / 2;
        const startY = startRect.top - boardRect.top + startRect.height / 2;
        const endX = endRect.left - boardRect.left + endRect.width / 2;
        const endY = endRect.top - boardRect.top + endRect.height / 2;
    
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy); 
        const angle = Math.atan2(dy, dx) * 180 / Math.PI; 
    
        line.style.position = "absolute";
        line.style.top = `${startY}px`;
        line.style.left = `${startX}px`;
        line.style.width = `${length}px`; 
        line.style.height = "5px"; 
        line.style.transformOrigin = "top left"; 
        line.style.transform = `rotate(${angle}deg)`; 
    
        if (type === "ladder") {
            line.style.backgroundColor = "#ffe669"; 
        } else if (type === "snake") {
            line.style.backgroundColor = "#fa5e1b"; 
        }
        line.style.zIndex = "2";

        board_div.appendChild(line);
    }
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
    }
}
