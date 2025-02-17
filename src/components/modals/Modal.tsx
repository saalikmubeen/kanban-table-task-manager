import { Dialog } from '@headlessui/react';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50"
    >
      <div
        className="fixed inset-0 bg-black/30"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        id="dialog"
        className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-5/6 max-w-lg overflow-y-auto overflow-x-hidden rounded-md bg-white p-8 dark:bg-neutral-700"
      >
        {children}
      </div>
    </Dialog>
  );
}
