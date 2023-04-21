import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppInitializerFactory, AppInitializerProvider } from './shared/services/app.initializer';
import { AppComponent } from './app.component';
import { PanelSocketProvider } from './shared/services/socket.provider';
import { HttpInterceptor } from './shared/services/http.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SharedModule } from './shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { ErrorsModule } from './errors/errors.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocketIoModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    RouterOutlet,
    SharedModule,
    ErrorsModule,
    AuthModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true,
    },
    {
      provide: Socket,
      useClass: PanelSocketProvider,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory,
      deps: [AppInitializerProvider],
      multi: true,
    },
    AppInitializerProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
