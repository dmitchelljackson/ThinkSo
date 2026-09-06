import { injectHook } from 'react-obsidian';
import { AppGraph } from '../../../di/app-graph';
import { useAccountAccessPresenterImpl } from './account-access-presenter';

export const useAccountAccessPresenter = injectHook(useAccountAccessPresenterImpl, AppGraph);
