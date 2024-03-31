const defaultText = "loading...";
const loadingActive = ref(false);
const loadingText = ref(defaultText);

export default function () {
  function startLoading(text: string = defaultText) {
    loadingText.value = text;
    loadingActive.value = true;
    //lock the screen
    document.body.style.overflow = "hidden";
  }
  function updateText(text: string) {
    if (!loadingActive.value) return;
    loadingText.value = text;
  }
  function stopLoading() {
    loadingActive.value = false;
    //unlock the screen
    document.body.style.overflow = "auto";
  }

  return {
    loadingActive,
    loadingText,
    startLoading,
    stopLoading,
    updateText,
  };
}
