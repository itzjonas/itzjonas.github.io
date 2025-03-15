export type Song = {
    displayName: string;       // Song title
    filePath: string;          // Path or URL to the audio file
    album?: string;
    artist?: string;           // Optional: add more metadata!
    coverArtUrl?: string;      // Optional: cover image
    duration?: number;         // Optional: duration in seconds
    id?: string;               // Unique identifier (optional but recommended)
  };
