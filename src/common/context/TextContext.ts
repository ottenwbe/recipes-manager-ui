import { createContext } from 'react';
import config from '@public/strings.json'

export type TextConfig = typeof config;

export const TextContext = createContext<TextConfig>(config);
