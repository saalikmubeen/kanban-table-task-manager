import ThemeToggle from './ThemeToggle';
import NewTaskButton from './NewTaskButton';

export default function Header() {
  return (
    <header className="relative z-30 flex border-blue-200 bg-white sm:border-b dark:border-neutral-600 dark:bg-neutral-700">
      <div
        className={
          'flex items-center border-blue-200 px-4 py-5 sm:border-r dark:border-neutral-600'
        }
      >
        <Logo />
      </div>
      <div className="flex grow items-center gap-4 p-4 pl-0 sm:pl-4">
        <NewTaskButton header />

        <ThemeToggle />
      </div>
    </header>
  );
}

function Logo() {
  return (
    <a href="/">
      <img src="/logo-mobile.svg" alt="" />
    </a>
  );
}
