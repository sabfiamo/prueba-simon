'use strict';

//variables let: aplica donde es definida y puede variar de valor
let order = [];
let playerOrder = []; //orden en el que el jugador presiona los colores
let flash; //número de flashes que aparecen
let turn;
let good; //booleano true/false
let compTurn; //booleano, turno de la computadora
let intervalId;
let strict = false; //el modo strict está desconectado al inicio del juego
let noise = true;
let on = false; //para el encendido del juego
let win; //cuando el usuario gana el juego

//llamar las constantes del HTML que voy a usar, usamos id, pero no usa document.getElementById, le he mandado un mensaje
const turnCounter = document.querySelector('#turn');
const topLeft = document.querySelector('#topleft');
const topRight = document.querySelector('#topright');
const bottomLeft = document.querySelector('#bottomleft');
const bottomRight = document.querySelector('#bottomright');
const strictButton = document.querySelector('#strict');
const onButton = document.querySelector('#on');
const startButton = document.querySelector('#start');

//función de addEventListener del modo strict, on y start, he quitado (event) en la función callback porque me daba error y no era usado en la lógica.
strictButton.addEventListener('click', () => {
  if (strictButton.checked === true) {
    strict = true;
  } else {
    strict = false;
  }
});

onButton.addEventListener('click', () => {
  if (onButton.checked === true) {
    on = true;
    turnCounter.innerHTML = '-';
  } else {
    on = false;
    turnCounter.innerHTML = '';
    clearColor(); //"apaga" los colores cuando el juego está off
    clearInterval(intervalId);
  }
});

startButton.addEventListener('click', () => {
  if (on || win) {
    play();
  }
});

//definimos la funcion play()
function play() {
//resetar las variable cada vez que se inicie el juego
  win = false;
  order = [];
  playerOrder = [];
  flash = 0;
  intervalId = 0;
  turn = 1;
  turnCounter.innerHTML = 1;
  good = true;
  //bucle (loop) para el orden aleatorio de los colores y llevarlo a 8 rondas (relacionado con función check)
  for (let i = 0; i < 10; i++) {
    order.push(Math.floor(Math.random() * 4) + 1);
  }
  compTurn = true; // para que el pc comience turno

  intervalId = setInterval(gameTurn, 800); //Esto significa que la función gameTurn se ejecutará cada 800 milisegundos (0.8 segundos).El propósito de este intervalo es controlar el turno de la computadora y mostrar la secuencia de colores que el jugador debe repetir.Cada vez que se ejecuta gameTurn(), se comprueba si se ha alcanzado el número de flashes correspondiente a la ronda actual. Si se ha alcanzado, se detiene el intervalo y se procede a cambiar al turno del jugador.
}

//definimos la función gameTurn, controla el turno de la computadora en el juego
function gameTurn() {
  on = false; // durante el turno de la computadora, el jugador no puede seleccionar ninguno de los botones de colores.

  if (flash === turn) { //Si el número de destellos es igual al número de ronda, significa que se ha mostrado toda la secuencia de colores para esa ronda.Entonces...
    clearInterval(intervalId);//para detener el intervalo de tiempo controlado por intervalId
    compTurn = false; //finaliza el turno del pc
    clearColor(); //"apaga" los destellos
    on = true; // ahora el jugador puede seleccionar los botones de colores
  }

  if (compTurn) {
    clearColor();
    setTimeout(() => { //un retraso de 200 milisegundos antes de mostrar el próximo destello de color.
      if (order[flash] === 1) one(); // order es un array y es el número de veces que el color verde tiene destello
      if (order[flash] === 2) two(); // rojo
      if (order[flash] === 3) three(); //amarillo
      if (order[flash] === 4) four(); //azul
      flash++; //se incrementa el destello en 1 en la siguiente ronda
    }, 200);
  }
}

//funciones para introducir los audios en los colores
function one() {
  if (noise) {
    let audio = document.getElementById('clip1'); //audio del HTML
    audio.play();
  }
  noise = true;
  topLeft.style.backgroundColor = 'lightgreen';//cambiamos el css en js cuando noise = true se cambia de color,
  //Hex Code con palabras clave para colores para HTML. (https://coding-help.fandom.com/wiki/Hex_Codes?file=Hex_color_picker.jpg)
}

function two() {
  if (noise) {
    let audio = document.getElementById('clip2');
    audio.play();
  }
  noise = true;
  topRight.style.backgroundColor = 'tomato';
}

function three() {
  if (noise) {
    let audio = document.getElementById('clip3');
    audio.play();
  }
  noise = true;
  bottomLeft.style.backgroundColor = 'yellow';
}

function four() {
  if (noise) {
    let audio = document.getElementById('clip4');
    audio.play();
  }
  noise = true;
  bottomRight.style.backgroundColor = 'lightskyblue';
}


//función para "apagar" los colores
function clearColor() {
  topLeft.style.backgroundColor = 'darkgreen';
  topRight.style.backgroundColor = 'darkred';
  bottomLeft.style.backgroundColor = 'goldenrod';
  bottomRight.style.backgroundColor = 'darkblue';
}

//función para los destellos de los colores
function flashColor() {
  topLeft.style.backgroundColor = 'lightgreen';
  topRight.style.backgroundColor = 'tomato';
  bottomLeft.style.backgroundColor = 'yellow';
  bottomRight.style.backgroundColor = 'lightskyblue';
}

topLeft.addEventListener('click', () => {
  if (on) { //si está encendido...
    playerOrder.push(1);//el jugador pulsa
    check(); //se comprueba si es correcto
    one(); //muestra el destello
    if(!win) { //si el jugador no ha ganado el juego. Entonces...
      setTimeout(() => {
        clearColor();//para apagar los colores cuando se haya hecho la ronda
      }, 300); //tiempo en milisegundos que se muestra el destello de color
    }
  }
});

topRight.addEventListener('click', () => {
  if (on) {
    playerOrder.push(2);
    check();
    two();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
});

bottomLeft.addEventListener('click', () => {
  if (on) {
    playerOrder.push(3);
    check();
    three();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
});

bottomRight.addEventListener('click', () => {
  if (on) {
    playerOrder.push(4);
    check();
    four();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 300);
    }
  }
});

//función muy importante para comparar los resultados
function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
  {good = false;} //Esto indica que el jugador ha cometido un error.

  if (playerOrder.length === 10 && good) { //longitud de la ronda, relacionado con el bucle de la función play. El jugador ha completado correctamente las 8 rondas del juego. Entonces...
    winGame();
  }

  if (good === false) { //si el jugador ha cometido un error. Entonces...
    flashColor(); //se llama a la función flash color
    turnCounter.innerHTML = 'NOP!'; //en el contador aparecerá la palabra "NO!"*/
    setTimeout(() => { //se vuelve a mostrar la ronda actual
      turnCounter.innerHTML = turn;
      clearColor();

      if (strict) { //si está activado el strict mode. Entonces...
        play(); //se reinicia el juego si el jugador falla
      } else { //si no está activado el modo strict.Entonces...
        compTurn = true; //es el turno del pc
        flash = 0; //mostrar la secuencia desde el principio
        playerOrder = []; //turno del jugador
        good = true; //jugador acierta
        intervalId = setInterval(gameTurn, 800); //turno del pc
      }
    }, 800);

    noise = false;
  }

  if (turn === playerOrder.length && good && !win) { //si el turno del jugador es correcto. Entonces...
    turn++; //se añade un turno
    playerOrder = []; //nueva secuencia para el jugador
    compTurn = true; //turno del pc
    flash = 0;
    turnCounter.innerHTML = turn;
    intervalId = setInterval(gameTurn, 800);
  }

}

//función de la vistoria
function winGame() {
  flashColor(); // se llama a esta función para el destello de los 4 colores a la vez
  turnCounter.innerHTML = 'WIN!'; // en el contador aparecerá la palabra "WIN!"
  on = false; // el jugador no puede seleccionar ningún color
  win = true; // para evitar que se reinicie una nueva ronda de forma automática.
}
