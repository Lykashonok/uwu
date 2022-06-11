import { uwuController } from './core';

@uwuController({
    selector: "some",
    styles: [],
    template: `
        <div [innerHtml]="this.some_variable"></div>
    `,
})
export class SomeController {
    some_variable = "Some stored variable";
}