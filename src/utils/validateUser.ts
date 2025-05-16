// src/utils/validateUser.ts
import { User } from '../models/types';
import { ApiError } from './errorHandler';

/**
 * Validate user object
 * @param user User object to validate
 * @throws ApiError if validation fails
 */
export function validateUser(user: any): void {
  // Check if user is an object
  if (!user || typeof user !== 'object') {
    throw new ApiError(400, 'Invalid user data: User must be an object');
  }

  // Check required fields
  const requiredFields = ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'];
  for (const field of requiredFields) {
    if (!(field in user)) {
      throw new ApiError(400, `Invalid user data: Missing required field '${field}'`);
    }
  }

  // Check address object
  if (typeof user.address !== 'object') {
    throw new ApiError(400, 'Invalid user data: Address must be an object');
  }

  const addressFields = ['street', 'suite', 'city', 'zipcode', 'geo'];
  for (const field of addressFields) {
    if (!(field in user.address)) {
      throw new ApiError(400, `Invalid user data: Missing required address field '${field}'`);
    }
  }

  // Check geo object
  if (typeof user.address.geo !== 'object') {
    throw new ApiError(400, 'Invalid user data: Geo must be an object');
  }

  if (!('lat' in user.address.geo) || !('lng' in user.address.geo)) {
    throw new ApiError(400, 'Invalid user data: Geo must include lat and lng fields');
  }

  // Check company object
  if (typeof user.company !== 'object') {
    throw new ApiError(400, 'Invalid user data: Company must be an object');
  }

  const companyFields = ['name', 'catchPhrase', 'bs'];
  for (const field of companyFields) {
    if (!(field in user.company)) {
      throw new ApiError(400, `Invalid user data: Missing required company field '${field}'`);
    }
  }

  // Validate posts array if present
  if ('posts' in user) {
    if (!Array.isArray(user.posts)) {
      throw new ApiError(400, 'Invalid user data: Posts must be an array');
    }

    // Validate each post
    for (const post of user.posts) {
      if (typeof post !== 'object') {
        throw new ApiError(400, 'Invalid user data: Each post must be an object');
      }

      const postFields = ['id', 'title', 'body'];
      for (const field of postFields) {
        if (!(field in post)) {
          throw new ApiError(400, `Invalid user data: Post missing required field '${field}'`);
        }
      }

      // Validate comments array if present
      if ('comments' in post) {
        if (!Array.isArray(post.comments)) {
          throw new ApiError(400, 'Invalid user data: Comments must be an array');
        }

        // Validate each comment
        for (const comment of post.comments) {
          if (typeof comment !== 'object') {
            throw new ApiError(400, 'Invalid user data: Each comment must be an object');
          }

          const commentFields = ['id', 'name', 'email', 'body'];
          for (const field of commentFields) {
            if (!(field in comment)) {
              throw new ApiError(400, `Invalid user data: Comment missing required field '${field}'`);
            }
          }
        }
      }
    }
  } else {
    // If posts aren't present, add an empty array
    user.posts = [];
  }
}