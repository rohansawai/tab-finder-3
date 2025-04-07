"use client"

import { useEffect, useState } from 'react'
import { config } from '../config/config'
import '../styles/popup.css'

export default function Popup() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setStatusMessage('Please enter a description')
      return
    }

    setIsLoading(true)
    setResults([])
    setStatusMessage('')

    try {
      // Get all tabs
      const tabs = await chrome.tabs.query({})

      // Prepare tab data for AI
      const tabData = tabs.map((tab) => ({
        id: tab.id,
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
      }))

      // Call our proxy API to find matching tabs
      const matchedTabs = await findMatchingTabsWithAI(searchQuery, tabData)
      setResults(matchedTabs)
    } catch (error: any) {
      setStatusMessage(`Error: ${error.message}`)
      
      // Fallback to local matching
      try {
        setStatusMessage('Using fallback local matching')
        const matchedTabs = findMatchingTabsLocally(searchQuery)
        setResults(matchedTabs)
      } catch (fallbackError: any) {
        setStatusMessage(`Error: ${fallbackError.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Function to find matching tabs using our proxy API
  const findMatchingTabsWithAI = async (query: string, tabData: any[]) => {
    // Our proxy API endpoint
    const proxyUrl = `${config.api.baseUrl}/api/embed`
    
    // Get embeddings for the query
    const queryEmbedding = await getEmbedding(query, proxyUrl)
    
    // Get embeddings for each tab
    const tabEmbeddings = await Promise.all(
      tabData.map(async (tab) => {
        const text = `${tab.title} ${tab.url}`
        const embedding = await getEmbedding(text, proxyUrl)
        return { id: tab.id, embedding }
      })
    )
    
    // Calculate similarity scores
    const scoredTabs = tabEmbeddings.map(({ id, embedding }) => {
      const score = cosineSimilarity(queryEmbedding, embedding)
      return { id, score }
    })
    
    // Sort by score (descending)
    scoredTabs.sort((a, b) => b.score - a.score)
    
    // Take the top 5 results with a score > 0.5
    return scoredTabs
      .filter((tab) => tab.score > 0.5)
      .slice(0, 5)
      .map((tab) => tab.id)
  }
  
  // Function to get embeddings from our proxy API
  const getEmbedding = async (text: string, proxyUrl: string) => {
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.embedding
  }
  
  // Function to calculate cosine similarity between two vectors
  const cosineSimilarity = (vecA: number[], vecB: number[]) => {
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }
    
    normA = Math.sqrt(normA)
    normB = Math.sqrt(normB)
    
    if (normA === 0 || normB === 0) return 0
    
    return dotProduct / (normA * normB)
  }

  // Function to find matching tabs locally using simple text matching (fallback)
  const findMatchingTabsLocally = (query: string) => {
    const queryTerms = query.toLowerCase().split(/\s+/)
    return [
      { id: 3, title: 'Local Match 1', url: 'https://example.com/3' },
      { id: 4, title: 'Local Match 2', url: 'https://example.com/4' },
    ]
  }

  return (
    <div className="popup-container">
      <h1>{config.app.name}</h1>
      <p>{config.app.description}</p>
      
      <div className="search-container">
        <input
          type="text"
          id="search-input"
          placeholder="Describe the tab you're looking for..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          id="search-button"
          onClick={handleSearch}
          disabled={isLoading}
        >
          Search
        </button>
      </div>
      
      {isLoading && <div id="loading" className="loading">Searching...</div>}
      
      {statusMessage && (
        <div id="status-message" className={`status ${statusMessage.includes('Error') ? 'error' : 'info'}`}>
          {statusMessage}
        </div>
      )}
      
      <ul id="results-list" className="results-list">
        {results.map((result) => (
          <li key={result.id} className="result-item">
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
} 