import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { ThenableWebDriver } from "selenium-webdriver";

export default class BaseWorld extends World {
    private _driver: ThenableWebDriver | undefined;
    private _props: any;

    constructor(options: IWorldOptions) {
        super(options);
    }

    setDriver = (driver: ThenableWebDriver): void => {
        this._driver = driver;
        return;
    };

    getDriver = (): ThenableWebDriver => {
        if (this._driver) {
            return this._driver;
        }

        throw new Error("Driver not intialized.");
    };

    setCustomProp = (key: string, value: any): void => {
        this._props[key] = value;
        return;
    };

    getCustomProp = (key: string): any => {
        return this._props[key];
    };
}

setWorldConstructor(BaseWorld);
