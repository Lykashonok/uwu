import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.component';
import { uwuModule, uwuRouter } from './core';
import { CustomButtonController } from './custom-button/custom-button.component';
import { DetailController } from './detail/detail.component';
import { FancyButtonComponent } from './fancy-button/fancy-button.component';

@uwuRouter({
    routes : [
        {path: '', target: AppController},
        {path: 'auth', target: AuthController},
        {path: 'detail', target: DetailController},
    ]
})
class AppRouter {}

@uwuModule({
    imports: [
        AppService,
        AppRouter
    ],
    exports: [
        AppController,
        AuthController,
        DetailController,
        FancyButtonComponent,
        CustomButtonController,
    ],
})
export class AppModule {}