"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Image, Smile, X, Plus } from "lucide-react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PostData, PostResult } from "@/types"

export default function PostComposer() {
  const [posts, setPosts] = useState<PostData[]>([{ content: "", media: [] }])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [focusedPostIndex, setFocusedPostIndex] = useState(0)
  const [isTwitterEnabled, setIsTwitterEnabled] = useState(true)
  const [isThreadsEnabled, setIsThreadsEnabled] = useState(true)
  const [isPosting, setIsPosting] = useState(false)
  const [postResult, setPostResult] = useState<PostResult | null>(null)
  const { resolvedTheme } = useTheme()
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  // Check if any post is empty
  const hasEmptyPost = posts.some((post) => post.content.trim() === "")

  useEffect(() => {
    // Update refs array when posts length changes
    textareaRefs.current = textareaRefs.current.slice(0, posts.length)
  }, [posts.length])

  const addEmoji = (emoji: any) => {
    const updatedPosts = [...posts]
    const currentPost = updatedPosts[focusedPostIndex]
    currentPost.content += emoji.native
    setPosts(updatedPosts)
  }

  const handleContentChange = (content: string, index: number) => {
    const updatedPosts = [...posts]
    updatedPosts[index].content = content
    setPosts(updatedPosts)
  }

  const addNewPost = () => {
    const newIndex = posts.length
    setPosts([...posts, { content: "", media: [] }])

    // Focus the new post after it's added
    setTimeout(() => {
      setFocusedPostIndex(newIndex)
      textareaRefs.current[newIndex]?.focus()
    }, 0)
  }

  const removePost = (index: number) => {
    if (posts.length === 1) return

    const updatedPosts = posts.filter((_, i) => i !== index)
    setPosts(updatedPosts)

    // Adjust focused index if needed
    if (focusedPostIndex >= updatedPosts.length) {
      setFocusedPostIndex(updatedPosts.length - 1)
    } else if (focusedPostIndex > index) {
      setFocusedPostIndex(focusedPostIndex - 1)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const updatedPosts = [...posts]
    const currentPost = updatedPosts[focusedPostIndex]

    for (const file of Array.from(files)) {
      try {
        // Create object URL for preview
        const url = URL.createObjectURL(file)
        
        // Convert file to base64
        const buffer = await fileToBase64(file)
        
        currentPost.media.push({
          url,
          type: file.type,
          buffer,
          mimeType: file.type
        })
      } catch (error) {
        console.error("Error processing media file:", error)
      }
    }

    setPosts(updatedPosts)
    e.target.value = ""
  }
  
  // Helper function to convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = reader.result.split(',')[1]
          resolve(base64)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (postIndex: number, mediaIndex: number) => {
    const updatedPosts = [...posts]
    updatedPosts[postIndex].media = updatedPosts[postIndex].media.filter((_, i) => i !== mediaIndex)
    setPosts(updatedPosts)
  }

  const handleFocus = (index: number) => {
    setFocusedPostIndex(index)
  }

  const handlePost = async () => {
    if (hasEmptyPost || (!isTwitterEnabled && !isThreadsEnabled)) return
    
    setIsPosting(true)
    setPostResult(null)
    
    try {
      // Post to Twitter if enabled
      if (isTwitterEnabled) {
        console.log('Posting to Twitter:', posts);
        const response = await fetch('/api/twitter/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ posts }),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to post to Twitter');
        }
        
        console.log('Twitter post result:', result);
        setPostResult({ 
          success: true, 
          message: posts.length > 1 
            ? 'Thread posted successfully to Twitter!' 
            : 'Tweet posted successfully!' 
        });
        
        // Reset posts after successful posting
        setPosts([{ content: "", media: [] }]);
      }
      
      // Here you would add Threads posting logic if implemented
      if (isThreadsEnabled) {
        console.log('Threads posting would happen here');
        // This would be implemented when Threads API becomes available
      }
    } catch (error) {
      console.error('Error posting:', error);
      setPostResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to post' 
      });
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <Card className="w-full flex flex-col">
      <CardContent className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {postResult && (
          <div className={`p-3 mb-3 rounded ${postResult.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
            {postResult.message}
          </div>
        )}
        
        {posts.map((post, index) => {
          const isFocused = focusedPostIndex === index

          return (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {index < posts.length - 1 && <div className="w-0.5 h-full bg-border mx-auto mt-2"></div>}
              </div>

              <div className="flex-grow space-y-3">
                <div className="flex items-start">
                  <Textarea
                    ref={(el) => { textareaRefs.current[index] = el }}
                    placeholder={index === 0 ? "What's happening?" : "Add to your thread..."}
                    className={cn(
                      "resize-none flex-grow transition-all duration-200",
                      isFocused ? "min-h-[100px]" : "min-h-[60px] max-h-[60px]",
                    )}
                    value={post.content}
                    onChange={(e) => handleContentChange(e.target.value, index)}
                    onFocus={() => handleFocus(index)}
                  />
                  {post.content === "" && index > 0 && (
                    <Button variant="ghost" size="icon" onClick={() => removePost(index)} className="ml-2">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {(isFocused || post.media.length > 0) && post.media.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {post.media.map((media, mediaIndex) => (
                      <div key={mediaIndex} className="relative rounded-md overflow-hidden">
                        <img
                          src={media.url || "/placeholder.svg"}
                          alt={`Uploaded media ${mediaIndex + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeMedia(index, mediaIndex)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {isFocused && (
                  <div className="flex items-center">
                    <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Smile className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none">
                        <Picker
                          data={data}
                          onEmojiSelect={addEmoji}
                          theme={resolvedTheme === "dark" ? "dark" : "light"}
                        />
                      </PopoverContent>
                    </Popover>

                    <Button variant="ghost" size="icon" asChild>
                      <label>
                        <Image className="h-5 w-5" />
                        <input
                          type="file"
                          accept="image/*,.gif"
                          className="hidden"
                          onChange={handleImageUpload}
                          multiple
                        />
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>

      <CardFooter className="border-t pt-4 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Switch 
              id="twitter" 
              checked={isTwitterEnabled}
              onCheckedChange={setIsTwitterEnabled}
            />
            <Label htmlFor="twitter">Twitter/X</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              id="threads" 
              checked={isThreadsEnabled}
              onCheckedChange={setIsThreadsEnabled}
            />
            <Label htmlFor="threads">Threads</Label>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={addNewPost}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              disabled={hasEmptyPost || isPosting || (!isTwitterEnabled && !isThreadsEnabled)} 
              onClick={handlePost}
            >
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}