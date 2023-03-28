import { TSortableItems } from '@ferlab/ui/core/layout/SortableGrid/SortableItem';
import cx from 'classnames';

import SavedFilters from './SavedFilters';
import SavedSets from './SavedSets';

import styles from './index.module.scss';

export interface DashboardCardProps {
  id: string;
  key?: string;
  className?: string;
}

export const dashboardCards: TSortableItems[] = [
  {
    id: '1',
    xs: 24,
    md: 12,
    xxl: 8,
    className: cx(styles.cardColxxl6, styles.cardColxxl5),
    component: <SavedFilters id="1" className={styles.dashboardCard} />,
  },
  {
    id: '2',
    xs: 24,
    md: 12,
    xxl: 8,
    className: cx(styles.cardColxxl6, styles.cardColxxl5),
    component: <SavedSets id="2" className={styles.dashboardCard} />,
  },
];
