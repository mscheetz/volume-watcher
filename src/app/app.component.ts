import { Component } from '@angular/core';
import { View } from './classes/enum.class';
import { MatDialog } from '@angular/material/dialog';
import { QrCodesComponent } from './components/qr-codes/qr-codes.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'volume-watcher';
  view: View = View.VOA;
  viewName: string;

  constructor(public dialog: MatDialog) {
    this.view = View.VOA;
    this.viewName = `Volume Increase`;
  }

  onToggleView(event) {
    if(this.view === View.VOA) {
      this.view = View.Volume;
      this.viewName = `Volume Over Average`;
    } else {
      this.view = View.VOA;
      this.viewName = `Volume Increase`;
    }
  }

  onOpenDonate() {
    const dialogRef = this.dialog.open(QrCodesComponent, {
      width: '300px',
      disableClose: true
    });
  }
}
