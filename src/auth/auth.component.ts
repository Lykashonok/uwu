import { uwuController } from "../core";

uwuController({
    selector: 'auth',
    styles: ['./auth.component.scss'],
    template: `
    <div>
        <a>Some link</a>
        <comp></comp>
    </div>
    `,
})
export class AuthController {

}