export const navigate = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('colcom:navigate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
