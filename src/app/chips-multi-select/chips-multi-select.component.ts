import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-chips-multi-select',
    templateUrl: './chips-multi-select.component.html',
    styleUrls: ['./chips-multi-select.component.css']
})
export class ChipsMultiSelectComponent {
    @Input() values!: any[]
    @Input() stringifier: (value: any) => string = value => value
    @Input() selectedColor: string = "red"

    @Output() onSelectedEvent = new EventEmitter<ChipsMultiSelectComponent>();

    selected: Set<number> = new Set<number>()

    public isSelected(value: any) {
        return this.selected.has(this.values.indexOf(value))
    }

    public getSelectedIndices() {
        return this.selected
    }

    public getValues() {
        return this.values
    }

    onSelect(value: any) {
        const index = this.values.indexOf(value)

        if (!this.selected.has(index)) {
            this.selected.add(index)
        } else {
            this.selected.delete(index)
        }

        this.onSelectedEvent.emit(this)
    }

    getColor(value: any) {
        return this.isSelected(value) ? this.selectedColor : ''
    }
}
