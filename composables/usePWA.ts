export const usePWA = () => {
  const isInstalled = ref(false);
  const deferredPrompt = ref<any>(null);
  const showInstallPrompt = ref(false);

  const checkInstallation = () => {
    if (process.client && typeof window !== 'undefined') {
      isInstalled.value = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
    }
  };

  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallPrompt.value = true;
  };

  const installApp = async () => {
    if (!deferredPrompt.value) return;

    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    
    if (outcome === 'accepted') {
      showInstallPrompt.value = false;
    }
    
    deferredPrompt.value = null;
  };

  const dismissInstallPrompt = () => {
    showInstallPrompt.value = false;
    if (process.client && typeof localStorage !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }
  };

  if (process.client) {
    onMounted(() => {
      checkInstallation();
      
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', () => {
          isInstalled.value = true;
          showInstallPrompt.value = false;
        });

        if (typeof localStorage !== 'undefined') {
          const dismissed = localStorage.getItem('pwa-install-dismissed');
          if (dismissed) {
            const daysSinceDismissed = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) {
              showInstallPrompt.value = false;
            }
          }
        }
      }
    });

    onUnmounted(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
    });
  }

  return {
    isInstalled,
    showInstallPrompt,
    installApp,
    dismissInstallPrompt
  };
};
