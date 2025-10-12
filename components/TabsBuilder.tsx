"use client";

import { useState, useEffect } from "react";
import OutputDisplay from "./OutputDisplay";

interface Tab {
  id: string;
  header: string;
  content: string;
}

export default function TabsBuilder() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", header: "Step 1", content: "Step 2:\n1. Install VSCode\n2. Install Chrome\n3. Install Node\n4. etc" },
    { id: "2", header: "Step 2", content: "" },
    { id: "3", header: "Step 3", content: "" },
  ]);
  const [selectedTabId, setSelectedTabId] = useState<string>("1");
  const [outputCode, setOutputCode] = useState<string>("");

  useEffect(() => {
    // Load tabs from localStorage
    const savedTabs = localStorage.getItem("tabs");
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        setTabs(parsedTabs);
        if (parsedTabs.length > 0) {
          setSelectedTabId(parsedTabs[0].id);
        }
      } catch (e) {
        console.error("Error loading tabs:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save tabs to localStorage
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

  const addTab = () => {
    if (tabs.length >= 15) {
      alert("Maximum 15 tabs allowed");
      return;
    }
    const newTab: Tab = {
      id: Date.now().toString(),
      header: `Tab ${tabs.length + 1}`,
      content: "",
    };
    setTabs([...tabs, newTab]);
  };

  const removeTab = (id: string) => {
    if (tabs.length <= 1) {
      alert("Must have at least one tab");
      return;
    }
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (selectedTabId === id && newTabs.length > 0) {
      setSelectedTabId(newTabs[0].id);
    }
  };

  const updateTabHeader = (id: string, header: string) => {
    setTabs(tabs.map((tab) => (tab.id === id ? { ...tab, header } : tab)));
  };

  const updateTabContent = (id: string, content: string) => {
    setTabs(tabs.map((tab) => (tab.id === id ? { ...tab, content } : tab)));
  };

  const generateOutput = () => {
    const htmlCode = generateTabsHTML(tabs);
    setOutputCode(htmlCode);
  };

  const selectedTab = tabs.find((tab) => tab.id === selectedTabId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tabs Headers Section */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Tabs Headers:</h3>
            <div className="flex gap-2">
              <button
                onClick={addTab}
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                aria-label="Add tab"
              >
                [+]
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tab.header}
                  onChange={(e) => updateTabHeader(tab.id, e.target.value)}
                  onClick={() => setSelectedTabId(tab.id)}
                  className={`flex-1 px-3 py-2 border rounded ${
                    selectedTabId === tab.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-300 dark:border-gray-600"
                  } dark:bg-gray-700`}
                />
                <button
                  onClick={() => removeTab(tab.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  aria-label={`Remove ${tab.header}`}
                >
                  [-]
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Content Section */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold mb-4">Tabs Content</h3>
          {selectedTab && (
            <textarea
              value={selectedTab.content}
              onChange={(e) => updateTabContent(selectedTab.id, e.target.value)}
              className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Enter tab content here..."
            />
          )}
        </div>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={generateOutput}
            className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Output
          </button>
          <OutputDisplay code={outputCode} />
        </div>
      </div>
    </div>
  );
}

function generateTabsHTML(tabs: Tab[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Tabs</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5;">
    <div style="max-width: 800px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Tab Headers -->
        <div style="display: flex; border-bottom: 2px solid #e0e0e0; background-color: #fafafa; border-radius: 8px 8px 0 0; overflow-x: auto;">
${tabs.map((tab, index) => `            <button 
                onclick="showTab('${tab.id}')" 
                id="tab-btn-${tab.id}"
                style="padding: 12px 24px; background-color: ${index === 0 ? 'white' : 'transparent'}; border: none; border-bottom: ${index === 0 ? '2px solid #2196F3' : 'none'}; cursor: pointer; font-weight: ${index === 0 ? 'bold' : 'normal'}; color: ${index === 0 ? '#2196F3' : '#666'}; transition: all 0.3s ease; flex-shrink: 0;"
                onmouseover="this.style.backgroundColor='#f0f0f0'" 
                onmouseout="if(this.id !== 'tab-btn-' + currentTab) this.style.backgroundColor='transparent'"
            >${tab.header}</button>`).join('\n')}
        </div>
        
        <!-- Tab Contents -->
${tabs.map((tab, index) => `        <div 
            id="tab-content-${tab.id}" 
            style="padding: 20px; display: ${index === 0 ? 'block' : 'none'}; min-height: 200px; white-space: pre-wrap;"
        >${tab.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`).join('\n')}
    </div>

    <script>
        var currentTab = '${tabs[0]?.id || ''}';
        
        function showTab(tabId) {
            // Hide all tabs
            ${tabs.map(tab => `document.getElementById('tab-content-${tab.id}').style.display = 'none';
            document.getElementById('tab-btn-${tab.id}').style.backgroundColor = 'transparent';
            document.getElementById('tab-btn-${tab.id}').style.borderBottom = 'none';
            document.getElementById('tab-btn-${tab.id}').style.fontWeight = 'normal';
            document.getElementById('tab-btn-${tab.id}').style.color = '#666';`).join('\n            ')}
            
            // Show selected tab
            document.getElementById('tab-content-' + tabId).style.display = 'block';
            document.getElementById('tab-btn-' + tabId).style.backgroundColor = 'white';
            document.getElementById('tab-btn-' + tabId).style.borderBottom = '2px solid #2196F3';
            document.getElementById('tab-btn-' + tabId).style.fontWeight = 'bold';
            document.getElementById('tab-btn-' + tabId).style.color = '#2196F3';
            
            currentTab = tabId;
        }
    </script>
</body>
</html>`;
}