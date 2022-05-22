import { uwuTsxController } from "./core"
import uwuTsx, { uwuTsxRenderManager } from "./core.enginetsx";

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
                <h1 onClick={() => changeState()}>
                    Count: {currentState.some_prop}
                </h1>
            )
        }
    }
})
export class FancyButtonComponent {}