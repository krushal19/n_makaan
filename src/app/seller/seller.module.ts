import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SellerRoutingModule } from './seller-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SellerRoutingModule
  ],
  providers: []
})
export class SellerModule { }
