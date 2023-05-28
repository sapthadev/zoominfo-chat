import React from 'react';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import App from './App';
import '@testing-library/jest-dom'

jest.mock('axios');
const mockData = {
  "channelId": "private-iWiHJzvqeSCcEf7Qs16852770642031685277064353",
  "user": {"id": "iWiHJzvqeSCcEf7Qs1685277064203"},
  "subscriptionChannel": "presence-insentstaging1-widget-user-iWiHJzvqeSCcEf7Qs1685277064203",
  "sender": {
    "name": "testbot",
    "img":""
  },
  "messages":[]
}
describe('App', () => {
  it('should Call api on render', async () => {
    
    const mockedResponse = { data: mockData };
    axios.get = jest.fn().mockResolvedValue(mockedResponse);
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledTimes(1);
    // await act(async () => {fireEvent.click(screen.getByRole('button')) });
    // await act(async () => {expect(axios.get).toHaveBeenCalledTimes(2); }); 
  });
});
