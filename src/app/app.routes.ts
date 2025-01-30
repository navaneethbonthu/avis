import { Routes } from '@angular/router';

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
                redirectTo:'dash-board'
            },
            {
                path:'dash-board',
                loadComponent: () => import("./pages/dash-board/dash-board.component"),
                title:'Dashbaord'
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
