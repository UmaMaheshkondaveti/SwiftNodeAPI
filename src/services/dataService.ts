// src/services/dataService.ts
import { ApiUser, ApiPost, ApiComment, User, Post } from '../models/types';
import { ApiError } from '../utils/errorHandler';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Fetch data from JSONPlaceholder API
 */
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new ApiError(response.status, `Failed to fetch data from ${endpoint}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Error fetching from ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get users from JSONPlaceholder API
 */
export async function getUsers(limit: number = 10): Promise<ApiUser[]> {
  return fetchFromApi<ApiUser[]>(`/users?_limit=${limit}`);
}

/**
 * Get posts for a specific user
 */
export async function getUserPosts(userId: number): Promise<ApiPost[]> {
  return fetchFromApi<ApiPost[]>(`/posts?userId=${userId}`);
}

/**
 * Get comments for a specific post
 */
export async function getPostComments(postId: number): Promise<ApiComment[]> {
  return fetchFromApi<ApiComment[]>(`/comments?postId=${postId}`);
}

/**
 * Load user data with posts and comments
 */
export async function loadUsersWithPostsAndComments(limit: number = 10): Promise<User[]> {
  try {
    // Fetch users
    const users = await getUsers(limit);
    
    // For each user, fetch their posts
    const usersWithPosts = await Promise.all(users.map(async (user) => {
      const posts = await getUserPosts(user.id);
      
      // For each post, fetch its comments
      const postsWithComments = await Promise.all(posts.map(async (post) => {
        const comments = await getPostComments(post.id);
        
        return {
          id: post.id,
          title: post.title,
          body: post.body,
          comments: comments.map(comment => ({
            id: comment.id,
            name: comment.name,
            email: comment.email,
            body: comment.body
          }))
        } as Post;
      }));
      
      // Return user with their posts and comments
      return {
        ...user,
        posts: postsWithComments
      } as User;
    }));
    
    return usersWithPosts;
  } catch (error) {
    throw new ApiError(500, `Failed to load users with posts and comments: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}