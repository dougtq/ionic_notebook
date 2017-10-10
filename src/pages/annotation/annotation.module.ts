import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnotationPage } from './anotation';

@NgModule({
  declarations: [
    AnnotationPage,
  ],
  imports: [
    IonicPageModule.forChild(AnnotationPage),
  ]
})
export class AnnotationPageModule { }
