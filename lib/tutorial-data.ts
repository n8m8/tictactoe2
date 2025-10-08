import type { TutorialStepData } from '@/components/tutorial/TutorialStep'

export const tutorialSteps: TutorialStepData[] = [
  {
    title: 'Welcome to Ultimate Tic Tac Toe!',
    description: `Ultimate Tic Tac Toe is a strategic twist on the classic game.

Instead of one 3×3 grid, you play on a 3×3 grid of smaller 3×3 grids!

Win small games to claim squares on the big board.
Get 3 in a row on the big board to win!`,
    highlight: 'Think of it as 9 mini tic-tac-toe games combined into one epic battle!',
  },
  {
    title: 'The Main Board',
    description: `The game board consists of 9 mini-games arranged in a 3×3 grid.

Each mini-game is a standard 3×3 tic-tac-toe board.

Your goal is to win mini-games to claim their positions on the main board.`,
    highlight: 'Win 3 mini-games in a row (horizontally, vertically, or diagonally) to win!',
  },
  {
    title: 'Making Moves',
    description: `Players alternate turns, just like regular tic-tac-toe.

You are X (Blue) and your opponent is O (Red).

Click any available cell in the highlighted mini-game to make your move.`,
    highlight: 'The first move can be made in ANY mini-game!',
  },
  {
    title: 'The Special Rule',
    description: `Here's where it gets interesting:

The mini-game where you place your mark determines where your opponent must play next!

For example:
• If you mark the top-right cell of a mini-game
• Your opponent MUST play in the top-right mini-game

If that mini-game is already won or full, they can play anywhere!`,
    highlight: 'Use this rule strategically to control where your opponent can play!',
  },
  {
    title: 'Winning Mini-Games',
    description: `To win a mini-game, get 3 in a row within that mini-game (just like regular tic-tac-toe).

When you win a mini-game:
• It shows your symbol (X or O) in large letters
• That square on the main board is now claimed by you
• No more moves can be made in that mini-game`,
    highlight: 'Mini-games can also end in a draw if all cells are filled with no winner.',
  },
  {
    title: 'Winning the Game',
    description: `You win the overall game by winning 3 mini-games in a row on the main board.

This works just like regular tic-tac-toe:
• 3 in a row horizontally
• 3 in a row vertically
• 3 in a row diagonally

The game can also end in a draw if all mini-games are complete with no winner on the main board.`,
    highlight: 'Balance between winning mini-games and controlling the board strategically!',
  },
  {
    title: 'Strategy Tips',
    description: `1. Control the Center: The center mini-game and center cells are powerful positions.

2. Think Ahead: Consider where your move will send your opponent.

3. Set Traps: Force your opponent into mini-games where you have an advantage.

4. Block Smartly: Sometimes blocking is more important than advancing.

5. Double Threats: Try to create winning opportunities in multiple mini-games.`,
    highlight: 'The key is thinking 2-3 moves ahead about where you AND your opponent will play!',
  },
  {
    title: 'Game Modes',
    description: `Ultimate Tic Tac Toe offers multiple ways to play:

• Multiplayer: Play with a friend using a join code
• Single Player: Practice against AI (Easy, Medium, or Hard)
• Tutorial: You're here now!

Session scores track your wins across multiple games until you quit.`,
    highlight: 'Ready to play? Try Single Player mode to practice your strategy!',
  },
]
