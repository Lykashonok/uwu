import { AppService } from "../app.service";
import { Inject, Input, RouterService, uwuController } from "uwu-framework/core";

@uwuController({
    selector: 'detail',
    styles: [`
        .dynamic_red_color {
            background-color: red;
        }
        .dynamic_green_color {
            background-color: green;
        }
        .dynamic_blue_color {
            background-color: blue;
        }
        .box {
            width: 100px;
            height: 60px;
        }
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
                <div class="option" (click)="this.navigateToBase()">Billings</div>
                <div class="option option_selected">Additional Info</div>
                </div>
                <article>
                    <h2>Topics</h2>
                    <ul>
                        <li><a href="#about">About</a></li>
                        <li><a href="#examples">Examples</a></li>
                        <li><a href="#installation">Installation</a></li>
                        <li><a href="#installation">License acquiring</a></li>
                    </ul>
                </article>
                <article class="detail">
        <h2 id="about">About framework</h2>
        <p>This framework was created for one main reason - unite two conceptions for manipulating data and template of
            page: <i><b>declarative</b></i> and <i><b>imperative</b></i></p>
        <p>When we speak about declarative method, that means you just need to <b><i>declare</i></b> instructions for
            manipulating data, for example:</p>
        <pre>
            <code>
    &lt;div [innerHtml]="this.some_variable"&gt;&lt;/div&gt;</code>
        </pre>
        <p>You just need to say <q><i>Please, bind this.some_variable to same variable in current controller</i></q>, and every change of variable this attribute will <b>change together</b>. It makes developent <b><i>much</i> easier</b> </p>
        <p>In controller you just need to declare this variable, and that's it, everything works!</p>
        <pre>
            <code>
    import { uwuController } from './core';

    @uwuController({
        selector: "some",
        styles: [],
    })
    export class SomeController {
        some_variable = "Some stored variable";
    }
            </code>
        </pre>
    </article>
    <article class="examples">
        <h2 id="about">Examples</h2>

        <p>Example of using Tsx component in common component</p>
        <fancy-button></fancy-button>
        
        <p>Example of value from service</p>
        Value from service: {{this.service.some_service_value}}
        
        <p>Example of value for inner component</p>
        <custom-button [title]="this.value_for_inner_controller"></custom-button>

        <p>Example of dynamic changing classes</p>
        <button (click)="this.changeColor()">Change color</button>
        <div class="box" [uClass]="this.dynamic_classes">
    </article>
    <hr>
        </div>
        </main>
    `,
})
export class DetailController {
    dynamic_classes = {
        dynamic_red_color : true,
        dynamic_green_color : false,
        dynamic_blue_color : false,
    }

    changeColor() {
        if (this.dynamic_classes.dynamic_red_color) {
            this.dynamic_classes = {
                dynamic_red_color: false,
                dynamic_green_color: true,
                dynamic_blue_color: false,
            };
        } else if (this.dynamic_classes.dynamic_green_color) {
            this.dynamic_classes = {
                dynamic_red_color: false,
                dynamic_green_color: false,
                dynamic_blue_color: true,
            };
        } else if (this.dynamic_classes.dynamic_blue_color) {
            this.dynamic_classes = {
                dynamic_red_color: true,
                dynamic_green_color: false,
                dynamic_blue_color: false,
            };
        }
    }
    
    value_for_inner_controller: string = "Must be inside of other controller";

    @Inject(RouterService) router?: RouterService;
    @Inject(AppService) service?: AppService;
    navigateToBase() {
        this.router!.navigate(['']);
    }

    constructor() {
        
    }

    @Input()
    some_field_in = '1';
}