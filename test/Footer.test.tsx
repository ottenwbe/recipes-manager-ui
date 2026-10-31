import { render, screen } from '@testing-library/react';
import { Footer } from '../src/common/components/Footer';

describe('Footer', () => {
    it('renders the default class, configured footer text, and divider', () => {
        const { container } = render(<Footer />);

        expect(container.firstChild).toHaveClass('Footer');
        expect(screen.getByText('theFooter')).toBeInTheDocument();
        expect(screen.getByRole('separator')).toHaveClass('footer-divider');
    });

    it('uses a supplied class name', () => {
        const { container } = render(<Footer className="custom-footer" />);

        expect(container.firstChild).toHaveClass('custom-footer');
        expect(container.firstChild).not.toHaveClass('Footer');
    });
});