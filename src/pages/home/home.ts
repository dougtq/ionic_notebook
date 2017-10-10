import { AnnotationModel } from './../../models/annotation.model';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { AnnotationProvider } from './../../providers/annotation/annotation';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public annotations: AnnotationModel[] = [];

  constructor(
    public navCtrl: NavController,
    public annotationProvider: AnnotationProvider
  ) {

  }

  ionViewDidLoad() {
    this.annotationProvider.getAll()
      .then((annotations: AnnotationModel[]) => {
        this.annotations = annotations
      })
  }

  public viewAnnotation(annotation?: AnnotationModel): void {
    if (!annotation) {
      this.navCtrl.push("AnnotationPage");
    } else {
      this.navCtrl.push("AnnotationPage", annotation);
    }
  }
}
