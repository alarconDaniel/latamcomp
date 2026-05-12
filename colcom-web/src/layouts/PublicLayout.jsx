import { PublicHeader } from '../components/public/PublicHeader.jsx';
import { PublicFooter } from '../components/public/PublicFooter.jsx';

export function PublicLayout({ children }) {
  return (
    <>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
}
