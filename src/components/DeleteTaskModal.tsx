import Modal from './Modal';

type Props = {
  onDelete: () => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
};

function DeleteTaskModal({
  onDelete,
  onClose,
  title,
  subtitle,
}: Props) {
  return (
    <Modal onClose={onClose}>
      <>
        <h2 className="text-heading-lg text-red-600">
          {title || ' Delete this task?'}
        </h2>
        <p className="mt-6 text-body-lg text-neutral-400">
          {subtitle || 'Are you sure you want to delete this task?'}
        </p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={onDelete}
            className="w-full rounded-full cursor-pointer  bg-red-500 py-2 text-body-lg font-bold text-white"
          >
            Delete
          </button>
          <button
            className="w-full rounded-full cursor-pointer  bg-purple-500/10 py-2 text-center text-body-lg font-bold text-purple-500"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </>
    </Modal>
  );
}

export default DeleteTaskModal;
