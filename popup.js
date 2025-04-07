document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input")
  const searchButton = document.getElementById("search-button")
  const statusMessage = document.getElementById("status-message")
  const resultsList = document.getElementById("results-list")
  const loadingElement = document.getElementById("loading")

  // Remove API key input elements since we're using our own API key
  document.querySelector(".api-key-container").style.display = "none"

  // Search for tabs
  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim()
    if (!query) {
      statusMessage.textContent = "Please enter a description"
      statusMessage.className = "status error"
      return
    }

    // Show loading state
    loadingElement.classList.remove("hidden")
    resultsList.innerHTML = ""
    statusMessage.textContent = ""

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
      const matchedTabs = await findMatchingTabsWithAI(query, tabData)

      // Display results
      displayResults(matchedTabs, tabs)
    } catch (error) {
      statusMessage.textContent = `Error: ${error.message}`
      statusMessage.className = "status error"

      // Fallback to local matching if the AI search fails
      try {
        const tabs = await chrome.tabs.query({})
        const tabData = tabs.map((tab) => ({
          id: tab.id,
          title: tab.title,
          url: tab.url,
          favIconUrl: tab.favIconUrl,
        }))

        statusMessage.textContent = "Using fallback local matching"
        statusMessage.className = "status warning"

        const matchedTabs = findMatchingTabsLocally(query, tabData)
        displayResults(matchedTabs, tabs)
      } catch (fallbackError) {
        statusMessage.textContent = `Error: ${fallbackError.message}`
        statusMessage.className = "status error"
      }
    } finally {
      loadingElement.classList.add("hidden")
    }
  })

  // Handle Enter key in search input
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchButton.click()
    }
  })

  // Function to find matching tabs using our proxy API
  async function findMatchingTabsWithAI(query, tabData) {
    // Our proxy API endpoint - replace with your deployed URL
    const proxyUrl = "https://your-vercel-app.vercel.app/api/embed"
    
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
  async function getEmbedding(text, proxyUrl) {
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
  function cosineSimilarity(vecA, vecB) {
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
  function findMatchingTabsLocally(query, tabData) {
    const queryTerms = query.toLowerCase().split(/\s+/)

    // Score each tab based on how many query terms it contains
    const scoredTabs = tabData.map((tab) => {
      const content = `${tab.title} ${tab.url}`.toLowerCase()
      let score = 0

      // Count how many query terms appear in the tab content
      queryTerms.forEach((term) => {
        if (content.includes(term)) {
          score += 1
        }
      })

      return { id: tab.id, score }
    })

    // Sort by score (descending)
    scoredTabs.sort((a, b) => b.score - a.score)

    // Take the top 5 results with a score > 0
    return scoredTabs
      .filter((tab) => tab.score > 0)
      .slice(0, 5)
      .map((tab) => tab.id)
  }

  // Function to display results
  function displayResults(matchedTabIds, allTabs) {
    resultsList.innerHTML = ""

    if (matchedTabIds.length === 0) {
      const noResults = document.createElement("li")
      noResults.className = "tab-item"
      noResults.textContent = "No matching tabs found"
      resultsList.appendChild(noResults)
      return
    }

    // Find the full tab objects for the matched IDs
    const matchedTabs = allTabs.filter((tab) => matchedTabIds.includes(tab.id))

    // Create list items for each matched tab
    matchedTabs.forEach((tab) => {
      const listItem = document.createElement("li")
      listItem.className = "tab-item"
      listItem.dataset.tabId = tab.id

      const html = `
        <img class="tab-favicon" src="${tab.favIconUrl || "icon16.png"}" alt="">
        <div class="tab-info">
          <div class="tab-title">${escapeHTML(tab.title)}</div>
          <div class="tab-url">${escapeHTML(tab.url)}</div>
        </div>
      `

      listItem.innerHTML = html

      // Add click event to focus on the tab
      listItem.addEventListener("click", () => {
        chrome.tabs.update(tab.id, { active: true })
        chrome.tabs.get(tab.id, (tab) => {
          chrome.windows.update(tab.windowId, { focused: true })
        })
      })

      resultsList.appendChild(listItem)
    })
  }

  // Helper function to escape HTML
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
})

