import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol, FormsModule],
})
export class HomePage {
  display: string = '';
  currentNumber: string = '';
  operation: string = '';
  previousNumber: number = 0;

  constructor(private http: HttpClient) {}

  appendNumber(num: string) {
    this.currentNumber += num;
    this.display = this.currentNumber;
  }

  setOperation(op: string) {
    if (this.currentNumber !== '') {
      this.previousNumber = parseFloat(this.currentNumber);
      this.currentNumber = '';
      this.operation = op;
    }
  }

  calculate() {
    if (this.currentNumber !== '' && this.operation !== '') {
      const num2 = parseFloat(this.currentNumber);
      const opMap = { '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide' };
      const operation = opMap[this.operation as keyof typeof opMap];

      this.http.post('http://localhost:3000/api/calculate', {
        operation,
        num1: this.previousNumber,
        num2
      }).subscribe({
        next: (response: any) => {
          this.display = response.data.result.toString();
          this.currentNumber = this.display;
          this.operation = '';
        },
        error: (error) => {
          this.display = 'Error';
          this.currentNumber = '';
          this.operation = '';
        }
      });
    }
  }

  clear() {
    this.display = '';
    this.currentNumber = '';
    this.operation = '';
    this.previousNumber = 0;
  }
}
