import type { ComponentProps } from 'react';
import logo from '../assets/images/guess-where-logo.png';

export default function Header({ children }: ComponentProps<'header'>) {
  return (
    <header className="flex items-center">
      <div className="shrink-0">
        <h1 className="sr-only">Guess Where</h1>
        <img
          src={logo}
          alt="Guess Where Logo"
          width={75}
          height={75}
          className="md:w-[100px] md:h-[100px]"
        />
      </div>
      <div>
        <h2>Guess the location name from the given choices.</h2>
        {children}
      </div>
    </header>
  );
}
