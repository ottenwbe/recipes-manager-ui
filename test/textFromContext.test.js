import { textFromContext } from '../src/common/context/TextContextProvider';

describe('textFromContext', () => {
    it('returns the configured text when the key exists', () => {
        expect(textFromContext({ welcome: 'Willkommen' }, 'welcome')).toBe('Willkommen');
    });

    it('returns an empty string when the key is missing', () => {
        expect(textFromContext({ other: 'Eintrag' }, 'welcome')).toBe('');
    });
});
