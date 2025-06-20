import { SiGithub, SiX } from '@icons-pack/react-simple-icons';
import { Earth, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-xs text-gray-500 py-1 [&>*]:mt-1.5">
      <div className="flex items-center gap-1">
        <p>
          Inspired from{' '}
          <a
            href="http://www.telegraph.co.uk/travel/citybreaks/11825481/Quiz-Can-you-identify-these-cities.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 hover:underline"
          >
            Telegraph Geo Quiz
          </a>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <a
          href="https://www.jabran.me"
          target="_blank"
          rel="noopener"
          className="hover:text-cyan-600"
        >
          <Earth size={16} />
        </a>
        <a
          href="https://www.twitter.com/jabranr"
          target="_blank"
          rel="noopener"
          className="hover:text-cyan-600"
        >
          <SiX size={16} />
        </a>
        <a
          href="https://www.github.com/jabranr"
          target="_blank"
          rel="noopener"
          className="hover:text-cyan-600"
        >
          <SiGithub size={16} />
        </a>
        <div className="flex items-center gap-1 [&>*:not(:last-child)]:after:content-['/'] [&>*:not(:last-child)]:after:pl-1">
          <span>MIT License</span>
          <a
            className="text-cyan-600 hover:underline"
            href="https://jabran.me"
            target="_blank"
            rel="noopener"
          >
            Jabran Rafique
          </a>
          <button
            onClick={() => {
              window.alert(
                'By continue to use this website, you agree to use of cookies.'
              );
            }}
          >
            <Info size={16} className="cursor-pointer hover:text-cyan-600" />
          </button>
        </div>
      </div>
    </footer>
  );
}
