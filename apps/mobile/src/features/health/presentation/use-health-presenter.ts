import { injectHook } from 'react-obsidian';
import { AppGraph } from '../../../di/app-graph';
import { useHealthPresenterImpl } from './health-presenter';

export const useHealthPresenter = injectHook(useHealthPresenterImpl, AppGraph);
