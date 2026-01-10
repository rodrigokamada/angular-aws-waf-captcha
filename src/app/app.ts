import { AfterViewInit, Component, ElementRef, ViewChild, model } from '@angular/core';

import { environment } from '../environments/environment';

declare global {
  interface Window {
    AwsWafCaptcha: any;
  }
}

@Component({
  selector: 'app-root',
  imports: [
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {

  @ViewChild('captcha') captcha!: ElementRef;
  messageSuccess = model<string>('');
  messageError = model<string>('');

  constructor() {
  }

  ngAfterViewInit(): void {
    this.loadScript();
  }

  private loadScript(): void {
    if (document.getElementById('awsWafScript')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'awsWafScript';
    script.async = false;
    script.defer = true;
    script.src = environment.aws.waf.url;
    script.onload = () => {
      this.renderCaptcha();
    };
    document.head.appendChild(script);
  }

  private renderCaptcha(): void {
    if (window.AwsWafCaptcha) {
      window.AwsWafCaptcha.renderCaptcha(this.captcha.nativeElement, {
        apiKey: environment.aws.waf.apiKey,
        onSuccess: (token: string) => {
          this.messageSuccess.set(`Captcha successfully validated! Token: ${token}`);
          this.messageError.set('');
        },
        onError: (error: any) => {
          this.messageError.set(`Error validating captcha: ${error}`);
          this.messageSuccess.set('');
        },
      });
    }
  }

}
