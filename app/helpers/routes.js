import { LoginPage } from '../scenes/public/login/login-form';
import { RegisterPage } from '../scenes/public/register';
import { homePrivateScene } from '../scenes/private/home.private/home.private';
import {NotFoundScene} from '../scenes/public/notFound';
import { editFlightScene } from '../scenes/private/editFlight/editFlight.scene';
import { createFlightScene } from '../scenes/private/create.flight/create.flight';


export const routes = {
    private: [
         { path: '/dashboard', component: homePrivateScene },
         { path: '/dashboard/edit', component: editFlightScene },
         { path: '/dashboard/create', component: createFlightScene }
    ],
    public: [
        { path: '/', component: RegisterPage },
        { path: '/login', component: LoginPage },
        { path: '/register', component: RegisterPage },
        { path: '/not-found', component: NotFoundScene},
    ]
};