import { AppHeader } from '@components';
import styles from './layout.module.css';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <div className={styles.app}>
    <AppHeader />
    <main className={styles.content}>{children}</main>
  </div>
);
