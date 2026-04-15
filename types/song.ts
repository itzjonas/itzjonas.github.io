export type Song = {
    album?: string;
    artist?: string;           // Optional: add more metadata!
    coverArtUrl?: string;      // Optional: cover image
    displayName: string;       // Song title
    duration?: number;         // Optional: duration in seconds
    filePath: string;          // Path or URL to the audio file
    id?: string;               // Unique identifier (optional but recommended)
  };
