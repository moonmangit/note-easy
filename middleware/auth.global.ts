export default defineNuxtRouteMiddleware((to, from) => {
  if (["/login", "/register"].includes(to.fullPath)) {
    if (useAuth().isLoggedIn) {
      return navigateTo("/");
    }
  } else {
    if (!useAuth().isLoggedIn) {
      return navigateTo("/login");
    }
  }
});
