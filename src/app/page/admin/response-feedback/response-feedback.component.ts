import { FeedbackDTO } from '../../../models/feedback.model';
import { FeedbackService } from '../../../service/feedbackService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-response-feedback',
  imports: [CommonModule, FormsModule],
  templateUrl: './response-feedback.component.html',
  styleUrl: './response-feedback.component.css'
})
export class ResponseFeedbackComponent {
  allFeedbacks: FeedbackDTO[] = [];
  feedbacks: FeedbackDTO[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  filter: 'all' | 'responded' | 'pending' = 'all';

  // Model cập nhật phản hồi
  responseText: { [id: number]: string } = {};

  constructor(private feedbackService: FeedbackService, private router: Router) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }
  goToDetail(id: number) {
    this.router.navigate(['/manager/conductFormDetail', id]);
  }
  loadFeedbacks() {
    this.feedbackService.getAllFeedbacksAdmin().subscribe(res => {
      this.allFeedbacks = res || [];
      this.applyFilter();
    });
  }

  applyFilter() {
    let filtered = this.allFeedbacks;

    if (this.filter === 'responded') {
      filtered = filtered.filter(f => f.response === true);
    } else if (this.filter === 'pending') {
      filtered = filtered.filter(f => f.response === false);
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.setPage(0, filtered);
  }

  getFilteredData() {
    if (this.filter === 'responded') return this.allFeedbacks.filter(f => f.response);
    if (this.filter === 'pending') return this.allFeedbacks.filter(f => !f.response);
    return this.allFeedbacks;
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

  setFilter(f: 'all' | 'responded' | 'pending') {
    this.filter = f;
    this.applyFilter();
  }

  updateResponse(fb: FeedbackDTO) {
    if (!this.responseText[fb.feedbackId] || this.responseText[fb.feedbackId].trim() === "") {
      alert("Nội dung phản hồi không được để trống!");
      return;
    }
    const text = this.responseText[fb.feedbackId];
    console.log("Phản hồi cho feedback ID " + text);
    fb.responseContent = text;
    this.feedbackService.updateResponseFeedback(fb).subscribe(() => {
      fb.response = true;
      fb.responseContent = this.responseText[fb.feedbackId];
      this.responseText[fb.feedbackId] = "";
      this.applyFilter();
    });
  }
}
