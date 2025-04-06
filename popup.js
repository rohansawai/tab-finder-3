document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input")
  const searchButton = document.getElementById("search-button")
  const apiKeyInput = document.getElementById("api-key")
  const saveApiKeyButton = document.getElementById("save-api-key")
  const statusMessage = document.getElementById("status-message")
  const resultsList = document.getElementById("results-list")
  const loadingElement = document.getElementById("loading")

  // Load saved API token
  chrome.storage.local.get(["huggingFaceToken"], (result) => {
    if (result.huggingFaceToken) {
      apiKeyInput.value = result.huggingFaceToken
      apiKeyInput.type = "password"
      statusMessage.textContent = "Hugging Face token loaded"
      statusMessage.className = "status success"
    }
  })

  // Save API token
  saveApiKeyButton.addEventListener("click", () => {
    const apiKey = apiKeyInput.value.trim()
    chrome.storage.local.set({ huggingFaceToken: apiKey }, () => {
      if (apiKey) {
        statusMessage.textContent = "Hugging Face token saved successfully"
      } else {
        statusMessage.textContent = "Using local matching (no token)"
      }
      statusMessage.className = "status success"
      setTimeout(() => {
        statusMessage.textContent = ""
      }, 3000)
    })
  })

  // Search for tabs
  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim()
    if (!query) {
      statusMessage.textContent = "Please enter a description"
      statusMessage.className = "status error"
      return
    }

    // Get API token (optional)
    const { huggingFaceToken } = await chrome.storage.local.get(["huggingFaceToken"])

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

      // Call AI to find matching tabs (with or without API token)
      const matchedTabs = await findMatchingTabs(query, tabData, huggingFaceToken)

      // Display results
      displayResults(matchedTabs, tabs)
    } catch (error) {
      statusMessage.textContent = `Error: ${error.message}`
      statusMessage.className = "status error"
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

  // Function to find matching tabs using Hugging Face or local processing
  async function findMatchingTabs(query, tabData, apiKey) {
    // If we have a Hugging Face API token, use their API
    if (apiKey) {
      return await findMatchingTabsWithHuggingFace(query, tabData, apiKey)
    } else {
      // Otherwise, use a simple local matching algorithm
      return findMatchingTabsLocally(query, tabData)
    }
  }

  // Function to find matching tabs using Hugging Face's API
  async function findMatchingTabsWithHuggingFace(query, tabData, apiKey) {
    // Prepare the data for the embedding model
    const texts = tabData.map((tab) => `${tab.title} ${tab.url}`)
    texts.push(query) // Add the query as the last item

    // Get embeddings from Hugging Face
    const response = await fetch("https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: {
          source_sentence: query,
          sentences: texts.slice(0, -1), // All except the query
        },
      }),
    })

    if (!response.ok) {
      // If the API call fails, fall back to local matching
      console.warn("Hugging Face API call failed, falling back to local matching")
      return findMatchingTabsLocally(query, tabData)
    }

    const similarities = await response.json()

    // Create pairs of [tab index, similarity score]
    const scoredIndices = similarities.map((score, index) => [index, score])

    // Sort by similarity score (descending)
    scoredIndices.sort((a, b) => b[1] - a[1])

    // Take the top 5 results
    const topIndices = scoredIndices.slice(0, 5).map((pair) => pair[0])

    // Map indices back to tab IDs
    return topIndices.map((index) => tabData[index].id)
  }

  // Function to find matching tabs locally using simple text matching
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

