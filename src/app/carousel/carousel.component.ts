import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
    @Input() urls!: string[]

    private _activeIndex = 0

    public set activeIndex(index: number) {
        function mod(n: number, m: number) {
            return ((n % m) + m) % m;
        }

        this._activeIndex = mod(index, this.urls.length)
    }

    public get activeIndex() {
        return this._activeIndex
    }

    prev() {
        --this.activeIndex
    }

    next() {
        ++this.activeIndex
    }
}
