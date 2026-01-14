import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  activeTab: 'stories' | 'forum' = 'stories';
  isLoggedIn = false;
  currentUser: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const loggedInUser = sessionStorage.getItem('Loggedinuser');
    if (loggedInUser) {
      this.isLoggedIn = true;
      this.currentUser = JSON.parse(loggedInUser);
    }
  }

  setActiveTab(tab: 'stories' | 'forum'): void {
    this.activeTab = tab;
  }

  navigateToCreate(): void {
    if (!this.isLoggedIn) {
      alert('Please login to share your story or create a forum post');
      return;
    }
    
    if (this.activeTab === 'stories') {
      this.router.navigate(['/community/create-story']);
    } else {
      this.router.navigate(['/community/create-forum']);
    }
  }
}