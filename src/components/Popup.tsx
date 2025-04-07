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
      // In a real extension, this would use chrome.tabs API
      // For the web version, we'll simulate the search
      const matchedTabs = await findMatchingTabsWithAI(searchQuery)
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

  // Simulated functions for the web version
  const findMatchingTabsWithAI = async (query: string) => {
    // This would call your API in a real extension
    return [
      { id: 1, title: 'Example Tab 1', url: 'https://example.com/1' },
      { id: 2, title: 'Example Tab 2', url: 'https://example.com/2' },
    ]
  }

  const findMatchingTabsLocally = (query: string) => {
    // Simple local matching simulation
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