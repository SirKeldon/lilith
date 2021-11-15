import { regular as C } from './constants.js';
import { Snake } from './snake.js';
import { Drawer } from './drawer.js';

class SnakeGame {
    // Flag to show instructions
    isFirstGame = true;
    // Default settings, you can change them on start
    defaultSettings = {
        cols: 18,
        rows: 10,
        size: 20
    };
    // Init State and Settings
    state = {};
    settings = {};

    constructor(htmlId, settings) {
        // Establishing settings
        Object.keys(this.defaultSettings)
        .forEach((key) => {
            this.settings[key] = settings[key] || this.defaultSettings[key];
        });
        this.snake = new Snake(this.settings.rows, this.settings.cols);
        this.drawer = new Drawer(htmlId, settings);
        // Getting Canvas Element and adjusting it to the approppriate size
        this.__addListeners();

        // Prepare board for new game
        this.new();
    }

    __addListeners() {
        const { snake } = this;
        document.addEventListener('keydown', (ev) => {
            let move = false;
            switch (ev.key) {
                case 'ArrowUp':   case 'W': case 'w': move = snake.coords.NORTH; break;
                case 'ArrowDown': case 'S': case 's': move = snake.coords.SOUTH; break;
                case 'ArrowLeft': case 'A': case 'a': move = snake.coords.WEST;  break;
                case 'ArrowRight':case 'D': case 'd': move = snake.coords.EAST;  break;
                                  case 'N': case 'n': this.new(); break;
                                             default: break;
            }
            if (move && this.state.snake) {
                ev.preventDefault();
                if (!this.state.snake.running && !this.state.snake.lost)
                    this.start();
                this.snake.queue(move);
            }
        });
    }

    /**
     * HELPERS FOR GFX
     **/
    __updateScore() {
        const getElem = (id) => document.getElementById(id)
        const level = getElem('level'),
              points = getElem('points'),
              apples = getElem('apples');

        level.innerHTML = this.state.snake.level;
        points.innerHTML = this.state.snake.score;
        apples.innerHTML = this.state.snake.apples;
    }

    /**
     * GAME INTERNALS
     **/
    __reset() {
        this.state = {};
    }

    new() {
        this.snake.reset();
        this.state = {
            ...this.state,
            snake: this.snake.data
        };
        window.requestAnimationFrame(this.drawer.clear.bind(this.drawer));
        window.requestAnimationFrame(this.update.bind(this));
        if (this.isFirstGame) {
            // Give time to load the font
            setTimeout(() => window.requestAnimationFrame(this.drawer.drawInstructions.bind(this.drawer)), 200)
        }
    }

    start() {
        this.isFirstGame = this.isFirstGame ? !this.isFirstGame : !!this.isFirstGame;
        this.snake.start();
        window.requestAnimationFrame(this.drawer.clear.bind(this.drawer));
        window.requestAnimationFrame(this.step.call(this, 0));
    }

    end(reason) {
        window.requestAnimationFrame(this.drawer.drawGameOver.bind(this.drawer, reason));
        this.__reset();
    }

    /**
     * UPDATE AND STEP - WHERE THE MAGIC HAPPENS
     **/

    update() {
        const { snake } = this.state;
        const edibles = snake && snake.edibles || {};
        let head = snake && snake.updates.head || false,
            tail = snake && snake.updates.tail || false;

        if (/*!head && !tail &&*/ snake?.dots.length >= 1)
            snake.dots.forEach((dot, index) => {
                if (index === 0)
                    this.drawer.drawHead(dot.x, dot.y, C.colors.green, this.state.snake.direction, this.snake.coords);
                else
                    this.drawer.drawSquare(dot.x, dot.y, C.colors.green)
            })

        if (edibles.apple)
            this.drawer.drawCircle(edibles.apple.x, edibles.apple.y, C.colors.red);

        if (edibles.virus)
            this.drawer.drawSquare(edibles.virus.x, edibles.virus.y, C.colors.blue)

        // if (head)
        //     this.drawer.drawSquare(head.x, head.y, C.colors.green)
        if (tail)
            this.drawer.drawSquare(tail.x, tail.y, C.colors.black)

        this.__updateScore();
    }

    step = (then) => async (now) => {
        if (this.state.snake.running) {
            if (now - then > (250 - this.snake.data.level*20) || this.snake.data.processing) {
                const data = await this.snake.next();
                const oldData = {...this.state.snake};
                this.state = {
                    ...this.state,
                    snake: data
                };
                this.update(oldData);
                window.requestAnimationFrame(this.step(now));
            } else {
                window.requestAnimationFrame(this.step(then))
            }
        } else {
            this.end(this.state.snake.endReason)
            window.cancelAnimationFrame(null);
        }
    }
}

const game = new SnakeGame("game", { rows: 16, cols: 30, size: 15 });