// src/components/FarmingGuidance.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const FarmingGuidance = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState({
    videos: [],
    articles: [],
    tips: []
  });

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Resources", icon: "📚", color: "from-green-500 to-emerald-600" },
    { id: "organic", name: "Organic Farming", icon: "🌿", color: "from-green-400 to-teal-500" },
    { id: "irrigation", name: "Irrigation", icon: "💧", color: "from-blue-400 to-cyan-500" },
    { id: "soil", name: "Soil Management", icon: "🌱", color: "from-amber-500 to-orange-500" },
    { id: "pest", name: "Pest Control", icon: "🐞", color: "from-red-400 to-pink-500" },
    { id: "crops", name: "Crop Management", icon: "📊", color: "from-purple-400 to-indigo-500" },
    { id: "technology", name: "Farming Tech", icon: "🔧", color: "from-gray-500 to-blue-500" },
    { id: "sustainability", name: "Sustainability", icon: "♻️", color: "from-emerald-400 to-green-500" }
  ];

  // Fetch farming resources from free APIs and sources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // Fetch YouTube videos using YouTube Data API (free tier)
        const youtubeVideos = await fetchYouTubeVideos();
        
        // Fetch agricultural articles from free APIs
        const farmingArticles = await fetchFarmingArticles();
        
        // Predefined farming tips (can be extended with API calls)
        const farmingTips = getFarmingTips();

        setResources({
          videos: youtubeVideos,
          articles: farmingArticles,
          tips: farmingTips
        });

      } catch (error) {
        console.error("Error fetching resources:", error);
        // Fallback to default data if API fails
        setResources(getDefaultResources());
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Fetch YouTube videos related to farming
  const fetchYouTubeVideos = async () => {
    try {
      // Note: In production, you'd use your YouTube Data API key
      // For demo, we'll use a simulated response
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: 'farming techniques agriculture tips',
          type: 'video',
          maxResults: 12,
          key: 'YOUR_YOUTUBE_API_KEY' // Replace with actual API key
        }
      });

      return response.data.items.map((item, index) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        youtubeId: item.id.videoId,
        duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        category: getRandomCategory(),
        level: ['beginner', 'intermediate', 'advanced'][index % 3],
        views: `${(Math.random() * 5).toFixed(1)}M`,
        uploadDate: new Date(item.snippet.publishedAt).toISOString().split('T')[0],
        instructor: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url
      }));
    } catch (error) {
      console.log('Using mock YouTube data', error);
      return getMockYouTubeVideos();
    }
  };

  // Fetch farming articles from free sources
  const fetchFarmingArticles = async () => {
    try {
      // Using NewsAPI or similar free service for agricultural news
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: 'farming agriculture techniques',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 8,
          apiKey: 'YOUR_NEWS_API_KEY' // Replace with actual API key
        }
      });

      return response.data.articles.map((article, index) => ({
        id: `article-${index}`,
        title: article.title,
        description: article.description || 'Learn about modern farming techniques and best practices.',
        content: article.content || 'Agricultural insights and farming methodologies...',
        category: getRandomCategory(),
        readTime: `${Math.floor(Math.random() * 10) + 3} min`,
        author: article.author || 'Agricultural Expert',
        publishDate: new Date(article.publishedAt).toISOString().split('T')[0],
        source: article.source.name,
        url: article.url
      }));
    } catch (error) {
      console.log('Using mock article data', error);
      return getMockArticles();
    }
  };

  // Helper functions
  const getRandomCategory = () => {
    const categories = ['organic', 'irrigation', 'soil', 'pest', 'crops', 'technology', 'sustainability'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const getFarmingTips = () => [
    {
      id: 1,
      title: "Water Conservation Tips",
      description: "Save water while maintaining crop health",
      tips: [
        "Water early in the morning to reduce evaporation",
        "Use mulch to retain soil moisture",
        "Install drip irrigation systems",
        "Collect rainwater for irrigation",
        "Monitor soil moisture regularly"
      ],
      category: "irrigation",
      icon: "💧"
    },
    {
      id: 2,
      title: "Soil Health Improvement",
      description: "Enhance your soil quality naturally",
      tips: [
        "Practice crop rotation regularly",
        "Add organic compost to soil",
        "Use cover crops during off-season",
        "Avoid soil compaction",
        "Test soil pH annually"
      ],
      category: "soil",
      icon: "🌱"
    },
    {
      id: 3,
      title: "Pest Prevention",
      description: "Natural ways to keep pests away",
      tips: [
        "Plant companion crops",
        "Use neem oil as natural pesticide",
        "Introduce beneficial insects",
        "Keep farming area clean",
        "Rotate pest-prone crops"
      ],
      category: "pest",
      icon: "🐞"
    },
    {
      id: 4,
      title: "Yield Optimization",
      description: "Maximize your crop production",
      tips: [
        "Prune plants for better growth",
        "Use quality seeds",
        "Monitor plant spacing",
        "Apply fertilizers at right time",
        "Harvest at optimal maturity"
      ],
      category: "crops",
      icon: "📈"
    }
  ];

  // Mock data fallback
  const getMockYouTubeVideos = () => [
    {
      id: "WcWmKxVql_s",
      title: "Organic Farming Techniques for Beginners",
      description: "Learn the basics of organic farming, soil preparation, and natural pest control methods from agricultural experts.",
      youtubeId: "WcWmKxVql_s",
      duration: "15:30",
      category: "organic",
      level: "beginner",
      views: "2.4M",
      uploadDate: "2023-01-15",
      instructor: "Dr. Agricultural Expert"
    },
    {
      id: "qGfG4J1kx_c",
      title: "Modern Irrigation Systems for Smart Farming",
      description: "Explore drip irrigation, sprinkler systems, and water conservation techniques for efficient water management.",
      youtubeId: "qGfG4J1kx_c",
      duration: "12:45",
      category: "irrigation",
      level: "intermediate",
      views: "1.8M",
      uploadDate: "2023-03-22",
      instructor: "Irrigation Specialist"
    },
    {
      id: "vG8W12Zz5Qk",
      title: "Soil Health Management & Testing",
      description: "Complete guide to soil testing, pH balancing, and nutrient management for optimal crop growth.",
      youtubeId: "vG8W12Zz5Qk",
      duration: "18:20",
      category: "soil",
      level: "beginner",
      views: "3.1M",
      uploadDate: "2023-02-10",
      instructor: "Soil Scientist"
    }
  ];

  const getMockArticles = () => [
    {
      id: 1,
      title: "Sustainable Farming Practices for Modern Agriculture",
      description: "Comprehensive guide on implementing sustainable farming methods for long-term success and environmental protection.",
      content: "Sustainable farming focuses on environmental health, economic profitability, and social equity...",
      category: "sustainability",
      readTime: "8 min",
      author: "Dr. Agricultural Expert",
      publishDate: "2023-07-15",
      source: "Farming Today Journal",
      url: "#"
    },
    {
      id: 2,
      title: "Understanding Soil Nutrition and Fertilizer Management",
      description: "Learn about essential nutrients and how to manage fertilizer application effectively for better yields.",
      content: "Proper soil nutrition is the foundation of successful farming. Understanding NPK ratios...",
      category: "soil",
      readTime: "6 min",
      author: "Soil Science Institute",
      publishDate: "2023-08-22",
      source: "Agricultural Research",
      url: "#"
    }
  ];

  const getDefaultResources = () => ({
    videos: getMockYouTubeVideos(),
    articles: getMockArticles(),
    tips: getFarmingTips()
  });

  // Filter resources based on category and search term
  const filteredVideos = resources.videos.filter(video => 
    (activeCategory === "all" || video.category === activeCategory) &&
    (video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     video.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredArticles = resources.articles.filter(article => 
    (activeCategory === "all" || article.category === activeCategory) &&
    (article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     article.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTips = resources.tips.filter(tip => 
    (activeCategory === "all" || tip.category === activeCategory) &&
    (tip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     tip.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Load user data
  // No persistent user state required in this component
  // Previously the loadUser effect and 'user' state were removed because 'user' was not used here.
  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading farming resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="md:text-3xl font-bold mb-4">🌾 Farming Guidance </h1>
          <p className=" opacity-90 mb-8 max-w-3xl mx-auto">
            Your comprehensive resource for farming techniques, expert videos, research articles, and practical tips
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto text-white font-black ">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for farming techniques, crop management, irrigation methods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-amber-50 focus:ring-2 focus:ring-green-300 focus:outline-1 shadow-lg"
              />
              <div className="absolute right-3 top-3">
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                activeCategory === category.id 
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="space-y-12">
          {/* Videos Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span className="bg-gradient-to-r from-green-300 to bg-green-400 text-white p-2 rounded-xl">🎬</span>
                Educational Videos
                <span className="text-lg font-normal text-gray-600 ml-2">
                  ({filteredVideos.length} videos)
                </span>
              </h2>
            </div>

            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map(video => (
                  <div key={video.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-200 hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎥</div>
                          <div className="text-sm text-gray-600">YouTube Video</div>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          video.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          video.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {video.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {video.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>👨‍🏫 {video.instructor}</span>
                        <span>👁️ {video.views}</span>
                      </div>
                      
                      <button
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
                        className="w-full bg-green-400 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        Watch Video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-green-200">
                <div className="text-6xl mb-4">📹</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Videos Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </section>

          {/* Articles Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <span className="bg-gradient-to-r from-green-500 to bg-green-100 text-white p-2 rounded-xl">📄</span>
              Research & Articles
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({filteredArticles.length} articles)
              </span>
            </h2>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map(article => (
                  <div key={article.id} className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-3 rounded-xl">
                        <span className="text-2xl">📖</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {article.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <span>✍️ {article.author}</span>
                            <span>⏱️ {article.readTime}</span>
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {article.source}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => article.url && window.open(article.url, '_blank')}
                          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-700 hover:to-cyan-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200"
                        >
                          Read Article
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-blue-200">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h3>
                <p className="text-gray-600">Try different search terms or categories</p>
              </div>
            )}
          </section>

          {/* Tips Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <span className="bg-gradient-to-r from-green-500 to bg-green-200 text-white p-2 rounded-xl">💡</span>
              Practical Farming Tips
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({filteredTips.length} tips collections)
              </span>
            </h2>

            {filteredTips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTips.map(tip => (
                  <div key={tip.id} className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200 hover:shadow-xl transition-all duration-300">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{tip.icon}</div>
                      <h3 className="font-bold text-lg text-gray-800">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                    
                    <ul className="space-y-2">
                      {tip.tips.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-500 mt-1">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-amber-200">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Tips Found</h3>
                <p className="text-gray-600">Adjust your search to find practical farming tips</p>
              </div>
            )}
          </section>
        </div>
      </div>


    </div>
  );
};

export default FarmingGuidance;