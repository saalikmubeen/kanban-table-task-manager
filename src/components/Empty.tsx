import NewTaskButton from './NewTaskButton';

export function Empty() {
  return (
    <div className="grid place-items-center h-lvh">
      <div className="mx-4 grid gap-8">
        <p className="text-center text-heading-lg text-neutral-400 flex flex-col items-center gap-4">
          You're all caught up. No ongoing or pending tasks!
        </p>

        <NewTaskButton header={false} />
      </div>
    </div>
  );
}
