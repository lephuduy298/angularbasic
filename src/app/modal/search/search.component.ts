import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Output() searchEmit = new EventEmitter<string>();
  searchTerm: string = '';

  search() {
    this.searchEmit.emit(this.searchTerm);
  }
}
