import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnotationPage } from './annotation';

@NgModule({
  declarations: [
    AnnotationPage,
  ],
  imports: [
    IonicPageModule.forChild(AnnotationPage),
  ]
})
export class AnnotationPageModule { }
