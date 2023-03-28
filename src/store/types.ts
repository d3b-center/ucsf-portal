import { GlobalInitialState } from 'store/global';
import { UserInitialState } from 'store/user';
import { SavedFilterInitialState } from './savedFilter';
import { SavedSetInitialState } from './savedSet';
import { ReportInitialState } from './report';
import { RemoteInitialState } from './remote';

export type RootState = {
  global: GlobalInitialState;
  user: UserInitialState;
  report: ReportInitialState;
  savedFilter: SavedFilterInitialState;
  savedSet: SavedSetInitialState;
  remote: RemoteInitialState;
};
