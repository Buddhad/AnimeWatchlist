"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Eye,
  Check,
  Clock,
  TrendingUp,
  Shield,
  ShieldOff,
  X,
  Calendar,
  Star,
  Users,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Anime {
  mal_id: number
  title: string
  title_english?: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
  score?: number
  episodes?: number
  status: string
  synopsis?: string
  genres: Array<{ name: string }>
  year?: number
  aired?: {
    from: string
    to?: string
  }
  broadcast?: {
    day: string
    time: string
    timezone: string
  }
  airing?: boolean
}

interface WatchlistItem extends Anime {
  watchStatus: "watching" | "completed" | "plan-to-watch"
  dateAdded: string
}

export default function AnimeWatchlist() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Anime[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [ongoingAnime, setOngoingAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)
  const [showAdultContent, setShowAdultContent] = useState(false)
  const [activeTab, setActiveTab] = useState<"search" | "ongoing" | "watching" | "completed" | "plan-to-watch">(
    "ongoing",
  )
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [animeDetails, setAnimeDetails] = useState<any>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("anime-watchlist")
    if (saved) {
      setWatchlist(JSON.parse(saved))
    }
    const adultPref = localStorage.getItem("show-adult-content")
    if (adultPref) {
      setShowAdultContent(JSON.parse(adultPref))
    }
    fetchOngoingAnime()
  }, [])

  useEffect(() => {
    localStorage.setItem("anime-watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    localStorage.setItem("show-adult-content", JSON.stringify(showAdultContent))
  }, [showAdultContent])

  const filterAdultContent = (animeList: Anime[]) => {
    if (showAdultContent) return animeList

    return animeList.filter((anime) => {
      const adultGenres = ["Hentai", "Ecchi", "Erotica"]
      return !anime.genres.some((genre) => adultGenres.includes(genre.name))
    })
  }

  const fetchOngoingAnime = async () => {
    try {
      const response = await fetch("https://api.jikan.moe/v4/seasons/now?limit=24&page=1")
      const data = await response.json()
      console.log("[v0] Ongoing anime API response:", data)
      setOngoingAnime(data.data || [])
    } catch (error) {
      console.error("Error fetching ongoing anime:", error)
      setOngoingAnime([])
    }
  }

  const searchAnime = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=12`)
      const data = await response.json()
      setSearchResults(data.data || [])
    } catch (error) {
      console.error("Error fetching anime:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const addToWatchlist = (anime: Anime, status: "watching" | "completed" | "plan-to-watch") => {
    const newItem: WatchlistItem = {
      ...anime,
      watchStatus: status,
      dateAdded: new Date().toISOString(),
    }

    setWatchlist((prev) => {
      const existing = prev.find((item) => item.mal_id === anime.mal_id)
      if (existing) {
        return prev.map((item) => (item.mal_id === anime.mal_id ? { ...item, watchStatus: status } : item))
      }
      return [...prev, newItem]
    })
  }

  const removeFromWatchlist = (malId: number) => {
    setWatchlist((prev) => prev.filter((item) => item.mal_id !== malId))
  }

  const getWatchlistByStatus = (status: "watching" | "completed" | "plan-to-watch") => {
    return watchlist.filter((item) => item.watchStatus === status)
  }

  const isInWatchlist = (malId: number) => {
    return watchlist.find((item) => item.mal_id === malId)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchAnime(searchQuery)
  }

  const fetchAnimeDetails = async (malId: number) => {
    setDetailsLoading(true)
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}/full`)
      const data = await response.json()
      setAnimeDetails(data.data)
    } catch (error) {
      console.error("Error fetching anime details:", error)
      setAnimeDetails(null)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleAnimeClick = (anime: Anime) => {
    setSelectedAnime(anime)
    fetchAnimeDetails(anime.mal_id)
  }

  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-white font-medium animate-pulse">Loading anime data...</p>
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  )

  const AnimeCard = ({
    anime,
    isWatchlistItem = false,
    showOngoingDetails = false,
  }: { anime: Anime | WatchlistItem; isWatchlistItem?: boolean; showOngoingDetails?: boolean }) => {
    const watchlistItem = isInWatchlist(anime.mal_id)

    return (
      <Card
        className="group bg-black border-gray-800 hover:border-red-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/20 cursor-pointer transform-gpu hover:rotate-y-12 perspective-1000 overflow-hidden"
        onClick={() => handleAnimeClick(anime)}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative">
          <div className="relative overflow-hidden">
            <img
              src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
              alt={anime.title}
              className="w-full h-80 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = anime.images.jpg.image_url || "/placeholder.svg?height=320&width=180"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

            {showOngoingDetails && anime.airing && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-red-600 text-white animate-pulse shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  AIRING
                </Badge>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-red-600/90 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {!isWatchlistItem ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToWatchlist(anime, "watching")
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white flex-1 shadow-lg"
                    disabled={!!watchlistItem}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {watchlistItem?.watchStatus === "watching" ? "Watching" : "Watch"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToWatchlist(anime, "plan-to-watch")
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white flex-1 shadow-lg"
                    disabled={!!watchlistItem}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Plan
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToWatchlist(anime, "completed")
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 shadow-lg"
                    disabled={(anime as WatchlistItem).watchStatus === "completed"}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFromWatchlist(anime.mal_id)
                    }}
                    variant="destructive"
                    className="flex-1 shadow-lg"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent">
            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
              {anime.title_english || anime.title}
            </h3>

            <div className="flex items-center justify-between mb-2">
              {anime.score && (
                <Badge variant="secondary" className="bg-red-600 text-white shadow-sm">
                  <Star className="w-3 h-3 mr-1 fill-white" />
                  {anime.score}
                </Badge>
              )}
              {anime.episodes && (
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {anime.episodes} eps
                </Badge>
              )}
            </div>

            {showOngoingDetails && anime.broadcast && (
              <div className="mb-2">
                <Badge variant="outline" className="border-red-500 text-red-400 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {anime.broadcast.day}s at {anime.broadcast.time}
                </Badge>
              </div>
            )}

            {isWatchlistItem && (
              <Badge
                className={`mb-2 ${
                  (anime as WatchlistItem).watchStatus === "watching"
                    ? "bg-red-600"
                    : (anime as WatchlistItem).watchStatus === "completed"
                      ? "bg-green-600"
                      : "bg-gray-600"
                } text-white shadow-sm`}
              >
                {(anime as WatchlistItem).watchStatus === "watching" ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Watching
                  </>
                ) : (anime as WatchlistItem).watchStatus === "completed" ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Completed
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Plan to Watch
                  </>
                )}
              </Badge>
            )}

            <p className="text-gray-400 text-xs line-clamp-2">{anime.synopsis?.substring(0, 100)}...</p>
          </div>
        </div>
      </Card>
    )
  }

  const AnimeDetailsModal = () => {
    if (!selectedAnime) return null

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedAnime(null)
                setAnimeDetails(null)
              }}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="w-4 h-4" />
            </Button>

            {detailsLoading ? (
              <LoadingAnimation />
            ) : animeDetails ? (
              <div>
                <div className="relative h-64 md:h-80">
                  <img
                    src={animeDetails.images?.jpg?.large_image_url || selectedAnime.images.jpg.large_image_url}
                    alt={animeDetails.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {animeDetails.title_english || animeDetails.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {animeDetails.score && (
                        <Badge className="bg-red-600 text-white">
                          <Star className="w-3 h-3 mr-1 fill-white" />
                          {animeDetails.score}
                        </Badge>
                      )}
                      {animeDetails.members && (
                        <Badge variant="outline" className="border-gray-500 text-gray-300">
                          <Users className="w-3 h-3 mr-1" />
                          {animeDetails.members.toLocaleString()} members
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-gray-500 text-gray-300">
                        {animeDetails.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {animeDetails.synopsis || "No synopsis available."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {animeDetails.genres?.map((genre: any) => (
                          <Badge key={genre.mal_id} variant="outline" className="border-red-500 text-red-400">
                            {genre.name}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => addToWatchlist(selectedAnime, "watching")}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={!!isInWatchlist(selectedAnime.mal_id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Add to Watching
                        </Button>
                        <Button
                          onClick={() => addToWatchlist(selectedAnime, "plan-to-watch")}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          disabled={!!isInWatchlist(selectedAnime.mal_id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Plan to Watch
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Details</h3>
                      <div className="space-y-3 text-sm">
                        {animeDetails.episodes && (
                          <div>
                            <span className="text-gray-400">Episodes:</span>
                            <span className="text-white ml-2">{animeDetails.episodes}</span>
                          </div>
                        )}
                        {animeDetails.duration && (
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white ml-2">{animeDetails.duration}</span>
                          </div>
                        )}
                        {animeDetails.aired?.from && (
                          <div>
                            <span className="text-gray-400">Aired:</span>
                            <span className="text-white ml-2">
                              {new Date(animeDetails.aired.from).getFullYear()}
                              {animeDetails.aired.to && ` - ${new Date(animeDetails.aired.to).getFullYear()}`}
                            </span>
                          </div>
                        )}
                        {animeDetails.studios?.length > 0 && (
                          <div>
                            <span className="text-gray-400">Studio:</span>
                            <span className="text-white ml-2">
                              {animeDetails.studios.map((studio: any) => studio.name).join(", ")}
                            </span>
                          </div>
                        )}
                        {animeDetails.source && (
                          <div>
                            <span className="text-gray-400">Source:</span>
                            <span className="text-white ml-2">{animeDetails.source}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400">Failed to load anime details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center mb-6">
            <span className="text-white">Anime</span>
            <span className="text-red-500">Watch</span>
            <span className="text-white">list</span>
          </h1>

          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>
          </form>

          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdultContent(!showAdultContent)}
              className={`border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 ${
                showAdultContent ? "bg-red-600/20 border-red-500 text-red-400" : ""
              }`}
            >
              {showAdultContent ? (
                <>
                  <ShieldOff className="w-4 h-4 mr-2" />
                  Adult Content: ON
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Adult Content: OFF
                </>
              )}
            </Button>
          </div>

          <nav className="flex justify-center space-x-1 flex-wrap">
            {[
              { key: "ongoing", label: "Ongoing", count: filterAdultContent(ongoingAnime).length, icon: TrendingUp },
              { key: "search", label: "Search", count: filterAdultContent(searchResults).length },
              { key: "watching", label: "Watching", count: getWatchlistByStatus("watching").length },
              { key: "completed", label: "Completed", count: getWatchlistByStatus("completed").length },
              { key: "plan-to-watch", label: "Plan to Watch", count: getWatchlistByStatus("plan-to-watch").length },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.key as any)}
                className={`${
                  activeTab === tab.key
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                } mb-2`}
              >
                {tab.icon && <tab.icon className="w-4 h-4 mr-1" />}
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-gray-700 text-white">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && <LoadingAnimation />}

        {activeTab === "ongoing" && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Currently Airing Anime</h2>
              <p className="text-gray-400">Discover what's trending this season</p>
            </div>
            {filterAdultContent(ongoingAnime).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filterAdultContent(ongoingAnime).map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} showOngoingDetails />
                ))}
              </div>
            ) : ongoingAnime.length > 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">All ongoing anime filtered due to adult content settings</p>
                <Button
                  variant="outline"
                  onClick={() => setShowAdultContent(true)}
                  className="mt-4 border-red-500 text-red-400 hover:bg-red-600/20"
                >
                  Show Adult Content
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading ongoing anime...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "search" && !loading && (
          <div>
            {filterAdultContent(searchResults).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filterAdultContent(searchResults).map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">All search results filtered due to adult content settings</p>
                <Button
                  variant="outline"
                  onClick={() => setShowAdultContent(true)}
                  className="mt-4 border-red-500 text-red-400 hover:bg-red-600/20"
                >
                  Show Adult Content
                </Button>
              </div>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No anime found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Search for anime to add to your watchlist</p>
              </div>
            )}
          </div>
        )}

        {activeTab !== "search" && activeTab !== "ongoing" && (
          <div>
            {getWatchlistByStatus(activeTab).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {getWatchlistByStatus(activeTab).map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} isWatchlistItem />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No anime in your {activeTab.replace("-", " ")} list yet</p>
              </div>
            )}
          </div>
        )}
      </main>

      <AnimeDetailsModal />
    </div>
  )
}
