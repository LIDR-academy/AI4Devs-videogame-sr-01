# Conway's Game of Life

Developed with Claude Sonnet 4 under VS's copilot with my generation
configurations under my user's setting

## Prompt 1: Planning

Role: you're a senior software engineer specialized front-end

Task: develop a broad step-by-step plan of what will take to build the conway's
game of life

Context: we will focus first on design how the game will work, then we will
implement it using vanilla JavaScript, HTML, and CSS

## Pompt 2: Create basic game

Start the first implementation phase by setting up the project structure and
basic functionalities

## Prompt 3: Corrections

Let's correct some of implementation issues

- The still life blocks do not appear on the pattern selector
- The "reset" button does not reset the grid, instead it fills it with random
  cells, I think we can remove it from the pattern selector because the button will be better UX
- When i add a single cell it disappears
- The UI for adding patterns is not intuitive, it should highlight the cell where the pattern will be placed and show a "shadown" of the pattern that does not affect the grid until the user clicks to confirm placement
- When game is running, users cannot edit the grid, we should allow users to pause the game before editing

Let's focus on fixing these issues one by one before moving to the next

## Prompt 4: Add generation controls

I want to be able to "go" a specific generation, by setting a number on a slider I should go tot that generation, the slider should have a maximum value of the current generation