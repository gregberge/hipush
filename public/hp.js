if ('safari' in window && 'pushNotification' in window.safari) {
  var permissionData = window.safari.pushNotification.permission('web.net.hipush');
  checkRemotePermission(permissionData);
}

function checkRemotePermission(permissionData) {
  if (permissionData.permission === 'default') {
    // This is a new web service URL and its validity is unknown.
    window.safari.pushNotification.requestPermission(
      'https://hipush.net/api/apple', // The web service URL.
      'web.net.hipush',   // The Website Push ID.
      {
        websiteId: '1'
      }, // Data that you choose to send to your server to help you identify the user.
      checkRemotePermission     // The callback function.
    );
  } else if (permissionData.permission === 'denied') {
    console.log('no');
    // The user said no.
  } else if (permissionData.permission === 'granted') {
    console.log('yes');
    // The web service URL is a valid push provider, and the user said yes.
    // permissionData.deviceToken is now available to use.
  }
}
