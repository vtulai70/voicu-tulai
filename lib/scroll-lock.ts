// Reference-counted body scroll lock, shared by the mobile menu and the full-screen chat
// so one releasing its lock can't unlock the page while the other still needs it.
let locks = 0;

/** Locks page scrolling and returns a function that releases this lock (safe to call twice). */
export function lockScroll(): () => void {
  locks += 1;
  if (locks === 1) document.body.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) document.body.style.overflow = "";
  };
}
