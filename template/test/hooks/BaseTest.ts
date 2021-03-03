import { Before, After } from "@cucumber/cucumber";
import { Builder, Capabilities } from "selenium-webdriver";
import BaseWorld from "../support/BaseWorld";
import selenium from "selenium-webdriver";

Before(function (this: BaseWorld) {
    const chromeCapabilities: Capabilities = Capabilities.chrome();
    const chromeOptions = {
        w3c: false,
    };

    chromeCapabilities.set("chromeOptions", chromeOptions);
    this.setDriver(
        new Builder()
            .withCapabilities(chromeCapabilities)
            .forBrowser("chrome")
            .build()
    );
});

After(async function (this: BaseWorld) {
    await this.getDriver().quit();
});
