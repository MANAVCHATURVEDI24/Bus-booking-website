import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityService } from '../../service/community.service';

@Component({
  selector: 'app-create-story',
  templateUrl: './create-story.component.html',
  styleUrls: ['./create-story.component.css']
})
export class CreateStoryComponent implements OnInit {
  currentUser: any = null;
  isSubmitting = false;

  story = {
    title: '',
    content: '',
    route: {
      from: '',
      to: ''
    },
    category: 'story' as 'story' | 'tip' | 'review' | 'photo',
    imageUrl: '',
    tags: [] as string[],
    isPublic: true
  };

  tagInput = '';
  categories = [
    { value: 'story', label: 'Travel Story', icon: 'fas fa-book' },
    { value: 'tip', label: 'Travel Tip', icon: 'fas fa-lightbulb' },
    { value: 'review', label: 'Review', icon: 'fas fa-star' },
    { value: 'photo', label: 'Photo Story', icon: 'fas fa-camera' }
  ];

  constructor(
    private communityService: CommunityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    if (!this.currentUser) {
      alert('Please login to create a story');
      this.router.navigate(['/']);
    }
  }

  getCurrentUser(): void {
    const loggedInUser = sessionStorage.getItem('Loggedinuser');
    if (loggedInUser) {
      this.currentUser = JSON.parse(loggedInUser);
    }
  }

  addTag(): void {
    const tag = this.tagInput.trim().toLowerCase();
    if (tag && !this.story.tags.includes(tag) && this.story.tags.length < 5) {
      this.story.tags.push(tag);
      this.tagInput = '';
    }
  }

  removeTag(index: number): void {
    this.story.tags.splice(index, 1);
  }

  onTagKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    const storyData = {
      ...this.story,
      userId: this.currentUser._id,
      userName: this.currentUser.name,
      userEmail: this.currentUser.email
    };

    this.communityService.createStory(storyData).subscribe({
      next: (response) => {
        console.log('Story created successfully:', response);
        alert('Your story has been shared successfully!');
        this.router.navigate(['/community']);
      },
      error: (error) => {
        console.error('Error creating story:', error);
        alert('Failed to create story. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.story.title.trim()) {
      alert('Please enter a title for your story');
      return false;
    }

    if (!this.story.content.trim()) {
      alert('Please write your story content');
      return false;
    }

    if (!this.story.route.from.trim() || !this.story.route.to.trim()) {
      alert('Please specify the route (from and to locations)');
      return false;
    }

    if (this.story.title.length > 100) {
      alert('Title must be less than 100 characters');
      return false;
    }

    if (this.story.content.length > 2000) {
      alert('Content must be less than 2000 characters');
      return false;
    }

    return true;
  }

  goBack(): void {
    this.router.navigate(['/community']);
  }
}