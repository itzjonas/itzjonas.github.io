import { render, screen } from '@testing-library/react';

import { SectionTitle } from '@/components/portfolio/SectionTitle';

describe('SectionTitle', () => {
  it('renders padded section number and label', () => {
    render(<SectionTitle sectionNumber={3} label="About" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('//');
    expect(heading).toHaveTextContent('03');
    expect(heading).toHaveTextContent('About');
  });

  it('renders as h3 when as is h3', () => {
    render(<SectionTitle sectionNumber={1} label="Skills" as="h3" />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Skills');
  });
});
