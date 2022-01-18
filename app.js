


const game = () => {
    let tile = () => {
        let div = null;
        let filled = false;
        let letter = null;
        return {div, filled, letter}
    }
    
    let counter = 0
    const board = [];
    const genBoard = () => {
        for (i=0; i <= 8; i++){
            let thisTile = tile();
            board.push(thisTile)
            thisTile.div = document.createElement("div");
            thisTile.div.classList.add("is-one-third")
            thisTile.div.classList.add("container")
            thisTile.div.classList.add("column")
            thisTile.div.addEventListener("click", () => {
                    if (!thisTile.filled){
                    const p = document.createElement("p")
                    p.textContent = turn()
                    p.style.fontSize = "150px"
                    thisTile.div.append(p)
                    thisTile.letter = p.textContent;
                    thisTile.filled = true
                    compMove()
                    }
            })
            document.querySelector("#board").append(thisTile.div)
        }
    }
    //returns a list with a model of the current board state
    const getBoardState = function() {
        out = new Array
        for (let space of board){
            if (space.filled){
                if (space.letter === "X"){
                    out.push(-1)
                }else{
                    out.push(1)
                }
            }
            else {
                out.push(0)
            }
        }
        return out
    }
    const compMove = () => {

            let comp = board[minimax(getBoardState(), true).move]
            comp.letter = "O"
            const p = document.createElement("p")
            p.textContent = turn()
            p.style.fontSize = "150px"
            comp.div.append(p)
            comp.letter = p.textContent;
            comp.filled = true
    }
    //takes a modelled version of the game state and returns a list of available moves by their indexes.
    const getMoves = (arr) => {
        out = new Array
        for (i = 0; i <=8; i++){
            if (arr[i]===0){
                out.push(i)
            }
        }
        return out
    }
    //model the board state with 1 if space is fileld by computer and -1 if space is filled by player, 0 if space is unfilled
    //then for every possible move (indicated by a 0), make that move and go 1 level of depth lower
    //if the move won the game, check for win/loss/draw. a win has a value of 1. loss is value of -1. draw is value of 0
    //else, for every available move, make a move and re-check.
    //ok, so the system technically works, but takes forever because it is checking a whole bunch of identical moves. 
    const minimax = function(boardState, isMax, depth=0, choice = null){
        let best = {
            value: null, 
            move: choice
        }
        //if the board is a game over state, return a value corresponding to that state
        //ok, so we know the base case works beause it will return properly.
        if(isGameOver(boardState)){
            console.log(boardState)
            if (checkWin(boardState) === -1){
                best.value = -100+depth
            }else if (checkWin(boardState)=== 1){
                best.value = 100-depth
            }else {
                best.value = 0
            }
            return best
        }
        //get a list of available moves for current board state or the hypothetical boardstate of the recursive check
        let moves = getMoves(boardState)
        //for each move generated, we will recursively call minimax until a base case is reached. 
        if (isMax){
            best.value = -100
            moves.forEach(move => {
                //make a board state copy
                let childState = boardState.slice()
                //insert the move into the child state
                childState[move] = 1
                //if maximizing player, return the maximum value from the next layer down
                let bestChild = minimax(childState, false, depth+1, move)
                if (best.value < bestChild.value){
                    best.value = bestChild.value
                    best.move = move
                }
            })
            return best
        }else {
            best.value = 100
            moves.forEach(move => {
                //make a board state copy
                let childState = boardState.slice()
                //insert the move into the child state
                childState[move] = -1
                //if maximizing player, return the maximum value from the next layer down
                let bestChild = minimax(childState, true, depth+1, move)
                if (best.value > bestChild.value){
                    best.value = bestChild.value
                    best.move = move
                }
            })
            return best
        }
    }
    //checks if the game is over either by win or by running out of moves. 
    const isGameOver = (toCheck) => {
        if (checkWin(toCheck) || getMoves(toCheck).length ===0) {
            return true;
        }
        return false;
    }
    //the checkwin function will return either false if no one has won, or will return the letter value of the winner X or O, since these return values are truthy
    const checkWin = (toCheck) => {
        //this generic check for win state will work for both the main board as well as for the minimax function
        //win conditions is 3 tiles in a row diagnial, horizontal, or vertical
        //horizontal definition: start of row, start of row + 1, start of row +2
        //an issue arose because the starting value is null... which is equal to null, and this check will call that a win. 
        for (i = 0; i < 7; i+=3){
            if (toCheck[i] === toCheck[i+1] && toCheck[i] === toCheck[i+2] && toCheck[i] != 0) {
                return toCheck[i]
            }
        }
        //definition of diagonal win, either 0,4,8 or 2,4,6
        if (toCheck[2] === toCheck[4] && toCheck[2] === toCheck[6] && toCheck[2] != 0){
            return toCheck[2]
        }
        if (toCheck[0] === toCheck[4] && toCheck[0] === toCheck[8] && toCheck[0] != 0){
            return toCheck[0]
        }
        //definition of vertical win. 0,3,6 || 1,4,7 || 2,5,8 aka i+3 and i+6
        for (i=0; i<3; i++){
            if (toCheck[i] === toCheck[i+3] && toCheck[i] === toCheck[i+6] && toCheck[i] != 0){
                return toCheck[i]
            }
        }
        //if no one won, return false
        return false
        
    }
    const reset = () => {
        for (let space of board){
            space.filled = false;
        }
        for (let p of document.querySelectorAll("p")){
            p.remove()
        }
        counter = 0;
    }
    const turn = () => {
        if (counter % 2 ===0){
            counter++
            return "X"
        }
        counter++
        return "O"
    }
    return {genBoard, reset, getBoardState, minimax, getBoardState, checkWin, getMoves, compMove}
}
let theGame = game()

theGame.genBoard()


document.querySelector("#reset").addEventListener("click", () => {
    theGame.reset()
})
document.querySelector("#compPlay").addEventListener("click", () => {
    theGame.compMove()
})