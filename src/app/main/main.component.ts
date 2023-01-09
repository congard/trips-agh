import {Component} from '@angular/core';
import {faPhone, faEnvelope, faLocationDot} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    faPhone = faPhone
    faEnvelope = faEnvelope
    faLocationDot = faLocationDot
}
