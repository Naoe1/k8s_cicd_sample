describe('Calculator App - Automated Visual Testing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(2000); // Wait for app to load
  });

  describe('Calculator Display and UI', () => {
    it('should display the calculator app', () => {
      cy.contains('Calculator').should('be.visible');
      cy.get('ion-input').should('exist');
    });

    it('should have all number buttons (0-9)', () => {
      for (let i = 0; i <= 9; i++) {
        cy.contains('ion-button', i.toString()).should('exist');
      }
    });

    it('should have all operation buttons', () => {
      cy.contains('ion-button', '+').should('exist');
      cy.contains('ion-button', '-').should('exist');
      cy.contains('ion-button', '×').should('exist');
      cy.contains('ion-button', '/').should('exist');
    });

    it('should have clear and equals buttons', () => {
      cy.contains('ion-button', 'C').should('exist');
      cy.contains('ion-button', '=').should('exist');
    });
  });

  describe('Number Input - Automated Interactions', () => {
    it('should append single number when clicking button', () => {
      cy.contains('ion-button', '5').click();
      cy.get('ion-input').should('have.value', '5');
    });

    it('should append multiple numbers sequentially', () => {
      cy.contains('ion-button', '1').click();
      cy.contains('ion-button', '2').click();
      cy.contains('ion-button', '3').click();
      cy.get('ion-input').should('have.value', '123');
    });

    it('should handle zero input', () => {
      cy.contains('ion-button', '0').click();
      cy.get('ion-input').should('have.value', '0');
    });

    it('should append zero after number', () => {
      cy.contains('ion-button', '5').click();
      cy.contains('ion-button', '0').click();
      cy.get('ion-input').should('have.value', '50');
    });
  });

  describe('Calculator Operations - Live Automated Testing', () => {
    it('should perform addition: 15 + 8 = 23', () => {
      // Input 15
      cy.contains('ion-button', '1').click();
      cy.contains('ion-button', '5').click();

      // Click +
      cy.contains('ion-button', '+').click();

      // Input 8
      cy.contains('ion-button', '8').click();

      // Click =
      cy.contains('ion-button', '=').click();

      // Verify result
      cy.wait(500);
      cy.get('ion-input').should('have.value', '23');
    });

    it('should perform subtraction: 100 - 35 = 65', () => {
      cy.contains('ion-button', '1').click();
      cy.contains('ion-button', '0').click();
      cy.contains('ion-button', '0').click();

      cy.contains('ion-button', '-').click();

      cy.contains('ion-button', '3').click();
      cy.contains('ion-button', '5').click();

      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '65');
    });

    it('should perform multiplication: 12 * 5 = 60', () => {
      cy.contains('ion-button', '1').click();
      cy.contains('ion-button', '2').click();

      cy.contains('ion-button', '×').click();

      cy.contains('ion-button', '5').click();

      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '60');
    });

    it('should perform division: 144 / 12 = 12', () => {
      cy.contains('ion-button', '1').click();
      cy.contains('ion-button', '4').click();
      cy.contains('ion-button', '4').click();

      cy.contains('ion-button', '/').click();

      cy.contains('ion-button', '1').click();
      cy.contains('ion-button', '2').click();

      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '12');
    });
  });

  describe('Clear Functionality - Automated Testing', () => {
    it('should clear display when C button is clicked', () => {
      cy.contains('ion-button', '1').click();
      cy.contains('ion-button', '2').click();
      cy.contains('ion-button', '3').click();

      cy.get('ion-input').should('have.value', '123');

      cy.contains('ion-button', 'C').click();

      cy.get('ion-input').should('have.value', '');
    });

    it('should allow new calculation after clear', () => {
      // First calculation
      cy.contains('ion-button', '5').click();
      cy.contains('ion-button', '0').click();
      cy.contains('ion-button', 'C').click();

      // New calculation
      cy.contains('ion-button', '7').click();
      cy.get('ion-input').should('have.value', '7');
    });
  });

  describe('Chained Calculations - Complex Automation', () => {
    it('should chain multiple operations: (10 + 5) * 2', () => {
      // 10 + 5 = 15
      cy.contains('ion-button', '1').click();
      cy.contains('ion-button', '0').click();
      cy.contains('ion-button', '+').click();
      cy.contains('ion-button', '5').click();
      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '15');

      // 15 * 2 = 30
      cy.contains('ion-button', '×').click();
      cy.contains('ion-button', '2').click();
      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '30');
    });

    it('should chain triple operations: 5 + 3 - 2 * 3', () => {
      // 5 + 3 = 8
      cy.contains('ion-button', '5').click();
      cy.contains('ion-button', '+').click();
      cy.contains('ion-button', '3').click();
      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '8');

      // 8 - 2 = 6
      cy.contains('ion-button', '-').click();
      cy.contains('ion-button', '2').click();
      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '6');

      // 6 * 3 = 18
      cy.contains('ion-button', '×').click();
      cy.contains('ion-button', '3').click();
      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '18');
    });
  });

  describe('Edge Cases - Automated Testing', () => {
    it('should handle leading zeros', () => {
      cy.contains('ion-button', '0').click();
      cy.contains('ion-button', '0').click();
      cy.contains('ion-button', '5').click();

      cy.get('ion-input').should('have.value', '005');
    });

    it('should handle division with large results', () => {
      // 999 + 1 = 1000
      cy.contains('ion-button', '9').click();
      cy.contains('ion-button', '9').click();
      cy.contains('ion-button', '9').click();

      cy.contains('ion-button', '+').click();

      cy.contains('ion-button', '1').click();
      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '1000');
    });

    it('should perform (50 - 25) / 5 = 5', () => {
      // 50 - 25 = 25
      cy.contains('ion-button', '5').click();
      cy.contains('ion-button', '0').click();
      cy.contains('ion-button', '-').click();
      cy.contains('ion-button', '2').click();
      cy.contains('ion-button', '5').click();
      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '25');

      // 25 / 5 = 5
      cy.contains('ion-button', '/').click();
      cy.contains('ion-button', '5').click();
      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '5');
    });
  });

  describe('Performance and Responsiveness', () => {
    it('should respond quickly to button clicks', () => {
      const numbers = ['1', '2', '3', '4', '5'];
      numbers.forEach(num => {
        cy.contains('ion-button', num).click();
        cy.get('ion-input').should('have.value', numbers.slice(0, numbers.indexOf(num) + 1).join(''));
      });
    });

    it('should handle rapid consecutive operations', () => {
      cy.contains('ion-button', '9').click();
      cy.contains('ion-button', '+').click();
      cy.contains('ion-button', '9').click();
      cy.contains('ion-button', '=').click();
      cy.wait(500);

      cy.contains('ion-button', '+').click();
      cy.contains('ion-button', '9').click();
      cy.contains('ion-button', '=').click();

      cy.wait(500);
      cy.get('ion-input').should('have.value', '27');
    });
  });
});