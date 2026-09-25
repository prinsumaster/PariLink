import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import { LorryReceiptsScreen } from '../LorryReceiptsScreen';
import { DriverAPI } from '../../../services/api/client';
import { useAppSelector } from '../../../store';

jest.mock('../../../services/api/client', () => ({
  DriverAPI: {
    getLorryReceipts: jest.fn(),
  },
}));

jest.mock('../../../store', () => ({
  useAppSelector: jest.fn(),
}));

describe('LorryReceiptsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows no driver profile if driverId is missing', async () => {
    (useAppSelector as jest.Mock).mockReturnValue(undefined);

    render(<LorryReceiptsScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('No Driver Profile Found')).toBeTruthy();
    });
  });

  it('fetches and displays lorry receipts when driverId exists', async () => {
    (useAppSelector as jest.Mock).mockReturnValue('driver-123');
    
    const mockReceipts = [
      {
        id: 'lr-1',
        lrNumber: 'LR-2023-001',
        status: 'GENERATED',
        tripId: 'trip-123',
        origin: 'Mumbai',
        destination: 'Delhi',
        freightAmount: 15000,
        pdfUrl: 'https://example.com/pdf/1'
      }
    ];

    (DriverAPI.getLorryReceipts as jest.Mock).mockResolvedValueOnce({
      data: { data: mockReceipts }
    });

    render(<LorryReceiptsScreen />);
    
    // Initial loading state...
    
    await waitFor(() => {
      expect(screen.getByText('LR No: LR-2023-001')).toBeTruthy();
      expect(screen.getByText('GENERATED')).toBeTruthy();
      expect(screen.getByText('Mumbai')).toBeTruthy();
      expect(screen.getByText('Delhi')).toBeTruthy();
      expect(screen.getByText('₹15000')).toBeTruthy();
    });
    
    expect(DriverAPI.getLorryReceipts).toHaveBeenCalledWith('driver-123');
  });
});
