# Breakout-TS

Game of Breakout written in TypeScript.

For the best user experience, play in a square or portrait-oriented window, such as those commonly found on mobile devices

Instructions for how to play the game are located on the pause screen of the game.

## What is Breakout?

Breakout (also known as Atari Breakout) is an arcade video game originally developed and published by Atari, Inc. and released in 1976.
In Breakout, a layer of bricks lines the top third of the screen, and the goal is to destroy them all by repeatedly bouncing a ball off a paddle into them.

## Running the Development Server
To run the development server, use the following command:
~~~sh
npm run dev
~~~

## Setting Up the Project
To create the TypeScript template and set up the project, use these commands:
~~~sh
npm create vite@latest Breakout-TS -- --template vanilla-ts
# Need to install the following packages:
# create-vite@5.3.0
# Ok to proceed? (y) y

# Scaffolding project in ...\\Breakout-TS...

# Done. Now run:

cd Breakout-TS
npm install
npm run dev
~~~