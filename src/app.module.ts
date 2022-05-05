import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.component';
import { uwuModule, uwuRouter } from './core';

@uwuRouter({
    routes : [
        {path: '', target: AppController},
        {path: '/', target: AppController},
        {path: 'auth', target: AuthController, },
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
        AuthController
    ],
})
export class AppModule {}