import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import axios from 'axios';

interface PopupData {
  name: string;
  popup_name: string;
  image: string;
  start_date: string;
  end_date: string;
  is_active: number;
}

export function ImagePopupModal() {
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://staging.chevroncemcs.com';

  useEffect(() => {
    const fetchPopupData = async () => {
      try {
        // First fetch the popup ID
        const popupResponse = await axios.get('/api/Image Popup');
        const popupId = popupResponse.data.data[0].name;

        // Then fetch the popup details
        const detailsResponse = await axios.get(`/api/Image Popup/${popupId}`);
        const data = detailsResponse.data.data;

        // Check if popup is active and within date range
        const today = new Date();
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        
        if (data.is_active === 1 && today >= startDate && today <= endDate) {
          setPopupData(data);
          setOpen(true);
        }
      } catch (err) {
        console.error('Error fetching popup data:', err);
      }
    };

    fetchPopupData();
  }, []);

  if (!popupData) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {popupData.popup_name}
          </DialogTitle>
        </DialogHeader>
        <div className="relative w-full aspect-[16/9] mt-4">
          <Image
            src={`${baseUrl}${popupData.image}`}
            alt={popupData.popup_name}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}