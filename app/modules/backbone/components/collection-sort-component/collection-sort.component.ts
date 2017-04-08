import {Component, Input} from '@angular/core';
import {BaseCollection} from '../../collections/base.collection';
import {BaseModel} from '../../models/base.model';
import {UserAnalyticsService} from '../../../user-analytics/services/user-analytics.service';

@Component({
  selector: 'collection-sort',
  styles: [ require('./collection-sort.style.scss') ],
  template: require('./collection-sort.template.html')
})

export class CollectionSortComponent {
  @Input() collection: BaseCollection<BaseModel>;

  @Input() comparator: string;

  @Input() label: string;

  sortDesc: boolean = true;

  constructor(private userAnalyticsService: UserAnalyticsService){}

  isSorted(): boolean {
    return this.collection &&
      (
        (this.collection.comparator === this.comparator) ||
        (!this.comparator && !this.collection.comparator)
      );
  }

  sort(): void {
    if (this.comparator) {
      if (this.collection.length < 2) {
        return;
      }
      if (this.collection.comparator !== this.comparator) {
        this.collection.sortOrder = null;
        this.collection.comparator = this.comparator;
      }
      if (!this.collection.sortOrder || this.collection.sortOrder === 'ASC') {
        this.collection.sortDescending();
        this.userAnalyticsService.trackEvent(`sort_${this.collection.comparator}_desc`, 'click', 'collection-sort-cmp');
      } else {
        this.collection.sortAscending();
        this.userAnalyticsService.trackEvent(`sort_${this.collection.comparator}_asc`, 'click', 'collection-sort-cmp');
      }
    } else if (this.collection.comparator) {
      this.collection.comparator = null;
      this.collection.fetch();
      this.userAnalyticsService.trackEvent('sort_reset', 'click', 'collection-sort-cmp');
    }
  }

  ngOnInit() {
    this.collection.on('sync', () => {
      if (this.isSorted() && this.comparator) {
        this.collection.sortDescending();
      }
    });
  }
}
