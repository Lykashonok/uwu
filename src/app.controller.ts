import { AppService } from './app.service';
import { uwuController, uwuModule } from './core';

@uwuController({
    selector: 'app',
    styles: [],
    template: `
        <button (click)="this.addElement(1)">Add Element</button>
        <input [value]="this.test.some_value" [uClass]="this.cl" *uFor="let element of this.some_array">

        <br>
    `,
        // <input [value]="this.test.some_value"></input>
        // <button (click)="this.test.some_value_square_brackey(1)">
        //     <span><b>bold text</b> {{this.test.some_value}}</span>
        // </button>
        // <auth [some_field_in]="this.test.some_value"></auth>
})
export class AppController {
    test = {
        some_value_square_brackey : (ev : Event, inc : number) => {
            this.test.some_value += inc;
        },
        some_value : 4
    }
    cl : {[cl : string] : boolean} = {
        "a" : true
    };
    test2 = 2;
    addElement(ev : Event, attr: any) {
        console.log('trying to add to array', attr);
        this.some_array.push({
            one: 6,
            two: "7",
        });
    }
    some_array = [
        {one: 1, two: '2'},
        {one: 2, two: '3'},
        {one: 3, two: '4'},
        {one: 4, two: '5'},
        {one: 5, two: '6'},
    ]
    constructor(
        a : number,
        service : AppService,
    ){
        // console.log('AppController contructor');
    }
}