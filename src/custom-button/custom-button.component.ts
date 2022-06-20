import { Input, uwuController } from "uwu-framework/core";

@uwuController({
    selector: 'custom-button',
    styles: [],
    template: `
        <button [innerHTML]="this.title"></button>
    `,
})
export class CustomButtonController {
    constructor() {
    }

    @Input()
    title = '1';
}