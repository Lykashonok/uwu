import { container } from 'tsyringe';
import { AppService } from './app.service';
import { uwuController, uwuModule, Inject, RouterService } from 'uwu-framework/core';

@uwuController({
    selector: 'app',
    styles: [`
        
    `],
    template: `
        <nav class="nav">
            <span>Unifying Web Utility <i>Framework</i></span>
            <button class="button_primary" (click)="this.navigate()"">
                Try it free!
            </button>
        </nav>
        <main>
            <div class="container">
                <div class="select">
                <div class="option option_selected">Billings</div>
                <div class="option" (click)="this.navigateToDetail()">Additional Info</div>
                </div>
                <article class="options">
                    <div class="option" *uFor="let license of this.licenses">
                        <h2>{{license.title}}</h2>
                        <span class="price">{{license.price}}</span>
                        <span class="description">{{license.description}}</span>
                        <div class="bullets">
                            <div class="bullet" *uFor="let item of this.bullets">
                                <div>{{item.type}}</div> {{item.name}}
                            </div>
                        </div>
                        <button class="button_primary button_reversed">Start free trial</button>
                    </div>
                </article>
            </div>
        </main>
    `,
})
export class AppController {
    @Inject(AppService) service?: AppService;
    @Inject(RouterService) router?: RouterService;

    test = {
        some_value_square_brackey: (ev: Event, inc: number) => {
            this.test.some_value += inc;
        },
        some_value: 4
    }
    cl: { [cl: string]: boolean } = {
        "a": true
    };
    test2 = 2;
    addElement(ev: Event, attr: any) {
        console.log('trying to add to array', attr);
        this.some_array.push({
            one: 6,
            two: "7",
        });
    }
    removeElement(ev: Event, attr: any) {
        if (this.some_array.length) {
            this.some_array.pop();
        }
    }
    navigate() {
        this.router?.navigate(["/auth"]);
    }
    navigateToDetail() {
        this.router?.navigate(["/detail"]);
    }
    some_array = [
        { one: 1, two: '2' },
        { one: 2, two: '3' },
        { one: 3, two: '4' },
        { one: 4, two: '5' },
        { one: 5, two: '6' },
    ]

    licenses = [
        {
            title: 'Free',
            price: '0 BYN',
            description: 'Basic',
            bullets: [
                { name: 'Build your app', type: '✓' },
                { name: 'Ability to deploy app', type: '✓' },
                { name: 'Access to source code', type: '✕' },
                { name: 'Absence of watermark', type: '✕' },
                { name: 'For commercial use', type: '✕' },
            ]
        },
        {
            title: 'Personal License',
            price: '167 BYN',
            description: 'For education and personal use',
            bullets: [
                { name: 'Build your app', type: '✓' },
                { name: 'Ability to deploy app', type: '✓' },
                { name: 'Access to source code', type: '✓' },
                { name: 'Absence of watermark', type: '✓' },
                { name: 'For commercial use', type: '✕' },
            ]
        },
        {
            title: 'Commercial License',
            price: '672 BYN',
            description: 'For commercial use',
            bullets: [
                { name: 'Build your app', type: '✓' },
                { name: 'Ability to deploy app', type: '✓' },
                { name: 'Access to source code', type: '✓' },
                { name: 'Absence of watermark', type: '✓' },
                { name: 'For commercial use', type: '✓' },
            ]
        },
    ]

    bullets = [
        { name: 'Build your app', type: '✓' },
        { name: 'Ability to deploy app', type: '✓' },
        { name: 'Access to source code', type: '✓' },
        { name: 'Absence of watermark', type: '✓' },
        { name: 'For commercial use', type: '✓' },
    ]
    constructor(
        a: number,
    ) {
        console.log('AppController contructor');
        console.log(this.service);
    }
}