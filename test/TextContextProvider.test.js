import { render, screen } from '@testing-library/react';
import  {TextContextComponent} from '../src/common/context/TextContextProvider';
import '@testing-library/jest-dom';

describe('TextContextComponent', () => {
  it('the default strings from public/strings.json', () => {
    render(<TextContextComponent value='appName'/>)

    const heading = screen.getAllByText("theAppName")

    expect(heading[0]).toBeInTheDocument()
  })
});