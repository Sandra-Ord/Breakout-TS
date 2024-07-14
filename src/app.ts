import Brain from "./brain";
import UI from "./ui";

function validateIndexHtml(): void {
    if (document.querySelectorAll("#app").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
}

function uiRepeater(ui: UI): void {
    setTimeout(() => {
        ui.draw();
        uiRepeater(ui);
    }, 0)
}

function main(): void {

    validateIndexHtml();
    let appDiv: HTMLDivElement = document.querySelector ("#app")!;
    let brain: Brain = new Brain();
    let ui: UI = new UI(brain, appDiv);

    document.addEventListener('keydown', (e) => {
        console.log(e);
        switch(e.key) {
            case 'Escape': 
                brain.stopMovePaddle(brain.paddle);
                brain.gamePaused = true;
                break;
            case 'Enter': 
                if (brain.gameStatus !== 0) {
                    brain.reStartGame();
                } else {          
                    brain.gamePaused = false;
                    brain.moveBall();
                }
                break;
            case ' ': 
                if (brain.gamePaused || brain.gameStatus !== 0) {
                    brain.reStartGame();
                }
                break;
            case 'a': 
            case 'ArrowLeft': 
                brain.startMovePaddle(brain.paddle, -1);
                break;
            case 'd': 
            case 'ArrowRight': 
                brain.startMovePaddle(brain.paddle, 1);
                break;
        }
        ui.draw();
    })

    document.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'a': case 'ArrowLeft': 
                brain.stopMovePaddle(brain.paddle);
                break;
            case 'd': case 'ArrowRight': 
                brain.stopMovePaddle(brain.paddle);
                break;
        }
        ui.draw();
    })

    uiRepeater(ui);
    
}

// ============= ENTRY POINT ================
console.log("App startup...");
main();