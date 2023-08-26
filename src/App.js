import * as React from 'react';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Flex, Box, Heading, Button, Grid } from '@chakra-ui/react';

const lastState = // Set to null to turn off save game
{
  squares: JSON.parse(localStorage.getItem('squares')),
  nextPlayer: JSON.parse(localStorage.getItem('nextPlayer')),
  winner: JSON.parse(localStorage.getItem('winner')),
  winnerLine: JSON.parse(localStorage.getItem('winnerLine')),
  status: JSON.parse(localStorage.getItem('status')),
}// ✖ ⭕ ❌

const ticTacToe = createSlice({
  name: 'ticTacToe',
  initialState: lastState ?? {
    squares: Array(9).fill(null),
    nextPlayer: "❌",
    winner: null,
    winnerLine: null,
    status: "Next player: ❌"
  },
  reducers: {
    selectSquare(state, action) {
      if (!state.squares[action.payload] && !state.winner) {
      const newSquares = [...state.squares]
      newSquares[action.payload] = state.nextPlayer
      const nextPlayer = calculateNextValue(newSquares)
      const findWinner = calculateWinner(newSquares)
      let winner = null
      let winnerLine = null
      if (findWinner) {
        winner = findWinner.player
        winnerLine = findWinner.line
      }
      const status = calculateStatus(winner, newSquares, nextPlayer)
      return {
        squares: newSquares,
        nextPlayer,
        winner,
        winnerLine,
        status
      }
    }
  },
    restart(state) {
      localStorage.clear()
      return {
        squares: Array(9).fill(null),
        nextPlayer: "❌",
        winner: null,
        winnerLine: null,
        status: "Next player: ❌"
      }
    }
}
})

export const { selectSquare, restart } = ticTacToe.actions;

const store = configureStore({
  reducer: ticTacToe.reducer
})

function Board() {
  const {squares, nextPlayer, winner, winnerLine, status} = useSelector(state => state)

  // Hooks to save current board to localStorage
  React.useEffect(() => {
    localStorage.setItem('squares', JSON.stringify(squares))
    localStorage.setItem('nextPlayer', JSON.stringify(nextPlayer))
    localStorage.setItem('winner', JSON.stringify(winner))
    localStorage.setItem('winnerLine', JSON.stringify(winnerLine))
    localStorage.setItem('status', JSON.stringify(status))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[squares])

  const dispatch = useDispatch()
  
  let firstSquare = null
  let secondSquare = null
  let thirdSquare = null
  if (winnerLine) {
    firstSquare = winnerLine[0]
    secondSquare = winnerLine[1]
    thirdSquare = winnerLine[2]
  }
  
  function renderSquare(i) {
    if (winnerLine) {
      if (i === firstSquare || i === secondSquare || i === thirdSquare) {
        return (
          <Button colorScheme='blue' bgColor='dub' width='7rem' height='7rem' fontSize='6xl' p={0}
          onClick={() => {dispatch(selectSquare(i))}}>
            {squares[i]}
          </Button>
        );
      }
    }
    return (
      <Button width='7rem' height='7rem' fontSize='6xl' p={0}
      onClick={() => {dispatch(selectSquare(i))}}>
        {squares[i]}
      </Button>
    );
    
  }

  return (
    <Grid gap='.7rem' templateColumns='repeat(3, 1fr)' p='1rem' mb='2rem' bgColor='board' borderRadius='.8rem'>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
    </Grid>
  );
}

function Game() {
  const status = useSelector(state => state.status)
  const dispatch = useDispatch()
  return (
      <Box >
        <Heading size='2xl' textAlign='center' mb='1rem'>tiktaktu</Heading>
        <Heading size='md' textAlign='center' mb='.3rem'>{status}</Heading>
        <Board />
        <Flex justifyContent='center'>
          <Button colorScheme='purple' variant='outline' width='20rem'
          onClick={() => {dispatch(restart())}}>
            RESTART
          </Button>
        </Flex>
      </Box>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? `Draw`
      : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? '❌' : '⭕';
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return squares[a];
      // Customize
      return { line: lines[i], player: squares[a] }
    }
  }
  return null;
}

function App() {
  return (
  <Provider store={store}>
    <Flex align='center' justify='center'>
      <Game />
    </Flex>
  </Provider>
  )
}

export default App;
