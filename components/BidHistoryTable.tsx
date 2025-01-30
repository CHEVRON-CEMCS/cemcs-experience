import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Bid {
  name: string;
  name1: string;
  price: number;
  email: string;
  phone: string;
  status: string;
  creation: string;
  product: string;
  member_id: string;
  doctype: string;
}

interface Product {
  name: string;
  product_name: string;
  price: number;
  image: string;
  status: string;
  description: string;
  owner_name: string;
  subscriber_id: string;
  member_id: string;
}

interface BidHistoryTableProps {
  bids: Bid[];
  onUpdateStatus: (bidId: string, newStatus: string) => Promise<any>;
  product: Product;
  isOwner: boolean;
}

const BidHistoryTable: React.FC<BidHistoryTableProps> = ({
  bids,
  onUpdateStatus,
  product,
  isOwner,
}) => {
  console.log("BidHistoryTable Props:", {
    isOwner,
    productId: product.member_id,
    bidsCount: bids.length,
    hasSelect: !!Select,
  });
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const hasAcceptedBid = bids.some((bid) => bid.status === "1");

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "0":
        return "text-yellow-600";
      case "1":
        return "text-green-600";
      case "2":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "0":
        return "Pending";
      case "1":
        return "Accepted";
      case "2":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const handleStatusChange = async (bidId: string, newStatus: string) => {
    const currentBid = bids.find((b) => b.name === bidId);
    if (!currentBid) return;

    if (hasAcceptedBid && newStatus === "1" && currentBid.status !== "1") {
      toast.error("Cannot accept multiple bids");
      return;
    }

    if (hasAcceptedBid && bids.find((b) => b.status === "1")?.name !== bidId) {
      toast.error("Cannot modify other bids when one is accepted");
      return;
    }

    setUpdateLoading(bidId);
    try {
      await onUpdateStatus(bidId, newStatus);
      toast.success("Bid status updated successfully");
    } catch (error) {
      toast.error("Failed to update bid status");
    } finally {
      setUpdateLoading(null);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bidder</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            {isOwner && <TableHead>Contact Email</TableHead>}
            {isOwner && <TableHead>Phone number</TableHead>}
            {isOwner && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isOwner ? 5 : 4} className="text-center py-4">
                No bids yet
              </TableCell>
            </TableRow>
          ) : (
            bids.map((bid) => (
              <TableRow key={bid.member_id}>
                <TableCell>{bid.member_id}</TableCell>
                <TableCell>₦{bid.price.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(bid.creation).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {isOwner ? (
                    <div className="flex items-center gap-2">
                      <Select
                        defaultValue={bid.status}
                        onValueChange={(value) =>
                          handleStatusChange(bid.name, value)
                        }
                        disabled={hasAcceptedBid} // Disable if any bid has been accepted
                      >
                        <SelectTrigger
                          className={`w-32 ${getStatusColor(bid.status)}`}
                        >
                          <SelectValue>{getStatusText(bid.status)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Pending</SelectItem>
                          <SelectItem value="1">Accept</SelectItem>
                          <SelectItem value="2">Reject</SelectItem>
                        </SelectContent>
                      </Select>

                      {updateLoading === bid.name && (
                        <span className="ml-2 animate-spin">⌛</span>
                      )}
                    </div>
                  ) : (
                    <span className={getStatusColor(bid.status)}>
                      {getStatusText(bid.status)}
                    </span>
                  )}
                </TableCell>
                {isOwner && <TableCell>{bid.email}</TableCell>}
                {isOwner && <TableCell>{bid.phone}</TableCell>}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BidHistoryTable;
