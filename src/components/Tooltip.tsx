import { ReactNode, useEffect, useRef, useState } from 'react';

export function Tooltip({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    window.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        setIsOpen(false);
      }

      if (
        isOpen &&
        !(buttonRef.current === event.target) &&
        event.target instanceof Node &&
        !wrapperRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    });
  }, [isOpen]);

  return (
    <div className="relative z-10 flex shrink-0 items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative before:absolute before:-inset-3 cursor-pointer"
      >
        <img src="/icon-vertical-ellipsis.svg" alt="" />
      </button>
      <div
        ref={wrapperRef}
        className={`invisible absolute w-48 rounded-md bg-white p-4 text-body-lg opacity-0 transition-all dark:bg-neutral-800 ${
          isOpen && 'visible opacity-100'
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
