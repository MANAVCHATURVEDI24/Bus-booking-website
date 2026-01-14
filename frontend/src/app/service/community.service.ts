import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { url } from '../config';

export interface Story {
  _id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  content: string;
  route: {
    from: string;
    to: string;
  };
  category: 'story' | 'tip' | 'review' | 'photo';
  imageUrl?: string;
  tags: string[];
  likes: Array<{ userId: string; userName: string }>;
  comments: Array<{
    userId: string;
    userName: string;
    comment: string;
    createdAt: Date;
  }>;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumPost {
  _id?: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  category: 'general' | 'routes' | 'tips' | 'complaints' | 'suggestions';
  tags: string[];
  replies: Array<{
    _id?: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
    likes: Array<{ userId: string; userName: string }>;
  }>;
  views: number;
  isSticky: boolean;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private storyApi = url + 'stories/';
  private forumApi = url + 'forum/';

  constructor(private http: HttpClient) {}

  // Story methods
  getStories(page: number = 1, limit: number = 10, category?: string): Observable<any> {
    let params = `?page=${page}&limit=${limit}`;
    if (category && category !== 'all') {
      params += `&category=${category}`;
    }
    return this.http.get<any>(`${this.storyApi}${params}`);
  }

  getStoryById(id: string): Observable<Story> {
    return this.http.get<Story>(`${this.storyApi}${id}`);
  }

  createStory(story: Partial<Story>): Observable<Story> {
    return this.http.post<Story>(this.storyApi, story);
  }

  updateStory(id: string, story: Partial<Story>): Observable<Story> {
    return this.http.put<Story>(`${this.storyApi}${id}`, story);
  }

  deleteStory(id: string): Observable<any> {
    return this.http.delete(`${this.storyApi}${id}`);
  }

  toggleStoryLike(id: string, userId: string, userName: string): Observable<any> {
    return this.http.post(`${this.storyApi}${id}/like`, { userId, userName });
  }

  addStoryComment(id: string, userId: string, userName: string, comment: string): Observable<any> {
    return this.http.post(`${this.storyApi}${id}/comment`, { userId, userName, comment });
  }

  getUserStories(userId: string): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.storyApi}user/${userId}`);
  }

  // Forum methods
  getForumPosts(page: number = 1, limit: number = 10, category?: string): Observable<any> {
    let params = `?page=${page}&limit=${limit}`;
    if (category && category !== 'all') {
      params += `&category=${category}`;
    }
    return this.http.get<any>(`${this.forumApi}${params}`);
  }

  getForumPostById(id: string): Observable<ForumPost> {
    return this.http.get<ForumPost>(`${this.forumApi}${id}`);
  }

  createForumPost(post: Partial<ForumPost>): Observable<ForumPost> {
    return this.http.post<ForumPost>(this.forumApi, post);
  }

  updateForumPost(id: string, post: Partial<ForumPost>): Observable<ForumPost> {
    return this.http.put<ForumPost>(`${this.forumApi}${id}`, post);
  }

  deleteForumPost(id: string): Observable<any> {
    return this.http.delete(`${this.forumApi}${id}`);
  }

  addForumReply(id: string, userId: string, userName: string, content: string): Observable<any> {
    return this.http.post(`${this.forumApi}${id}/reply`, { userId, userName, content });
  }

  toggleReplyLike(postId: string, replyId: string, userId: string, userName: string): Observable<any> {
    return this.http.post(`${this.forumApi}${postId}/reply/${replyId}/like`, { userId, userName });
  }

  getUserForumPosts(userId: string): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.forumApi}user/${userId}`);
  }
}