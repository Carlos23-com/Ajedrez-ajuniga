const tablero = document.getElementById('tablero');
let piezaSeleccionada = null;

const tableroArray = [
  ['♜','♞','♝','♛','♚','♝','♞','♜'],
  ['♟','♟','♟','♟','♟','♟','♟','♟'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['♙','♙','♙','♙','♙','♙','♙','♙'],
  ['♖','♘','♗','♕','♔','♗','♘','♖']
];

function crearTablero() {
  tablero.innerHTML = '';
  for (let fila = 0; fila < 8; fila++) {
    for (let col = 0; col < 8; col++) {
      const casilla = document.createElement('div');
      casilla.className = 'casilla ' + ((fila + col) % 2 === 0 ? 'blanca' : 'negra');
      casilla.dataset.fila = fila;
      casilla.dataset.col = col;
      casilla.textContent = tableroArray[fila][col];

      casilla.addEventListener('click', () => manejarClick(fila, col));
      tablero.appendChild(casilla);
    }
  }
}

function manejarClick(fila, col) {
  const pieza = tableroArray[fila][col];

  if (!piezaSeleccionada && pieza !== '') {
    piezaSeleccionada = { fila, col, pieza };
    resaltarSeleccion(fila, col);
  } else if (piezaSeleccionada) {
    if (movimientoValido(piezaSeleccionada, fila, col)) {
      tableroArray[fila][col] = piezaSeleccionada.pieza;
      tableroArray[piezaSeleccionada.fila][piezaSeleccionada.col] = '';
    }
    piezaSeleccionada = null;
    crearTablero();
  }
}

function resaltarSeleccion(fila, col) {
  const index = fila * 8 + col;
  const casillas = document.querySelectorAll('.casilla');
  casillas[index].classList.add('seleccionada');
}

function movimientoValido(p, filaDest, colDest) {
  const { fila, col, pieza } = p;
  const dx = Math.abs(fila - filaDest);
  const dy = Math.abs(col - colDest);
  const dir = pieza === pieza.toUpperCase() ? -1 : 1; // dirección para peones (blancos arriba, negros abajo)
  const destino = tableroArray[filaDest][colDest];

  const esAliado = destino && destino !== '' && 
    (pieza.charCodeAt(0) < 9818 ? destino.charCodeAt(0) < 9818 : destino.charCodeAt(0) >= 9818);

  if (esAliado) return false;

  switch (pieza) {
    case '♙': // Peón blanco
      if (col === colDest && destino === '') {
        if (fila === 6 && filaDest === 4) return true; // doble avance
        return filaDest === fila - 1;
      } else if (Math.abs(col - colDest) === 1 && filaDest === fila - 1 && destino !== '') {
        return true; // captura diagonal
      }
      break;

    case '♟': // Peón negro
      if (col === colDest && destino === '') {
        if (fila === 1 && filaDest === 3) return true;
        return filaDest === fila + 1;
      } else if (Math.abs(col - colDest) === 1 && filaDest === fila + 1 && destino !== '') {
        return true;
      }
      break;

    case '♖': case '♜': // Torre
      if (fila === filaDest || col === colDest) {
        return libreEnLinea(fila, col, filaDest, colDest);
      }
      break;

    case '♘': case '♞': // Caballo
      return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);

    case '♗': case '♝': // Alfil
      if (dx === dy) return libreEnLinea(fila, col, filaDest, colDest);
      break;

    case '♕': case '♛': // Reina
      if (fila === filaDest || col === colDest || dx === dy) {
        return libreEnLinea(fila, col, filaDest, colDest);
      }
      break;

    case '♔': case '♚': // Rey
      return dx <= 1 && dy <= 1 && (dx !== 0 || dy !== 0);
  }

  return false;
}

// Verifica que el camino esté libre para torre, alfil o reina
function libreEnLinea(f1, c1, f2, c2) {
  const dx = Math.sign(f2 - f1);
  const dy = Math.sign(c2 - c1);
  let i = f1 + dx, j = c1 + dy;
  while (i !== f2 || j !== c2) {
    if (tableroArray[i][j] !== '') return false;
    i += dx;
    j += dy;
  }
  return true;
}

crearTablero();

