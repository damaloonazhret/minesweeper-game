const body = document.querySelector('body');
const main = document.createElement('div');
const grid = document.createElement('div');
const newGame = document.createElement('div');
const duration = document.createElement('div');
const movesClicks = document.createElement('div');
const flagsCount = document.createElement('div');
const minesCount = document.createElement('input');
const levelSwitchMedium = document.createElement('div');
const levelSwitchHard = document.createElement('div');
const result = document.createElement('div');
const levelSwitchEasy = document.createElement('div');
const switcher = document.createElement('div');
const audioSwitcher = document.createElement('div');
const gridContainer = document.createElement('div');
const characteristics = document.createElement('div');
const minesCountContainer = document.createElement('div');

for (let i = 0; i < 10; i++) {
  const resultCheck = document.createElement('div');
  result.appendChild(resultCheck);
}

const audio = new Audio('https://www.fesliyanstudios.com/play-mp3/7012');
const audioGameOver = new Audio('https://www.fesliyanstudios.com/play-mp3/7002');
const audioWin = new Audio('https://www.fesliyanstudios.com/play-mp3/5247');
const audioFlag = new Audio('https://www.fesliyanstudios.com/play-mp3/7019');
const audioFlagQuestion = new Audio('https://www.fesliyanstudios.com/play-mp3/7025');

newGame.className = 'new-game';
switcher.className = 'switcher';
audioSwitcher.className = 'audio-switcher';
levelSwitchEasy.className = 'easy';
result.className = 'result';
minesCount.className = 'mines-count';
minesCountContainer.className = 'mines-count-container';
gridContainer.className = 'grid-container';
characteristics.className = 'characteristics';
levelSwitchMedium.className = 'level';
levelSwitchHard.className = 'level-hard';
duration.className = 'duration';
flagsCount.className = 'flags-count';
movesClicks.className = 'clicks';
grid.className = 'grid';
main.className = 'main';

flagsCount.setAttribute('data-title', 'Flag counter');
duration.setAttribute('data-title', 'Seconds counter');
movesClicks.setAttribute('data-title', 'Move counter');
minesCountContainer.setAttribute('data-title', 'Custom bombs counter');
minesCount.setAttribute('placeholder', 'Enter number of bombs');

body.appendChild(main);
body.appendChild(gridContainer);
gridContainer.appendChild(grid);
gridContainer.appendChild(characteristics);
body.appendChild(result);
main.appendChild(newGame);
characteristics.appendChild(duration);
characteristics.appendChild(flagsCount);
minesCountContainer.appendChild(minesCount);
characteristics.appendChild(minesCountContainer);
characteristics.appendChild(movesClicks);
main.appendChild(levelSwitchEasy);
main.appendChild(levelSwitchMedium);
main.appendChild(levelSwitchHard);
main.appendChild(switcher);
main.appendChild(audioSwitcher);
audioSwitcher.innerHTML = 'Sound';
newGame.innerHTML = 'New Game';
levelSwitchEasy.innerHTML = 'Easy';
levelSwitchMedium.innerHTML = 'Medium';
levelSwitchHard.innerHTML = 'Hard';
switcher.innerHTML = 'dark/light';

let isGameOver = false;
let startTimer = false;
let playing = true;
let width = 10;
let bombAmount = 10;
let squares = [];
let flags = 0;
let firstCount = 0;
let flagsAmount = 0;
let seconds = 0;
let moves = 0;
let lowArray = [0, 9, 10, 11, 98, 90, 88, 89];

audioSwitcher.addEventListener('click', () => {
  audioSwitcher.classList.toggle('off');

  if (playing === false) {
    playing = true;
    return;
  }

  playing = false;
});

grid.addEventListener('click', (e) => {
  const count = document.querySelectorAll('.checked');

  if (count.length === (width * width - bombAmount)) {
    checkForWin(count.length);
  }

  // if (seconds != 0) {
  if (!startTimer) {

  } else {
    seconds++;
    duration.innerHTML = `${seconds} sec`;
    startTimer = false;
    timer();
  }
});

const themeSwitcher = () => {
  body.classList.toggle('dark');
  main.classList.toggle('dark');
  result.classList.toggle('dark');
  switcher.classList.toggle('dark');
  levelSwitchEasy.classList.toggle('dark');
  levelSwitchHard.classList.toggle('dark');
  levelSwitchMedium.classList.toggle('dark');
  movesClicks.classList.toggle('dark');
  duration.classList.toggle('dark');
  newGame.classList.toggle('dark');
  flagsCount.classList.toggle('dark');
  minesCount.classList.toggle('dark');
};

switcher.addEventListener('click', (e) => {
  themeSwitcher();
});

function timer() {
  if (!startTimer) {
    seconds++;
    setTimeout(() => {
      duration.innerHTML = `${seconds} sec`;
      timer();
    }, 1000);
  }
}

const audioPlay = (sound) => {
  if (playing) {
    sound.currentTime = 0;
    sound.play();
  }
};

window.addEventListener('beforeunload', () => {
  const sec = seconds.toString();
  const mov = moves.toString();
  const gridContent = document.querySelector('.grid').innerHTML;
  const theme = body.classList.value;
  localStorage.setItem('theme', theme);
  localStorage.setItem('mov', mov);
  localStorage.setItem('sec', sec);
  localStorage.setItem('final', gridContent);
});

const createContainer = () => {
  minesCount.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (minesCount.value.trim() > 99 || minesCount.value.trim() < 10) {
        alert('The number of bombs must be in the range from 10 to 99');
        return;
      }
      if (localStorage.getItem('easy') == 'easy') {
        easyLevel(Number(minesCount.value.trim()));
      }
      if (localStorage.getItem('medium') == 'medium') {
        mediumLevel(Number(minesCount.value.trim()));
      }
      if (localStorage.getItem('hard') == 'hard') {
        hardLevel(Number(minesCount.value.trim()));
      } else {
        easyLevel(Number(minesCount.value.trim()));
      }
    }
  });

  flagsAmount = bombAmount;
  minesCount.innerHTML = bombAmount;
  flagsCount.innerHTML = `${flagsAmount} Flags`;
  moves = localStorage.getItem('mov');
  duration.innerHTML = `${seconds} sec`;

  let bombsArray = Array(bombAmount)
    .fill('bomb');
  let emptyArray = Array(width * width - bombAmount)
    .fill('valid');
  let gameArray = emptyArray.concat(bombsArray);
  let shuffledArray = gameArray.sort(() => Math.random() - 0.5);

  const mediumLevel = (bombs = 50) => {
    grid.innerHTML = '';
    lowArray = [0, 14, 15, 16, 223, 210, 208, 209];
    width = 15;
    bombAmount = bombs;
    grid.classList.remove('hard');
    grid.classList.add('medium');
    localStorage.setItem('final', '0');
    localStorage.setItem('medium', 'medium');
    localStorage.removeItem('easy');
    localStorage.removeItem('hard');
    newGameFunction();
  };

  const easyLevel = (bombs = 10) => {
    lowArray = [0, 9, 10, 11, 98, 90, 88, 89];
    grid.innerHTML = '';
    width = 10;
    bombAmount = bombs;
    grid.classList.remove('hard');
    grid.classList.remove('medium');
    localStorage.setItem('final', '0');
    localStorage.setItem('easy', 'easy');
    localStorage.removeItem('medium');
    localStorage.removeItem('hard');
    newGameFunction();
  };

  const hardLevel = (bombs = 80) => {
    lowArray = [0, 25, 26, 27, 623, 600, 598, 599];
    grid.innerHTML = '';
    width = 25;
    bombAmount = bombs;
    grid.classList.remove('medium');
    grid.classList.add('hard');
    localStorage.setItem('final', '0');
    localStorage.setItem('hard', 'hard');
    localStorage.removeItem('easy');
    localStorage.removeItem('medium');
    newGameFunction();
  };

  const newGameFunction = () => {
    localStorage.setItem('level', 0);
    localStorage.setItem('final', '0');
    grid.classList.remove('back');
    seconds = 0;
    flags = 0;
    firstCount = 0;
    duration.innerHTML = `${seconds} sec`;
    moves = 0;
    localStorage.setItem('mov', 0);
    localStorage.setItem('sec', 0);
    movesClicks.innerHTML = `${moves} moves`;
    isGameOver = false;
    startTimer = true;
    bombsArray = [];
    emptyArray = [];
    gameArray = [];
    shuffledArray = [];
    squares = [];
    grid.innerHTML = '';
    createContainer();
  };

  levelSwitchEasy.addEventListener('click', (e) => {
    easyLevel();
  });

  levelSwitchMedium.addEventListener('click', (e) => {
    mediumLevel();
  });

  levelSwitchHard.addEventListener('click', (e) => {
    hardLevel();
  });

  newGame.addEventListener('click', (e) => {
    newGameFunction(e);
  });

  if (!localStorage.getItem('final') || localStorage.getItem('final') === '0') {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      square.addEventListener('click', (e) => {
        if (e.target.classList.contains('valid')) {
          firstCount++;
        }

        if (e.target.classList.contains('bomb') && firstCount === 0) {
          const idBomb = Number(e.target.id);
          newGameFunction();
          const noBomb = document.getElementById(`${idBomb}`);
          noBomb.click();
          firstCount++;
          return;
        }

        if (!e.target.classList.contains('move')
          && !e.target.classList.contains('checked')
          && !isGameOver
          && !e.target.classList.contains('flag')) {
          e.target.classList.add('move');
          if (!e.target.classList.contains('bomb')) {
            audioPlay(audio);
          }
          moves++;
          movesClicks.innerHTML = `${moves} moves`;
        }
        click(square);
      });

      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }
  } else {
    if (localStorage.getItem('theme')) {
      themeSwitcher();
    }

    moves = localStorage.getItem('mov');
    seconds = localStorage.getItem('sec');
    movesClicks.innerHTML = `${moves} moves`;
    duration.innerHTML = `${seconds} sec`;
    startTimer = true;
    const storage = localStorage.getItem('final');
    const uniqueActiveItem = new DOMParser()
      .parseFromString(storage, 'text/html')
      .getElementsByTagName('DIV');

    if (uniqueActiveItem.length === 225) {
      width = 15;
      bombAmount = 50;
      lowArray = [0, 14, 15, 16, 223, 210, 208, 209];
      grid.classList.remove('hard');
      grid.classList.add('medium');
    }

    if (uniqueActiveItem.length === 625) {
      grid.classList.remove('medium');
      grid.classList.add('hard');
      lowArray = [0, 25, 26, 27, 623, 600, 598, 599];
      width = 25;
      bombAmount = 90;
    }

    [...uniqueActiveItem].forEach((el) => {
      grid.appendChild(el);
      squares.push(el);

      if (el.className.substring(10, 19)
        .trim() === 'bomb-boom') {
        isGameOver = true;
        startTimer = true;
      }

      el.addEventListener('click', (e) => {
        if (!e.target.classList.contains('move')
          && !e.target.classList.contains('checked')
          && !isGameOver
          && !e.target.classList.contains('flag')) {
          e.target.classList.add('move');
          if (!e.target.classList.contains('bomb')) {
            audioPlay(audio);
          }
          moves++;
          movesClicks.innerHTML = `${moves} moves`;
        }
        click(el);
      });

      el.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(el);
      };
    });
  }

  for (let i = 0; i < squares.length; i++) {
    let count = 0;
    const isLeftEdge = (i % width === 0);
    const isRightEdge = (i % width === width - 1);

    if (squares[i].classList.contains('valid')) {
      if (i > lowArray[0] && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {
        count++;
      }
      if (i > lowArray[1] && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) {
        count++;
      }
      if (i >= lowArray[2] && squares[i - width].classList.contains('bomb')) {
        count++;
      }
      if (i >= lowArray[3] && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) {
        count++;
      }
      if (i <= lowArray[4] && !isRightEdge && squares[i + 1].classList.contains('bomb')) {
        count++;
      }
      if (i < lowArray[5] && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) {
        count++;
      }
      if (i <= lowArray[6] && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) {
        count++;
      }
      if (i <= lowArray[7] && squares[i + width].classList.contains('bomb')) {
        count++;
      }
      squares[i].setAttribute('data', count);
    }
  }
};

createContainer();

function addFlag(square) {
  if (isGameOver) return;
  if (!square.classList.contains('checked')) {
    if (!square.classList.contains('flag') && !square.classList.contains('question')) {
      square.classList.add('flag');
      square.innerHTML = '⚑';
      flagsAmount--;
      flagsCount.innerHTML = `${flagsAmount} Flags`;
      audioPlay(audioFlag);
      checkForWin();
    } else {
      if (square.classList.contains('flag')) {
        square.classList.remove('flag');
        square.classList.add('question');
        square.innerHTML = '?';
        flagsAmount++;
        flagsCount.innerHTML = `${flagsAmount} Flags`;
        audioPlay(audioFlagQuestion);
        return;
      }
      square.classList.remove('question');
      square.innerHTML = '';
    }
  }
}

function click(square) {
  const currentId = square.id;

  if (isGameOver) {
    return;
  }

  if (square.classList.contains('checked')
    || square.classList.contains('flag')
    || square.classList.contains('question')) {
    return;
  }

  if (square.classList.contains('bomb')) {
    gameOver(square);
  } else {
    const total = square.getAttribute('data');
    if (total != 0) {
      square.classList.add('checked');
      if (total == 1) {
        square.classList.add('blue-total');
        square.innerHTML = total;
      }
      if (total == 2) {
        square.classList.add('green-total');
        square.innerHTML = total;
      }
      if (total == 3) {
        square.classList.add('red-total');
        square.innerHTML = total;
      }
      if (total == 4) {
        square.classList.add('dark-blue-total');
        square.innerHTML = total;
      }
      if (total == 5) {
        square.classList.add('burgundy-total');
        square.innerHTML = total;
      }
      if (total == 6) {
        square.classList.add('turquoise-total');
        square.innerHTML = total;
      }
      if (total == 7) {
        square.classList.add('black-total');
        square.innerHTML = total;
      }
      if (total == 8) {
        square.classList.add('gray-total');
        square.innerHTML = total;
      }
      return;
    }

    checkSquare(square, currentId);
  }

  square.classList.add('checked');
}

function checkSquare(square, currentId) {
  const isLeftEdge = (currentId % width === 0);
  const isRightEdge = (currentId % width === width - 1);

  setTimeout(() => {
    if (currentId > lowArray[0] && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare, newId);
    }
    if (currentId > lowArray[1] && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > lowArray[2] + 1) {
      const newId = squares[parseInt(currentId) - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > lowArray[3] + 1 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < lowArray[4] + 1 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < lowArray[5] && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < lowArray[6] + 1 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < lowArray[7] + 1) {
      const newId = squares[parseInt(currentId) + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 20);
}

function gameOver(square) {
  resultPush('lost');
  alert('Booooom! Game over. Try again');
  isGameOver = true;
  startTimer = true;
  audioPlay(audioGameOver);

  square.classList.add('bomb-boom');
  squares.forEach((square) => {
    if (square.classList.contains('bomb')) {
      square.classList.add('bomb-not-boom');
    }
  });
}

const saveRes = () => {
  const resultedAllAfter = document.querySelectorAll('.result div');
  for (let i = 0; i < 10; i++) {
    localStorage.setItem(`result${i}`, resultedAllAfter[i].textContent);
  }
};

const resultPush = (res) => {
  const resultedAll = document.querySelectorAll('.result div');
  for (let i = 0; i < 10; i++) {
    if (resultedAll[i].textContent == '') {
      resultedAll[i].innerHTML = `You ${res} in ${seconds} seconds and ${moves} moves.`;
      return;
    }
    resultedAll[9].remove();
    const resultCheck = document.createElement('div');
    result.prepend(resultCheck);
    const resulted = document.querySelector('.result div');
    resulted.innerHTML = `You ${res} in ${seconds} seconds and ${moves} moves.`;
    saveRes();
    return;
  }
};

function checkForWin(checkedCount) {
  if (isGameOver || startTimer) {
    return;
  }

  let matches = 0;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
      matches++;
    }

    if (matches === bombAmount || checkedCount === (width * width - bombAmount)) {
      alert(`Hooray! You found all mines in ${seconds} seconds and ${moves} moves!`);
      isGameOver = true;
      startTimer = true;
      resultPush('won');
      audioPlay(audioWin);
      return;
    }
  }
}

setTimeout(() => {
  const resultedAll = document.querySelectorAll('.result div');
  for (let i = 0; i < 10; i++) {
    resultedAll[i].innerHTML = localStorage.getItem(`result${i}`);
  }
}, 100);
