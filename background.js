chrome.runtime.onConnect.addListener(function(port) {
  console.log("object");
  if (port.name === 'content-script') {
      port.onMessage.addListener(function(message) {
          if (message.action === 'mediaUrl') {
              const mediaUrl = message.url;
              chrome.downloads.download({ url: mediaUrl });
          }
      });
  }
});
