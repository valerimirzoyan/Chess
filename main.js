document.addEventListener("DOMContentLoaded", () => {
    const chessboard = document.getElementById('chessboard');
    const labelsLeft = document.getElementById('labels-left');
    const labelsRight = document.getElementById('labels-right');
    const labelsTop = document.getElementById('labels-top');
    const labelsBottom = document.getElementById('labels-bottom');

    const rows = 8;
    const cols = 8;
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    let currentQueen = null;
    let currentPawn = null;

    const showAlert = (message, type) => {
        const alertBox = document.createElement('div');
        alertBox.textContent = message;
        alertBox.classList.add('alert');
    
        if (type === 'error') {
            alertBox.classList.add('alert-error');
        } else if (type === 'win') {
            alertBox.classList.add('alert-win');
        } else if (type === 'lose') {
            alertBox.classList.add('alert-lose');
        } else {
            alertBox.classList.add('alert-error');
        }
    
        document.body.appendChild(alertBox);
        
        setTimeout(() => {
            alertBox.remove();
        }, 5000);
    };

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            chessboard.appendChild(square);
        }

        const rankLabelLeft = document.createElement('div');
        const rankLabelRight = document.createElement('div');
        rankLabelLeft.classList.add('label');
        rankLabelRight.classList.add('label');
        rankLabelLeft.textContent = 8 - row;
        rankLabelRight.textContent = 8 - row;
        labelsLeft.appendChild(rankLabelLeft);
        labelsRight.appendChild(rankLabelRight);
    }

    for (let col = 0; col < cols; col++) {
        const fileLabelBottom = document.createElement('div');
        const fileLabelTop = document.createElement('div');
        fileLabelBottom.classList.add('label');
        fileLabelTop.classList.add('label');
        fileLabelBottom.textContent = files[col];
        fileLabelTop.textContent = files[col];
        labelsBottom.appendChild(fileLabelBottom);
        labelsTop.appendChild(fileLabelTop);
    }

    const placePiece = (piece, position = null, hidden=true) => {
        const pieceElement = document.createElement('div');
        pieceElement.textContent = piece;
        pieceElement.classList.add('piece');

        if (hidden) {
            pieceElement.classList.add('hidden');
        }

        if (!position) {
            position = {row:0, col:0};
        }

        pieceElement.style.top = `${position.row * 50}px`;
        pieceElement.style.left = `${position.col * 50}px`;
        chessboard.appendChild(pieceElement); 

        if (piece === '♕') {
            pieceElement.classList.add('queen');
        } else if (piece === '♙') {
            pieceElement.classList.add('pawn');
        }

        return pieceElement;
    };

    const removeCurrentQueen = () => {
        if(currentQueen){
            chessboard.removeChild(currentQueen);
            currentQueen = null, true;
        }
    };

    const removeCurrentPawn = () => {
        if(currentPawn){
            chessboard.removeChild(currentPawn);
            currentPawn = null, true;
        }
    };

    currentQueen = placePiece('♕');
    currentPawn = placePiece('♙');
    
    const canQueenCapturePawn = (queenPos, pawnPos) => {
        const sameRow = queenPos.row === pawnPos.row;
        const sameCol = queenPos.col === pawnPos.col;
        const sameDiagonal = Math.abs(queenPos.row-pawnPos.row) === Math.abs(queenPos.col-pawnPos.col)

        return sameRow || sameCol || sameDiagonal;                       
    };

    document.getElementById('place-piece').addEventListener('click', () => {
        const inputQueen = document.getElementById('piece-position-queen').value;
        const inputPawn = document.getElementById('piece-position-pawn').value;

        let validInput = false;

        if (inputQueen) {
            const fileQueen = inputQueen[0];
            const rankQueen = inputQueen[1];

            if (files.includes(fileQueen) && rankQueen >= 1 && rankQueen <= 8) {
                const positionQueen = {
                    row: 8 - parseInt(rankQueen),
                    col: files.indexOf(fileQueen)
                };

                removeCurrentQueen();

                currentQueen = placePiece('♕', positionQueen,false);
                validInput = true;

            } else {
                showAlert('Invalid move. Please enter a valid position (e.g., e2)', 'error');
            }
        }

        if (inputPawn) {
            const filePawn = inputPawn[0];
            const rankPawn = inputPawn[1];

            if (files.includes(filePawn) && rankPawn >= 1 && rankPawn <= 8) {
                const positionPawn = {
                    row: 8 - parseInt(rankPawn),
                    col: files.indexOf(filePawn)
                };

                removeCurrentPawn();

                currentPawn = placePiece('♙', positionPawn,false);
                validInput = true;

            } else {
                showAlert('Invalid move. Please enter a valid position (e.g., e2)', 'error');
            }
        }

        if (validInput == null) {
            showAlert('Invalid move. Please enter a valid position (e.g., e2)', 'error');
        }
    });

    document.getElementById('play-game').addEventListener('click', () => {
        const inputQueen = document.getElementById('piece-position-queen').value;
        const inputPawn = document.getElementById('piece-position-pawn').value;

        let validInput = false;

        if (inputQueen) {
            const fileQueen = inputQueen[0];
            const rankQueen = inputQueen[1];

            if (files.includes(fileQueen) && rankQueen >= 1 && rankQueen <= 8) {
                const positionQueen = {
                    row: 8 - parseInt(rankQueen),
                    col: files.indexOf(fileQueen)
                };

                removeCurrentQueen();

                currentQueen = placePiece('♕', positionQueen,false);
                validInput = true;

                if (currentPawn) {
                    const pawnPos = {
                        row: parseInt(currentPawn.style.top) / 50,
                        col: parseInt(currentPawn.style.left) / 50
                    };

                    if (canQueenCapturePawn(positionQueen, pawnPos)) {
                        removeCurrentPawn();
                        currentQueen.style.top = `${pawnPos.row * 50}px`;
                        currentQueen.style.left = `${pawnPos.col * 50}px`;

                        showAlert('The queen capture the pawn, YOU WIN!', 'win');

                    }else{
                        showAlert('The queen cannot capture the pawn. YOU LOSE!', 'lose');
                    }
                }
            } 
        }

        if (inputPawn) {
            const filePawn = inputPawn[0];
            const rankPawn = inputPawn[1];

            if (files.includes(filePawn) && rankPawn >= 1 && rankPawn <= 8) {
                const positionPawn = {
                    row: 8 - parseInt(rankPawn),
                    col: files.indexOf(filePawn)
                };

                removeCurrentPawn();

                currentPawn = placePiece('♙', positionPawn,false);
                validInput = true;

                if (currentQueen) {
                    const queennPos = {
                        row: parseInt(currentQueen.style.top) / 50,
                        col: parseInt(currentQueen.style.left) / 50
                    };

                    if (canQueenCapturePawn(queennPos, positionPawn)) {
                        removeCurrentPawn();
                        currentQueen.style.top = `${queennPos.row * 50}px`;
                        currentQueen.style.left = `${queennPos.col * 50}px`;
                    }
                }
            } 
        }
    });

    document.getElementById('reset-board').addEventListener('click', () => {
        removeCurrentQueen();
        removeCurrentPawn();

        document.getElementById('piece-position-queen').value = '';
        document.getElementById('piece-position-pawn').value = '';

        currentQueen.classList.add('hidden');
        currentPawn.classList.add('hidden');
    });
});