import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.component';
import { uwuModule, uwuRouter } from './core';
import { CustomButtonController } from './custom-button/custom-button.component';

@uwuRouter({
    routes : [
        {path: '', target: AppController},
        {path: 'auth', target: AuthController},
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
        CustomButtonController,
    ],
})
export class AppModule {}