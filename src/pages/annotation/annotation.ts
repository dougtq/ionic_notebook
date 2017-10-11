import { AnnotationProvider } from './../../providers/annotation/annotation.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AnnotationModel } from './../../models/annotation.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-annotation',
  templateUrl: 'annotation.html',
})
export class AnnotationPage {
  public annotation: AnnotationModel;
  public annotations: AnnotationModel[];
  private form: FormGroup;
  private loading: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public annotationProvider: AnnotationProvider,
    public formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: [''],
    })
    this.annotation = this.navParams.get('annotation');
    if (this.annotation) {
      this.form.patchValue(this.annotation);
    }
  }

  ionViewDidLoad() { }

  // toast message
  public presentToast(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      position: 'bottom',
      dismissOnPageChange: true,
      duration: 3000
    });
    toast.present();
  }

  // exibir loading
  public presentLoading(message: string): void {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
  }

  public voltarInicio(): void {
    this.navCtrl.setRoot('HomePage');
  }

  public salvarNota(): void {
    this.presentLoading('Salvando Nota...');
    if (!this.form.valid) {
      this.loading.dismiss();
      this.presentToast('Digite um título para a nota');
    } else {
      this.annotation = new AnnotationModel(
        this.form.value.title,
        this.form.value.content
      );
      this.annotationProvider.onSave(this.annotation)
        .then((result: any) => {
          this.loading.dismiss();
          this.navCtrl.setRoot('HomePage');
        })
        .catch((error: Error) => {
          this.loading.dismiss();
          this.presentToast('Falha ao criar a nota')
        })
    }
  }
}
