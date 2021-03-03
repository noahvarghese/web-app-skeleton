import { Given, When, Then } from "@cucumber/cucumber";
import { assert } from "chai";

let accountBalance: number = 0;

Given("a bank account with starting balance of ${int}", (amount: number) => {
    accountBalance = amount;
});

When("${int} is deposited", (amount: number) => {
    accountBalance += amount;
});

Then("the bank account balance should be ${int}", (amount: number) => {
    assert.equal(accountBalance, amount);
});