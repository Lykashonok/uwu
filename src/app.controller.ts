import { container } from 'tsyringe';
import { AppService } from './app.service';
import { uwuController, uwuModule, Inject, RouterService } from './core';

@uwuController({
    selector: 'app',
    styles: [],
    template: `
        <fancy-button></fancy-button>
        <button (click)="this.navigate()">Navigate</button>
        <button (click)="this.addElement(1)">Add Element</button>
        <button (click)="this.removeElement(1)">Remove Element</button>
        <button (click)="this.test.some_value_square_brackey(1)">
            <span><b>bold text</b> {{this.test.some_value}}</span>
        </button>
        <br>
        <span *uFor="let element of this.some_array">
            <span [innerHTML]="this.test.some_value"></span>
            <span>{{element.one}}</span>
            <br>
        </span>
        <auth [some_field_in]="this.test.some_value"></auth>
        <input [uClass]="this.cl" [(uModel)]="this.service.some_service_value">
    `,
})
export class AppController {
    @Inject(AppService) service? : AppService;
    @Inject(RouterService) router? : RouterService;

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
    removeElement(ev : Event, attr: any) {
        if (this.some_array.length) {
            this.some_array.pop();
        }
    }
    navigate(){
        this.router?.navigate(["/auth"]);
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
    ){
        console.log('AppController contructor');
        console.log(this.service);
    }
}