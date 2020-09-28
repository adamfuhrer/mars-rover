import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        FormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should validate plateau input string as invalid input`, () => {
    component.setPlateau('5 5 5');
    expect(component.isCorrectPlateauInput).toBe(false);
  });

  it(`should validate plateau input string as valid input`, () => {
    component.setPlateau('10 10');
    expect(component.isCorrectPlateauInput).toBe(true);
  });

  it(`should validate landing input string as invalid input`, () => {
    component.setLanding('1 2 G');
    expect(component.isCorrectLandingInput).toBe(false);
  });

  it(`should validate landing input string as valid input`, () => {
    component.setLanding('1 2 N');
    expect(component.isCorrectLandingInput).toBe(true);
  });

  it(`should validate instructions input string as invalid input`, () => {
    component.setInstructions('LMLMLMLMLMROO');
    expect(component.isCorrectInstructionsInput).toBe(false);
  });

  it(`should validate instructions input string as valid input`, () => {
    component.setInstructions('LMLMLMLMLMR');
    expect(component.isCorrectInstructionsInput).toBe(true);
  });

  it(`should get the next direction from 'R' instruction`, () => {
    expect(component.getNextDirection('R', 'N')).toBe('E');
  });

  it(`should get the next direction from 'L' instruction`, () => {
    expect(component.getNextDirection('L', 'N')).toBe('W');
  });

  it(`should perform navigation of the mars rover and return new co-ordinates`, () => {
    component.currentOrientation = 'N';
    component.plateau = [5, 5];
    const newCords = component.getNewCoordinatesFromNavigation('LMLMLMLMM', [1, 2]);
    expect(newCords[0]).toEqual(1);
    expect(newCords[1]).toEqual(3);
  });

  it(`should stay within the bounds of the plateau when performing navigation`, () => {
    component.currentOrientation = 'N';
    component.plateau = [5, 5];
    const newCords = component.getNewCoordinatesFromNavigation('MMMMMRMMMMM', [5, 5]);
    expect(newCords[0]).toEqual(5);
    expect(newCords[1]).toEqual(5);
  });

  it(`should output new co-ordinates and current direction on navigation button click`, () => {
    component.plateauInput = '5 5';
    component.landingInput = '1 2 N';
    component.instructionsInput = 'LMLMLMLMM';
    component.onNavigateClick();
    expect(component.output).toEqual('1 3 N');
  });
});
