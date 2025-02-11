import { Routes } from '@angular/router';
import { AuthGuard } from './shared/data-access/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login' 
    },
    {
        path:'login',
        loadComponent: () => import('./pages/login/login.component')
    },
    {
        path: 'pages',
        loadComponent: () => import('./pages/layout/layout.component'),
        loadChildren: () => [
            {
                path:'',
                pathMatch:'full',
                redirectTo:'dash-board',
            },
            {
                path:'dash-board',
                loadComponent: () => import("./pages/dash-board/dash-board.component"),
                title:'Dashbaord',
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path:'page-not-found',
        loadComponent: () => import('./pages/page-not-found/page-not-found.component')
    },
    {
        path:'**',
        pathMatch: 'full',
        redirectTo: 'page-not-found'
    }
];
