interface Tab {
  id: string;
  header: string;
  content: string;
}

export function generateTabsHTML(tabs: Tab[]): string {
  if (!tabs || tabs.length === 0) {
    return generateEmptyHTML();
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Tabs</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
    <div style="max-width: 900px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Tab Headers -->
        <div style="display: flex; background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%); border-bottom: 2px solid #dee2e6; overflow-x: auto; scrollbar-width: thin;">
${tabs.map((tab, index) => `            <button 
                onclick="showTab('${tab.id}')" 
                id="tab-btn-${tab.id}"
                style="padding: 16px 32px; background-color: ${index === 0 ? 'white' : 'transparent'}; border: none; border-bottom: ${index === 0 ? '3px solid #4f46e5' : 'none'}; cursor: pointer; font-weight: ${index === 0 ? '600' : '400'}; color: ${index === 0 ? '#4f46e5' : '#6b7280'}; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0; font-size: 15px; position: relative; white-space: nowrap;"
                onmouseover="if(this.id !== 'tab-btn-' + currentTab) { this.style.backgroundColor='#f3f4f6'; this.style.color='#374151'; }" 
                onmouseout="if(this.id !== 'tab-btn-' + currentTab) { this.style.backgroundColor='transparent'; this.style.color='#6b7280'; }"
            >${escapeHtml(tab.header)}</button>`).join('\n')}
        </div>
        
        <!-- Tab Contents -->
${tabs.map((tab, index) => `        <div 
            id="tab-content-${tab.id}" 
            style="padding: 32px; display: ${index === 0 ? 'block' : 'none'}; min-height: 300px; white-space: pre-wrap; word-wrap: break-word; line-height: 1.6; color: #1f2937; animation: ${index === 0 ? 'fadeIn 0.3s ease-in' : 'none'};"
        >${escapeHtml(tab.content)}</div>`).join('\n')}
    </div>

    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>

    <script>
        var currentTab = '${tabs[0]?.id || ''}';
        
        function showTab(tabId) {
            // Get all tabs
            var allTabs = ${JSON.stringify(tabs.map(t => t.id))};
            
            // Hide all tabs and reset styles
            allTabs.forEach(function(id) {
                var content = document.getElementById('tab-content-' + id);
                var btn = document.getElementById('tab-btn-' + id);
                
                if (content) {
                    content.style.display = 'none';
                }
                
                if (btn) {
                    btn.style.backgroundColor = 'transparent';
                    btn.style.borderBottom = 'none';
                    btn.style.fontWeight = '400';
                    btn.style.color = '#6b7280';
                }
            });
            
            // Show selected tab with animation
            var selectedContent = document.getElementById('tab-content-' + tabId);
            var selectedBtn = document.getElementById('tab-btn-' + tabId);
            
            if (selectedContent) {
                selectedContent.style.display = 'block';
                selectedContent.style.animation = 'fadeIn 0.3s ease-in';
            }
            
            if (selectedBtn) {
                selectedBtn.style.backgroundColor = 'white';
                selectedBtn.style.borderBottom = '3px solid #4f46e5';
                selectedBtn.style.fontWeight = '600';
                selectedBtn.style.color = '#4f46e5';
            }
            
            currentTab = tabId;
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                var allTabs = ${JSON.stringify(tabs.map(t => t.id))};
                var currentIndex = allTabs.indexOf(currentTab);
                var newIndex;
                
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
                } else {
                    newIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
                }
                
                showTab(allTabs[newIndex]);
            }
        });
    </script>
</body>
</html>`;
}

function generateEmptyHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>No Tabs Generated</title>
</head>
<body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div style="text-align: center; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <h1 style="color: #4f46e5; margin-bottom: 10px;">No Tabs to Display</h1>
        <p style="color: #6b7280;">Please create some tabs first!</p>
    </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Export additional utility functions
export function validateTabsData(tabs: Tab[]): boolean {
  if (!Array.isArray(tabs)) return false;
  
  return tabs.every(tab => 
    tab && 
    typeof tab.id === 'string' && 
    typeof tab.header === 'string' && 
    typeof tab.content === 'string'
  );
}

export function generateTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function sanitizeTabHeader(header: string): string {
  return header.replace(/[<>\"]/g, '').trim().substring(0, 50);
}

export function sanitizeTabContent(content: string): string {
  return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}