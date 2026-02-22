/**
 * PWA Utilities for Infuse AI
 * Handles service worker registration, install prompts, and notifications
 */

// Service Worker Registration
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered:', registration.scope);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            dispatchPWAEvent('updateAvailable', { registration });
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

// Install Prompt Handler
let deferredPrompt = null;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    dispatchPWAEvent('installPromptReady', { prompt: e });
  });
  
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    dispatchPWAEvent('appInstalled', {});
  });
}

export async function showInstallPrompt() {
  if (!deferredPrompt) {
    console.log('No install prompt available');
    return false;
  }
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log('Install prompt outcome:', outcome);
  deferredPrompt = null;
  
  return outcome === 'accepted';
}

export function canInstall() {
  return !!deferredPrompt;
}

// Push Notifications
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.REACT_APP_VAPID_PUBLIC_KEY || ''
      )
    });
    
    console.log('Push subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
}

// Display Mode Detection
export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function isPWA() {
  return isStandalone();
}

// Offline Detection
export function isOnline() {
  return navigator.onLine;
}

export function setupOfflineDetection(onOffline, onOnline) {
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  
  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
}

// Helper Functions
function dispatchPWAEvent(name, detail) {
  window.dispatchEvent(new CustomEvent(`pwa-${name}`, { detail }));
}

function urlBase64ToUint8Array(base64String) {
  if (!base64String) return new Uint8Array();
  
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Initialize PWA features
export function initPWA() {
  registerServiceWorker();
  setupInstallPrompt();
  
  // Add meta tags for iOS
  if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
    const meta = document.createElement('meta');
    meta.name = 'apple-mobile-web-app-capable';
    meta.content = 'yes';
    document.head.appendChild(meta);
  }
}
