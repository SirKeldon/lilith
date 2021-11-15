import { regular as C } from './constants.js';

export class Drawer {
    canvas
    htmlElem
    settings
    constructor(htmlId, settings) {
        this.htmlElem = document.getElementById(htmlId);
        this.canvas = this.htmlElem.getContext('2d');
        this.settings = { ...settings }
        this.adjustGrid();
    }

    adjustGrid() {
        const { cols, rows, size } = this.settings;
        this.htmlElem.width = `${cols*size}`;
        this.htmlElem.height = `${rows*size}`;
    }

    clear() {
        const { canvas, htmlElem } = this;
        canvas.fillStyle = C.colors.black;
        canvas.fillRect(0, 0, htmlElem.width, htmlElem.height);
    }

    drawHead(x, y, color, direction, coords) {
        const { canvas, settings } = this;
        const midX = (x*settings.size)+(settings.size/2);
        const midY = (y*settings.size)+(settings.size/2);
        canvas.fillStyle = color;
        canvas.beginPath();
        switch (direction) {
            case coords.NORTH: canvas.arc(midX, midY, settings.size/2, Math.PI, 2*Math.PI); break;
            case coords.SOUTH: canvas.arc(midX, midY, settings.size/2, 0, Math.PI); break;
            case coords.WEST: canvas.arc(midX, midY, settings.size/2, 0.5*Math.PI, 1.5*Math.PI); break;
            case coords.EAST: canvas.arc(midX, midY, settings.size/2, 1.5*Math.PI, 0.5*Math.PI); break;
            //default: this.drawCircle(x, y, color); break;
        }
        // canvas.closePath();
        canvas.fill();
    }

    drawCircle(x, y, color) {
        const { canvas, settings } = this;
        canvas.fillStyle = color;
        canvas.beginPath();
        canvas.arc((x*settings.size)+(settings.size/2), (y*settings.size)+(settings.size/2), settings.size/2, 0, 2*Math.PI);
        canvas.fill();
    }

    drawSquare( x, y, color) {
        const { canvas, settings } = this;
        canvas.fillStyle = color
        canvas.fillRect(x*settings.size, y*settings.size, settings.size, settings.size)
    }

    drawTextRectangle() {
        const { canvas, settings, htmlElem } = this;
        canvas.fillStyle = C.colors.gray;
        canvas.globalAlpha = 0.75;
        canvas.fillRect(settings.size*4, settings.size*4, htmlElem.width - settings.size*8, htmlElem.height - settings.size*8);
        canvas.globalAlpha = 1;
    }

    drawText(sentence, x, y, font, color) {
        const { canvas, settings } = this;
        canvas.font = font;
        canvas.textAlign = "start";
        canvas.fillStyle = color;
        canvas.fillText(sentence, settings.size*x, settings.size*y);
    }

    drawInstructions() {
        this.drawTextRectangle();
        this.drawText(C.sentences.howto.title, 8, 6.5, C.fonts.title, C.colors.red);
        this.drawText(C.sentences.howto.line1, 6, 8.5, C.fonts.line, C.colors.lite);
        this.drawText(C.sentences.howto.line2, 6, 10, C.fonts.line, C.colors.lite);
    }

    drawGameOver(reason) {
        this.drawTextRectangle();
        this.drawText(C.sentences.over.title, 8.5, 6.5, C.fonts.title, C.colors.red);
        this.drawText(C.sentences.over.line1, 7, 8.5, C.fonts.line2, C.colors.lite);
        this.drawText(`${C.sentences.over.line2}${reason}`, 6.8, 10, C.fonts.line2, C.colors.lite);
    }
}