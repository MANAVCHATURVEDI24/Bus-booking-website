import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityService, ForumPost } from '../../service/community.service';

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.css']
})
export class ForumListComponent implements OnInit {
  forumPosts: ForumPost[] = [];
  filteredPosts: ForumPost[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  selectedCategory = 'all';
  searchTerm = '';
  currentUser: any = null;

  categories = [
    { value: 'all', label: 'All Discussions', icon: 'fas fa-comments' },
    { value: 'general', label: 'General', icon: 'fas fa-comment' },
    { value: 'routes', label: 'Routes & Schedules', icon: 'fas fa-route' },
    { value: 'tips', label: 'Travel Tips', icon: 'fas fa-lightbulb' },
    { value: 'complaints', label: 'Complaints', icon: 'fas fa-exclamation-triangle' },
    { value: 'suggestions', label: 'Suggestions', icon: 'fas fa-thumbs-up' }
  ];

  constructor(
    private communityService: CommunityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.loadForumPosts();
  }

  getCurrentUser(): void {
    const loggedInUser = sessionStorage.getItem('Loggedinuser');
    if (loggedInUser) {
      this.currentUser = JSON.parse(loggedInUser);
    }
  }

  loadForumPosts(): void {
    this.isLoading = true;
    this.communityService.getForumPosts(this.currentPage, 10, this.selectedCategory)
      .subscribe({
        next: (response) => {
          this.forumPosts = response.posts;
          this.filteredPosts = this.forumPosts;
          this.totalPages = response.totalPages;
          this.isLoading = false;
          this.applySearch();
        },
        error: (error) => {
          console.error('Error loading forum posts:', error);
          this.isLoading = false;
        }
      });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadForumPosts();
  }

  onSearch(): void {
    this.applySearch();
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPosts = this.forumPosts;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPosts = this.forumPosts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadForumPosts();
  }

  viewForumPost(postId: string): void {
    this.router.navigate(['/community/forum', postId]);
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.icon : 'fas fa-comment';
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return this.formatDate(date);
  }

  getLastReplyTime(post: ForumPost): string {
    if (post.replies.length === 0) {
      return this.getTimeAgo(post.createdAt);
    }
    
    const lastReply = post.replies[post.replies.length - 1];
    return this.getTimeAgo(lastReply.createdAt);
  }

  getLastReplyUser(post: ForumPost): string {
    if (post.replies.length === 0) {
      return post.userName;
    }
    
    const lastReply = post.replies[post.replies.length - 1];
    return lastReply.userName;
  }
}