type CustomEventKeys = {
  [K in keyof WindowEventMap]: WindowEventMap[K] extends CustomEvent<any> ? K : never
}[keyof WindowEventMap];

type EventDetail<T extends CustomEventKeys> =
  WindowEventMap[T] extends CustomEvent<infer D> ? D : never;

const dispatchCustomEvent = <T extends CustomEventKeys>(
  name: T,
  detail: EventDetail<T>
) => {
  const event: WindowEventMap[T] = new CustomEvent<EventDetail<T>>(name, {
    detail,
    bubbles: true,
  }) as WindowEventMap[T];

  window.dispatchEvent(event);
};

export default dispatchCustomEvent;