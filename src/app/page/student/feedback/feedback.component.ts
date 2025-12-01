import { Component, OnInit } from '@angular/core';
import { FeedbackDTO } from '../../../models/feedback.model';
import { FeedbackService } from '../../../service/feedbackService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FeedbackComponent implements OnInit {
  allFeedbacks: FeedbackDTO[] = []; // tất cả feedback từ backend
  feedbacks: FeedbackDTO[] = [];    // feedback hiển thị theo trang
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  filter: 'all' | 'responded' | 'pending' = 'all'; // trạng thái lọc

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.feedbackService.getFeedbacks().subscribe(res => {
      this.allFeedbacks = res || [];
      console.log(this.allFeedbacks);
      this.applyFilter();
    });
  }

  applyFilter() {
    let filtered = this.allFeedbacks;
    if (this.filter === 'responded') {
      filtered = this.allFeedbacks.filter(fb => fb.response);
    } else if (this.filter === 'pending') {
      filtered = this.allFeedbacks.filter(fb => !fb.response);
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.setPage(0, filtered);
  }

  setPage(page: number, data?: FeedbackDTO[]) {
    this.currentPage = page;
    const start = page * this.pageSize;
    const end = start + this.pageSize;
    const source = data || this.allFeedbacks;
    this.feedbacks = source.slice(start, end);
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.setPage(this.currentPage + 1, this.getFilteredData());
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.setPage(this.currentPage - 1, this.getFilteredData());
    }
  }

  getFilteredData(): FeedbackDTO[] {
    if (this.filter === 'responded') return this.allFeedbacks.filter(fb => fb.response);
    if (this.filter === 'pending') return this.allFeedbacks.filter(fb => !fb.response);
    return this.allFeedbacks;
  }

  setFilter(f: 'all' | 'responded' | 'pending') {
    this.filter = f;
    this.applyFilter();
  }
}
