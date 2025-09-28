import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Play } from "lucide-react";

// TODO: Remove mock data when connecting to real APIs
const mockApis = [
  {
    id: "youtube-dl",
    name: "YouTube Downloader",
    description: "Download videos, audio, and metadata from YouTube",
    category: "Video",
    status: "active",
    endpoint: "/api/youtube"
  },
  {
    id: "tiktok-dl", 
    name: "TikTok Downloader",
    description: "Extract TikTok videos without watermarks",
    category: "Video",
    status: "active",
    endpoint: "/api/tiktok"
  },
  {
    id: "instagram-dl",
    name: "Instagram Downloader",
    description: "Download Instagram posts, stories, and reels",
    category: "Social",
    status: "active",
    endpoint: "/api/instagram"
  },
  {
    id: "twitter-dl",
    name: "Twitter Media Downloader",
    description: "Extract media from Twitter posts and threads",
    category: "Social",
    status: "beta",
    endpoint: "/api/twitter"
  },
  {
    id: "soundcloud-dl",
    name: "SoundCloud Downloader",
    description: "Download audio tracks and playlists from SoundCloud",
    category: "Audio",
    status: "active",
    endpoint: "/api/soundcloud"
  },
  {
    id: "spotify-meta",
    name: "Spotify Metadata",
    description: "Get track information and metadata from Spotify",
    category: "Audio",
    status: "maintenance",
    endpoint: "/api/spotify"
  }
];

export function ApiList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(mockApis.map(api => api.category)))];
  
  const filteredApis = mockApis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || api.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "beta": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "maintenance": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">API Services</h1>
        <p className="text-muted-foreground">
          Explore and test our available API endpoints for downloading content from various platforms.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search APIs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-apis"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              data-testid={`button-category-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApis.map((api) => (
          <Card key={api.id} className="p-6 hover-elevate" data-testid={`card-api-${api.id}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{api.name}</h3>
                <Badge className={getStatusColor(api.status)} data-testid={`badge-status-${api.status}`}>
                  {api.status}
                </Badge>
              </div>
              <Badge variant="outline" data-testid={`badge-category-${api.category.toLowerCase()}`}>
                {api.category}
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {api.description}
            </p>
            
            <div className="flex gap-3">
              <Link href={`/dashboard/api/${api.id}`} data-testid={`link-test-api-${api.id}`}>
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Test API
                </Button>
              </Link>
              <Button variant="outline" size="sm" data-testid={`button-docs-${api.id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Docs
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredApis.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No APIs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}