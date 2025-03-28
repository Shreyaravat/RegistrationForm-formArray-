import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentformComponent } from './studentform.component';

describe('StudentformComponent', () => {
  let component: StudentformComponent;
  let fixture: ComponentFixture<StudentformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
