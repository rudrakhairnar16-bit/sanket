let _notify: ((title: string, options?: NotificationOptions) => void) | null = null;

export function setNotify(fn: (title: string, options?: NotificationOptions) => void) {
  _notify = fn;
}

export function notify(title: string, options?: NotificationOptions) {
  if (_notify) _notify(title, options);
}
