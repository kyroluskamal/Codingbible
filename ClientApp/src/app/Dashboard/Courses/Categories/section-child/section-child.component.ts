import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-section-child',
  templateUrl: './section-child.component.html',
  styleUrls: ['./section-child.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionChildComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
