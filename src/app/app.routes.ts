import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PairsGameComponent } from './components/pairs-game/pairs-game.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'pairs', component: PairsGameComponent },
];
