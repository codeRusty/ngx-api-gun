import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGunComponent } from './api-gun.component';
import { ApiGunService } from './api-gun.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ApiGunComponent],
  exports: [ApiGunComponent],
  providers: [ApiGunService]
})
export class ApiGunModule { }
