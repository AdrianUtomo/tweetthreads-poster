// Media data for uploads
export interface MediaData {
  url: string;             // URL for preview
  type: string;            // Media type
  buffer?: string;         // Base64 encoded buffer
  mimeType?: string;       // MIME type for Twitter API
}

// Post data structure
export interface PostData {
  content: string;
  media: MediaData[];
}

// Twitter API responses
export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  description?: string;
}

// API response types
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface TwitterPostResponse extends ApiResponse {
  tweet?: any;
  tweetIds?: string[];
}

// Thread tweet options
export interface ThreadTweetOptions {
  text: string;
  media?: {
    media_ids: [string] | [string, string] | [string, string, string] | [string, string, string, string];
  };
}

// Post result state
export interface PostResult {
  success: boolean;
  message: string;
}
