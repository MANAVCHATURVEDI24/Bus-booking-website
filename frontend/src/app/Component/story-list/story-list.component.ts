import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityService, Story } from '../../service/community.service';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {
  stories: Story[] = [];
  filteredStories: Story[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  selectedCategory = 'all';
  searchTerm = '';
  currentUser: any = null;

  categories = [
    { value: 'all', label: 'All Stories', icon: 'fas fa-globe' },
    { value: 'story', label: 'Travel Stories', icon: 'fas fa-book' },
    { value: 'tip', label: 'Travel Tips', icon: 'fas fa-lightbulb' },
    { value: 'review', label: 'Reviews', icon: 'fas fa-star' },
    { value: 'photo', label: 'Photo Stories', icon: 'fas fa-camera' }
  ];

  constructor(
    private communityService: CommunityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.loadStories();
  }

  getCurrentUser(): void {
    const loggedInUser = sessionStorage.getItem('Loggedinuser');
    if (loggedInUser) {
      this.currentUser = JSON.parse(loggedInUser);
    }
  }

  loadStories(): void {
    this.isLoading = true;
    this.communityService.getStories(this.currentPage, 10, this.selectedCategory)
      .subscribe({
        next: (response) => {
          this.stories = response.stories;
          this.filteredStories = this.stories;
          this.totalPages = response.totalPages;
          this.isLoading = false;
          this.applySearch();
        },
        error: (error) => {
          console.error('Error loading stories:', error);
          this.isLoading = false;
        }
      });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadStories();
  }

  onSearch(): void {
    this.applySearch();
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStories = this.stories;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredStories = this.stories.filter(story =>
      story.title.toLowerCase().includes(term) ||
      story.content.toLowerCase().includes(term) ||
      story.route.from.toLowerCase().includes(term) ||
      story.route.to.toLowerCase().includes(term) ||
      story.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStories();
  }

  viewStory(storyId: string): void {
    this.router.navigate(['/community/story', storyId]);
  }

  likeStory(story: Story): void {
    if (!this.currentUser) {
      alert('Please login to like stories');
      return;
    }

    this.communityService.toggleStoryLike(story._id!, this.currentUser._id, this.currentUser.name)
      .subscribe({
        next: (response) => {
          const existingLike = story.likes.find(like => like.userId === this.currentUser._id);
          if (existingLike) {
            story.likes = story.likes.filter(like => like.userId !== this.currentUser._id);
          } else {
            story.likes.push({ userId: this.currentUser._id, userName: this.currentUser.name });
          }
        },
        error: (error) => {
          console.error('Error toggling like:', error);
        }
      });
  }

  isLikedByUser(story: Story): boolean {
    if (!this.currentUser) return false;
    return story.likes.some(like => like.userId === this.currentUser._id);
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.icon : 'fas fa-book';
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
    const storyDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - storyDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return this.formatDate(date);
  }
}