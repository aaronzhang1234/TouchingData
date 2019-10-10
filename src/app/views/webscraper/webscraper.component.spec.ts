import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebscraperComponent } from './webscraper.component';

describe('WebscraperComponent', () => {
  let component: WebscraperComponent;
  let fixture: ComponentFixture<WebscraperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebscraperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebscraperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
