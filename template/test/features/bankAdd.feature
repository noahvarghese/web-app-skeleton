Feature: Bank Account

  Scenario: Stores money
    Given a bank account with starting balance of $100
    When $100 is deposited
    Then the bank account balance should be $200