import { Input, uwuController } from "../core";

@uwuController({
    selector: 'auth',
    styles: [],
    template: `
        <span [innerHTML]="this.some_field_in">Test</span>
        <custom-button [title]="this.some_field_in"></custom-button>
    `,
})
export class AuthController {
    constructor() {
        
    }

    @Input()
    some_field_in = '1';
}