import { AppService } from "../app.service";
import { Inject, uwuTsxController } from "uwu-framework/core"
import uwuTsx, { uwuTsxRenderManager } from "uwu-framework/core.enginetsx";

@uwuTsxController({
    selector: "fancy-button",
    styles: [],
    hook: (guid : string) => {
        return (currentState : any) => {
            currentState ??= {
                some_prop: 1,
            };
            
            const changeState = () => {
                const newState = currentState;
                newState.some_prop += 1;
                uwuTsxRenderManager.render(guid, currentState);
            }
            return (
                <button onClick={() => changeState()}>
                    <h1>Count: {currentState.some_prop}</h1>
                </button>
            )
        }
    }
})
export class FancyButtonComponent {}