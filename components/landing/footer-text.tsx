import { cn } from '@/lib/utils';
import { Roboto_Mono } from 'next/font/google';
import css from './footer.module.css';

const mono = Roboto_Mono({ subsets: ['latin'] });

export default function FooterText() {
  return (
    <footer className={cn(css.footer)}>
      <span className={cn(mono.className, css['footer-text'])}>
        OpenBook
      </span>
      <div className={cn(css['footer-grid'])} />
      <div className={cn(css['footer-gradient'])} />
    </footer>
  );
}
