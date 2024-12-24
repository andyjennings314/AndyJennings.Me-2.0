import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PairsGameComponent } from './components/pairs-game/pairs-game.component';
import { MyWorkComponent } from './components/my-work/my-work.component';
import { AboutMeComponent } from './components/about-me/about-me.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about-me', component: AboutMeComponent },
    { path: 'my-work', component: MyWorkComponent },
    { path: 'pairs', component: PairsGameComponent },
    { path: '**', component: HomeComponent }
];
