import { AppService } from './app.service';
import { uwuController, uwuModule } from './core';

@uwuController({
    selector: 'app',
    styles: [],
    template: `
    <div>
        <a>Some link</a>
        <comp></comp>
    </div>
    `,
})
export class AppController {
    constructor(
        a : number,
        service : AppService,
    ){
        console.log('AppController contructor');
        console.log('AppService service', service);
    }
}