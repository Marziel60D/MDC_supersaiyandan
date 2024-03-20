
//Variables are storage of values
let board;
let score = 0;
let rows =4;
let columns = 4;


let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX = 0;
let StartY = 0;




function setGame() {

	board = [
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]		
	];

	// board = [
    //     [32, 8, 4, 0],
    //     [4, 128, 64, 256],
    //     [8, 32, 16, 2],
    //     [16, 2, 256, 1024]
    // ];


	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			let tile = document.createElement("div");

			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c];

			updateTile(tile, num);
			
			document.getElementById("board").append(tile);
		}
	}
	setTwo();
	setTwo();
}

function updateTile(tile, num){

	tile.innerText = "";
	tile.classList.value = "";
	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num.toString();

		if(num <= 4096){
			tile.classList.add("x"+num.toString());
		}
		else{
			tile.classList.add("x8192");
		}
	}
}

window.onload = function(){
	setGame();
}


function handleSlide(e) {
	console.log(e.code);//displays pressed key

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){
		e.preventDefault();

		if(e.code == "ArrowLeft" && canMoveLeft() == true){
					slideLeft();
					setTwo();
				}
				else if(e.code == "ArrowRight" && canMoveRigth() == true){
					slideRight();
					setTwo();
				}
				else if(e.code == "ArrowUp" && canMoveUp() == true){
					slideUp();
					setTwo();
				}
				else if(e.code == "ArrowDown" && canMoveDown() == true){
					slideDown();
					setTwo();
				}

	}

	checkWin();
	if(haslost() == true){
		setTimeout(() => {
			alert("GAME OVER BITCH!!!");
			restartGame();
			alert("Click any arrow key to restart")
		}, 100);
	}

	document.getElementById("score").innerText = score;
}

document.addEventListener("keydown", handleSlide);

function filterZero(row) {
	return row.filter(num => num !=0);
}

function slide(row){

	row =  filterZero(row);

	for(let i=0; i < row.length - 1; i++ ){
		if(row[i] == row[i+1]){
			row[i] *= 2;
			row[i+1] = 0;
			score += row[i];
		}
	}

	row = filterZero(row);

	while(row.length < columns){
		row.push(0);
	}
	return row;
}



function slideLeft(){
	for(let r=0; r<rows; r++){

		let row = board[r];
		let originalRow = row.slice();

		row = slide(row);
		board[r] = row;



		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s";

				setTimeout(()=>{
					tile.style.animation = "";
				},300);
			}
		}
	}
}


function slideRight(){
	for(let r=0; r<rows; r++){
		let row = board[r];
		let originalRow = row.slice();

		row.reverse();
		row = slide(row);
		row.reverse();
		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(()=>{
					tile.style.animation = "";
				},300);
			}
		}
	}
}

function slideUp(){
	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice();
		col = slide(col);

		changedIndices = [];

		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changedIndices.push(r)
			}
		}

		// this loop is to update the appearance of the tiles after merging
		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(changedIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(() => {
					tile.style.animation = ""
				}, 300);
			}
		}

	}
}



function slideDown(){
	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice();		
		col.reverse();
		col = slide(col);

		col.reverse();

		changedIndices = [];

		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changedIndices.push(r)
			}
		}

		// this loop is to update the appearance of the tiles after merging
		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(changedIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(() => {
					tile.style.animation = ""
				}, 300);
			}
		}
	}
}


function hasEmptyTile() {
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c]==0){
				return true;
			}
		}
	}
	return false;
}


function setTwo() {
	if(!hasEmptyTile()){
		return;
	}
	let found = false;

	while(!found){

		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c]==0){
			board[r][c] =2;
			let tile = document.getElementById(r.toString()+ "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}


function checkWin(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c]=== 2048 && is2048Exist == false){
				alert("You win got 2048");
				is2048Exist = true;
			}

			else if(board[r][c]=== 4096 && is4096Exist == false){
				alert("YOU'RE A GRINDER, AMAZING!!!");
				is4096Exist = true;
			}

			else if(board[r][c]=== 8192 && is8192Exist == false){
				alert("YOU'RE BORED AREN'T YOU!!!");
				is8192Exist = true;
			}

		}
	}
}


function haslost(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c]== 0){
				return false;
			}

			const currentTile = board[r][c];

			if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }

		}
	}

	return true;	
}


function restartGame(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			board[r][c]=0;
		}
	}
	score = 0;
	setTwo();
}


//this will document the x and y y coordinates where the user start to touch the screen
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
})


document.addEventListener('touchend', (e) => {
	if(!e.target.className.includes("tile")){
		return;
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	if(Math.abs(diffX) > Math.abs(diffY)){

		if(diffX > 0){
			slideLeft();
			setTwo();			
		}
		else {
			slideRight();
			setTwo();
		}
	}
	else {
		if(diffY > 0){
			slideUp();
			setTwo();
		}
		else {
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	checkWin();

	if(haslost() == true){
		setTimeout(() => {
			alert("GAME OVER BITCH!!!");
			restartGame();
			alert("Click any arrow key to restart")
		}, 100);
	}

})

document.addEventListener("touchmove", (e) => {
	if(!e.target.className.includes("tile")){
		return;
	}

	e.preventDefault();//this prevent scrolling if tiles is touch.
}, {passive: false}); // use to make preventdefault() work

function canMoveLeft(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			console.log(`${r}-${c}`)

			if(board[r][c] !== 0){
				if(board[r][c-1] === 0 || board[r][c-1] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveRigth(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			console.log(`${r}-${c}`)

			if(board[r][c] !== 0){
				if(board[r][c+1] === 0 || board[r][c+1] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveUp() {
    for (let c = 0; c < columns; c++) {
        for (let r = 1; r < rows; r++) { // Start from index 1 instead of 0
            if (board[r][c] !== 0) {
                if (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown() {
    for (let c = 0; c < columns; c++) {
        for (let r = 1; r < rows; r++) { // Start from index 1 instead of 0
            if (board[r][c] !== 0) {
                if (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}



// function canMoveDown(){
// 	for(let c=0; c<columns; c++){
// 		for(let r = 1; r<rows; r++){
// 			if(board[r][c] !== 0){
// 				if(board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]){
// 					return true;
// 				}
// 			}
// 		}
// 	}
// 	return false;
// }


