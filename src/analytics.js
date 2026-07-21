const defaultProjectToken = 'phc_rrUr646WcSjvtBJedpAGVtnNucNTZjxkoYk6tGFvs2N7';
const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN || defaultProjectToken;
const enabled = Boolean(projectToken) && (import.meta.env.PROD || import.meta.env.VITE_POSTHOG_ENABLE_DEV === 'true');

let clientPromise;

export function initializeAnalytics() {
  if (!enabled || clientPromise) return clientPromise;
  clientPromise = import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(projectToken, {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
        defaults: '2026-05-30',
        autocapture: false,
        disable_session_recording: true,
        person_profiles: 'identified_only',
      });
      return posthog;
    })
    .catch(() => null);
  return clientPromise;
}

export function captureAnalytics(eventName, properties = {}) {
  if (!clientPromise) return;
  void clientPromise.then((client) => client?.capture(eventName, properties));
}
