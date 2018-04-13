import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  cate:any;

  constructor() { }

  ngOnInit() {
    
  }

  onSelect(select) {
    this.cate = select;
  }
}
