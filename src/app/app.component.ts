import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly orientations = ['N', 'S', 'E', 'W'];
  readonly navigationInstructions = ['L', 'R', 'M'];

  // Input strings
  plateauInput: string;
  landingInput: string;
  instructionsInput: string;

  // Key data for navigating the rover
  plateau = [];
  currentPosition = [];
  currentOrientation: string;
  instructions = [];

  // Data validation booleans
  isIncorrectPlateauInput = false;
  isIncorrectLandingInput = false;
  isIncorrectInstructionsInput = false;

  // Generated output data
  output: string;

  /**
   * On button click, parse and validate the input data and generate the output co-ordinates and orientation
   */
  onNavigateClick() {
    this.plateauInput ? this.setPlateau(this.plateauInput) : this.isIncorrectPlateauInput = true;
    this.landingInput ? this.setLanding(this.landingInput) : this.isIncorrectLandingInput = true;
    this.instructionsInput ? this.setInstructions(this.instructionsInput) :  this.isIncorrectInstructionsInput = true;

    if (this.hasValidRoverInput()) {
      const newPosition = this.getNewCoordinatesFromNavigation(this.instructionsInput, this.currentPosition);
      this.output = newPosition[0] + ' ' + newPosition[1] + ' ' + this.currentOrientation;
    }
  }

  /**
   * Get the new coordinates based on a set of instructions and the current position of the rover
   * @param instructions      The set of instructions to follow {string}
   * @param currentPosition   Current position on the rover {number[]}
   * @return newCoordinates {number[]}
   */
  getNewCoordinatesFromNavigation(instructions: string, currentPosition: number[]): number[] {
    for (const instruction of instructions) {
      // Handle move instruction
      if (instruction === 'M') {
        // If facing along the x axis for the move operation, get the next x co-ordinate otherwise set next y co-ordinate
        if (this.currentOrientation === 'W' || this.currentOrientation === 'E') {
          currentPosition[0] = this.getNextXCoordinate(currentPosition[0], this.currentOrientation);
        } else if (this.currentOrientation === 'N' || this.currentOrientation === 'S') {
          currentPosition[1] = this.getNextYCoordinate(currentPosition[1], this.currentOrientation);
        }
      } else {
        // Handle direction change
        this.currentOrientation = this.getNextDirection(instruction, this.currentOrientation);
      }
    }
    return currentPosition;
  }

  /**
   * Get the next direction based on current direction and instruction direction
   * @param instruction       'L' | 'R' {string}
   * @param currentDirection  'N' | 'S' | 'E' | 'W' {string}
   * @return newDirection {string}
   */
  getNextDirection(instruction: string, currentDirection: string): string {
    const isLeft = instruction === 'L';
    switch (currentDirection) {
      case 'N':
        return isLeft ? 'W' : 'E';
      case 'E':
        return isLeft ? 'N' : 'S';
      case 'S':
        return isLeft ? 'E' : 'W';
      case 'W':
        return isLeft ? 'S' : 'N';
    }
  }

  /**
   * Get the next X co-ordinate based on direction and boundaries of the plateau
   * @param currentX    Current Y cord {number}
   * @param direction   Direction to navigate {string}
   * @return nextCord {number}
   */
  getNextXCoordinate(currentX: number, direction: string): number {
    // We assume the plateau boundaries are set
    if (this.plateau) {
      if (direction === 'W' && currentX - 1 >= 0) {
        return currentX - 1;
      } else if (direction === 'E' && currentX + 1 <= this.plateau[0]) {
        return currentX + 1;
      } else {
        // The bounds of the plateau have been reached
        return currentX;
      }
    }
  }

  /**
   * Get the next Y co-ordinate based on direction and boundaries of the plateau
   * @param currentY    Current Y cord {number}
   * @param direction   Direction to navigate {string}
   * @return nextCord {number}
   */
  getNextYCoordinate(currentY: number, direction: string): number {
    // We assume the plateau boundaries are set
    if (this.plateau) {
      if (direction === 'N' && currentY + 1 <= this.plateau[1]) {
        return currentY + 1;
      } else if (direction === 'S' && currentY - 1 >= 0) {
        return currentY - 1;
      } else {
        // The bounds of the plateau have been reached
        return currentY;
      }
    }
  }

  /**
   * Validate and set the plateau co-ordinates array based on the plateau input string
   * @param plateauInput    eg: 5 5 {string}
   * @return void
   */
  setPlateau(plateauInput: string): void {
    const plateau = plateauInput.trim().split(' ');
    const plateauX = Number(plateau[0]);
    const plateauY = Number(plateau[1]);

    // Validate the input
    this.isIncorrectPlateauInput = plateau.length !== 2
      || !Number.isInteger(plateauX)
      || !Number.isInteger(plateauY);

    if (!this.isIncorrectPlateauInput) {
      this.plateau[0] = plateauX;
      this.plateau[1] = plateauY;
    }
  }

  /**
   * Validate and set current position and current orientation based on the landing input string
   * @param landingInput    eg: 1 2 N {string}
   * @return void
   */
  setLanding(landingInput: string): void {
    const landing = landingInput.trim().split(' ');
    const currentX = Number(landing[0]);
    const currentY = Number(landing[1]);
    const direction = landing[2];

    // Validate the input
    this.isIncorrectLandingInput = landing.length !== 3
      || !Number.isInteger(currentX)
      || !Number.isInteger(currentY)
      || !this.isOrientation(direction);

    if (!this.isIncorrectLandingInput) {
      this.currentPosition[0] = currentX;
      this.currentPosition[1] = currentY;
      this.currentOrientation = direction;
    }
  }

  /**
   * Validate and set current position and current orientation based on the landing input string
   * @param instructionsInput    eg: 1 2 N {string}
   * @return void
   */
  setInstructions(instructionsInput: string): void {
    const instructions = instructionsInput.trim().split('');
    this.isIncorrectInstructionsInput = !instructions.every(instruction => this.isNavigationInstruction(instruction));

    if (!this.isIncorrectLandingInput) {
      this.instructions = instructions;
    }
  }

  /**
   * Check if string is a correct orientation
   * @param orientation ('N', 'S', 'E', 'W') {string}
   * @return boolean
   */
  isOrientation(orientation: string): boolean {
    return this.orientations.includes(orientation);
  }

  /**
   * Check if string is a correct navigation instruction
   * @param navigation ('L', 'R', 'M') {string}
   * @return boolean
   */
  isNavigationInstruction(navigation: string): boolean {
    return this.navigationInstructions.includes(navigation);
  }

  /**
   * Check if all input values have valid data
   * @return boolean
   */
  hasValidRoverInput(): boolean {
    return !this.isIncorrectPlateauInput && !this.isIncorrectLandingInput && !this.isIncorrectInstructionsInput;
  }
}
