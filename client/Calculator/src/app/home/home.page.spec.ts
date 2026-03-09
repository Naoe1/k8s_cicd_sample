import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { HomePage } from './home.page';

describe('HomePage - Calculator Component (Jest)', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonItem,
        IonInput,
        IonButton,
        IonGrid,
        IonRow,
        IonCol,
        HomePage,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Component Initialization', () => {
    it('should create the calculator component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty display', () => {
      expect(component.display).toBe('');
    });

    it('should initialize with empty current number', () => {
      expect(component.currentNumber).toBe('');
    });

    it('should initialize with no operation selected', () => {
      expect(component.operation).toBe('');
    });

    it('should clear display on error', (done) => {
      component.previousNumber = 10;
      component.operation = '/';
      component.currentNumber = '0';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      req.error(new ErrorEvent('Error'));

      expect(component.display).toBe('Error');
      expect(component.operation).toBe('');
      expect(component.currentNumber).toBe('');
      done();
    });
  });

  describe('Number Input Tests', () => {
    it('should append single number to display', () => {
      component.appendNumber('5');
      expect(component.display).toBe('5');
      expect(component.currentNumber).toBe('5');
    });

    it('should append multiple numbers to display', () => {
      component.appendNumber('1');
      component.appendNumber('2');
      component.appendNumber('3');
      expect(component.display).toBe('123');
      expect(component.currentNumber).toBe('123');
    });

    it('should append zero to display', () => {
      component.appendNumber('5');
      component.appendNumber('0');
      expect(component.display).toBe('50');
      expect(component.currentNumber).toBe('50');
    });

    it('should handle leading zeros', () => {
      component.appendNumber('0');
      component.appendNumber('0');
      component.appendNumber('5');
      expect(component.display).toBe('005');
      expect(component.currentNumber).toBe('005');
    });

    it('should handle single digit 0', () => {
      component.appendNumber('0');
      expect(component.display).toBe('0');
      expect(component.currentNumber).toBe('0');
    });

    it('should append all digit buttons 0-9', () => {
      const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      digits.forEach(digit => {
        component.appendNumber(digit);
      });
      expect(component.display).toBe('0123456789');
    });
  });

  describe('Operation Selection Tests', () => {
    it('should set addition operation and store previous number', () => {
      component.currentNumber = '10';
      component.setOperation('+');
      expect(component.previousNumber).toBe(10);
      expect(component.operation).toBe('+');
      expect(component.currentNumber).toBe('');
    });

    it('should set subtraction operation', () => {
      component.currentNumber = '25';
      component.setOperation('-');
      expect(component.previousNumber).toBe(25);
      expect(component.operation).toBe('-');
      expect(component.currentNumber).toBe('');
    });

    it('should set multiplication operation', () => {
      component.currentNumber = '7';
      component.setOperation('*');
      expect(component.previousNumber).toBe(7);
      expect(component.operation).toBe('*');
      expect(component.currentNumber).toBe('');
    });

    it('should set division operation', () => {
      component.currentNumber = '100';
      component.setOperation('/');
      expect(component.previousNumber).toBe(100);
      expect(component.operation).toBe('/');
      expect(component.currentNumber).toBe('');
    });

    it('should not set operation if no current number', () => {
      const initialPrevious = component.previousNumber;
      const initialOp = component.operation;
      component.setOperation('+');
      expect(component.previousNumber).toBe(initialPrevious);
      expect(component.operation).toBe(initialOp);
    });

    it('should switch operation after setting it', () => {
      component.currentNumber = '10';
      component.setOperation('+');
      expect(component.operation).toBe('+');
      expect(component.previousNumber).toBe(10);
    });
  });

  describe('Calculation Tests - Individual Operations', () => {
    it('should calculate addition: 5 + 3 = 8', (done) => {
      component.previousNumber = 5;
      component.operation = '+';
      component.currentNumber = '3';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        operation: 'add',
        num1: 5,
        num2: 3,
      });

      req.flush({ success: true, data: { result: 8 } });

      expect(component.display).toBe('8');
      expect(component.currentNumber).toBe('8');
      expect(component.operation).toBe('');
      done();
    });

    it('should calculate subtraction: 10 - 4 = 6', (done) => {
      component.previousNumber = 10;
      component.operation = '-';
      component.currentNumber = '4';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.body.operation).toBe('subtract');
      expect(req.request.body).toEqual({
        operation: 'subtract',
        num1: 10,
        num2: 4,
      });
      req.flush({ success: true, data: { result: 6 } });

      expect(component.display).toBe('6');
      done();
    });

    it('should calculate multiplication: 7 * 6 = 42', (done) => {
      component.previousNumber = 7;
      component.operation = '*';
      component.currentNumber = '6';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.body.operation).toBe('multiply');
      expect(req.request.body).toEqual({
        operation: 'multiply',
        num1: 7,
        num2: 6,
      });
      req.flush({ success: true, data: { result: 42 } });

      expect(component.display).toBe('42');
      done();
    });

    it('should calculate division: 20 / 4 = 5', (done) => {
      component.previousNumber = 20;
      component.operation = '/';
      component.currentNumber = '4';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.body.operation).toBe('divide');
      expect(req.request.body).toEqual({
        operation: 'divide',
        num1: 20,
        num2: 4,
      });
      req.flush({ success: true, data: { result: 5 } });

      expect(component.display).toBe('5');
      done();
    });

    it('should calculate with decimal result: 15 / 3 = 5', (done) => {
      component.previousNumber = 15;
      component.operation = '/';
      component.currentNumber = '3';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      req.flush({ success: true, data: { result: 5 } });

      expect(component.display).toBe('5');
      done();
    });

    it('should handle large number calculations', (done) => {
      component.previousNumber = 999;
      component.operation = '+';
      component.currentNumber = '1';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      req.flush({ success: true, data: { result: 1000 } });

      expect(component.display).toBe('1000');
      done();
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle division by zero error from backend', (done) => {
      component.previousNumber = 10;
      component.operation = '/';
      component.currentNumber = '0';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      req.error(new ErrorEvent('Division by zero'));

      expect(component.display).toBe('Error');
      expect(component.currentNumber).toBe('');
      expect(component.operation).toBe('');
      done();
    });

    it('should handle network error gracefully', (done) => {
      component.previousNumber = 5;
      component.operation = '+';
      component.currentNumber = '3';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      req.error(new ErrorEvent('Network error'));

      expect(component.display).toBe('Error');
      expect(component.currentNumber).toBe('');
      expect(component.operation).toBe('');
      done();
    });

    it('should handle server error (500)', (done) => {
      component.previousNumber = 5;
      component.operation = '+';
      component.currentNumber = '3';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      req.error(new ErrorEvent('Server error'));

      expect(component.display).toBe('Error');
      done();
    });

    it('should reset operation state after error', (done) => {
      component.previousNumber = 10;
      component.operation = '/';
      component.currentNumber = '0';

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      req.error(new ErrorEvent('Error'));

      expect(component.operation).toBe('');
      expect(component.currentNumber).toBe('');
      done();
    });
  });

  describe('Clear/Reset Tests', () => {
    it('should clear display and reset all values', () => {
      component.display = '123';
      component.currentNumber = '123';
      component.operation = '+';
      component.previousNumber = 50;

      component.clear();

      expect(component.display).toBe('');
      expect(component.currentNumber).toBe('');
      expect(component.operation).toBe('');
      expect(component.previousNumber).toBe(0);
    });

    it('should reset after incomplete operation', () => {
      component.currentNumber = '42';
      component.setOperation('+');
      component.clear();

      expect(component.display).toBe('');
      expect(component.operation).toBe('');
    });

    it('should allow new calculation after clear', () => {
      component.display = '100';
      component.currentNumber = '100';
      component.clear();

      component.appendNumber('5');
      expect(component.display).toBe('5');
    });
  });

  describe('End-to-End Calculator Flow Tests', () => {
    it('should perform complete flow: 15 + 8 = 23', (done) => {
      // Input first number
      component.appendNumber('1');
      component.appendNumber('5');
      expect(component.display).toBe('15');

      // Set addition operation
      component.setOperation('+');
      expect(component.operation).toBe('+');
      expect(component.previousNumber).toBe(15);

      // Input second number
      component.appendNumber('8');
      expect(component.display).toBe('8');

      // Calculate
      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.body).toEqual({
        operation: 'add',
        num1: 15,
        num2: 8,
      });
      req.flush({ success: true, data: { result: 23 } });

      expect(component.display).toBe('23');
      done();
    });

    it('should perform complete flow: 100 - 35 = 65', (done) => {
      component.appendNumber('1');
      component.appendNumber('0');
      component.appendNumber('0');
      component.setOperation('-');
      component.appendNumber('3');
      component.appendNumber('5');

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.body).toEqual({
        operation: 'subtract',
        num1: 100,
        num2: 35,
      });
      req.flush({ success: true, data: { result: 65 } });

      expect(component.display).toBe('65');
      done();
    });

    it('should perform complete flow: 12 * 5 = 60', (done) => {
      component.appendNumber('1');
      component.appendNumber('2');
      component.setOperation('*');
      component.appendNumber('5');

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.body).toEqual({
        operation: 'multiply',
        num1: 12,
        num2: 5,
      });
      req.flush({ success: true, data: { result: 60 } });

      expect(component.display).toBe('60');
      done();
    });

    it('should perform complete flow: 144 / 12 = 12', (done) => {
      component.appendNumber('1');
      component.appendNumber('4');
      component.appendNumber('4');
      component.setOperation('/');
      component.appendNumber('1');
      component.appendNumber('2');

      component.calculate();

      const req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.body).toEqual({
        operation: 'divide',
        num1: 144,
        num2: 12,
      });
      req.flush({ success: true, data: { result: 12 } });

      expect(component.display).toBe('12');
      done();
    });

    it('should allow chaining calculations', (done) => {
      // First calculation: 10 + 5 = 15
      component.appendNumber('1');
      component.appendNumber('0');
      component.setOperation('+');
      component.appendNumber('5');

      component.calculate();

      const req1 = httpMock.expectOne('http://localhost:3000/api/calculate');
      req1.flush({ success: true, data: { result: 15 } });

      expect(component.display).toBe('15');
      expect(component.currentNumber).toBe('15');

      // Second calculation: 15 * 2 = 30
      component.setOperation('*');
      component.appendNumber('2');

      component.calculate();

      const req2 = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req2.request.body).toEqual({
        operation: 'multiply',
        num1: 15,
        num2: 2,
      });
      req2.flush({ success: true, data: { result: 30 } });

      expect(component.display).toBe('30');
      done();
    });

    it('should handle triple operation chain correctly', (done) => {
      // 5 + 3 = 8
      component.appendNumber('5');
      component.setOperation('+');
      component.appendNumber('3');

      component.calculate();

      let req = httpMock.expectOne('http://localhost:3000/api/calculate');
      req.flush({ success: true, data: { result: 8 } });

      // 8 - 2 = 6
      component.setOperation('-');
      component.appendNumber('2');

      component.calculate();

      req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.body.num1).toBe(8);
      req.flush({ success: true, data: { result: 6 } });

      // 6 * 3 = 18
      component.setOperation('*');
      component.appendNumber('3');

      component.calculate();

      req = httpMock.expectOne('http://localhost:3000/api/calculate');
      expect(req.request.body.num1).toBe(6);
      req.flush({ success: true, data: { result: 18 } });

      expect(component.display).toBe('18');
      done();
    });

    it('should handle clear in middle of calculation', () => {
      component.appendNumber('5');
      component.setOperation('+');
      component.appendNumber('3');
      component.clear();

      expect(component.display).toBe('');
      expect(component.currentNumber).toBe('');
      expect(component.operation).toBe('');
      expect(component.previousNumber).toBe(0);

      // Should be able to start new calculation
      component.appendNumber('1');
      expect(component.display).toBe('1');
    });
  });
});