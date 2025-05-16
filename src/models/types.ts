// src/models/types.ts
export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  comments: Comment[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  posts: Post[];
}

// API Response Models
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// JSONPlaceholder API models
export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface ApiPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface ApiComment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}