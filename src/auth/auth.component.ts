import { Input, uwuController } from "uwu-framework/core";

@uwuController({
    selector: 'auth',
    styles: [],
    template: `
        <fancy-button></fancy-button>
    `,
})
export class AuthController {
    constructor() {
        
    }

    @Input()
    some_field_in = '1';
}