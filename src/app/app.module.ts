import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TermsComponent } from './launchpad/terms/terms.component';
import { ApplicationComponent } from './launchpad/terms/application/application.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaunchpadComponent } from './launchpad/launchpad.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIconModule} from '@angular/material/icon';
import { ShortenPipe } from './pipes/shorten.pipe';
import { deleteCharPipe } from './pipes/deleteChar.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AuthGuard } from './guards/auth.guard';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DetailsComponent } from './admin/details/details.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DetailsComponent2 } from './launchpad/details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    LaunchpadComponent,
    LoginComponent,
    AdminComponent,
    NavbarComponent,
    ShortenPipe,
    deleteCharPipe,
    TermsComponent,
    ApplicationComponent,
    DetailsComponent,
    DetailsComponent2
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    ClipboardModule,
    MatTooltipModule
  ],
  providers: [MatDatepickerModule, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
