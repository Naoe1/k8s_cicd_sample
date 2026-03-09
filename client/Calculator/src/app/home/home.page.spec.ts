import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should append number to display', () => {
    component.appendNumber('5');
    expect(component.display).toBe('5');
    expect(component.currentNumber).toBe('5');
  });

  it('should set operation', () => {
    component.currentNumber = '10';
    component.setOperation('+');
    expect(component.previousNumber).toBe(10);
    expect(component.operation).toBe('+');
    expect(component.currentNumber).toBe('');
  });

  it('should calculate addition', () => {
    component.previousNumber = 5;
    component.operation = '+';
    component.currentNumber = '3';

    component.calculate();

    const req = httpMock.expectOne('http://localhost:3000/api/calculate');
    expect(req.request.method).toBe('POST');
    req.flush({
      success: true,
      data: { result: 8 }
    });

    expect(component.display).toBe('8');
    expect(component.currentNumber).toBe('8');
    expect(component.operation).toBe('');
  });

  it('should handle calculation error', () => {
    component.previousNumber = 10;
    component.operation = '/';
    component.currentNumber = '0';

    component.calculate();

    const req = httpMock.expectOne('http://localhost:3000/api/calculate');
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('network error'));

    expect(component.display).toBe('Error');
    expect(component.currentNumber).toBe('');
    expect(component.operation).toBe('');
  });

  it('should clear display', () => {
    component.display = '123';
    component.currentNumber = '123';
    component.operation = '+';
    component.previousNumber = 5;

    component.clear();

    expect(component.display).toBe('');
    expect(component.currentNumber).toBe('');
    expect(component.operation).toBe('');
    expect(component.previousNumber).toBe(0);
  });
});
