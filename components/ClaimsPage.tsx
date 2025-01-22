import React from "react";
import { create } from "zustand";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Upload,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Claim {
  id: string;
  type: string;
  description: string;
  date: string;
  status: "pending" | "processing" | "approved" | "rejected";
  amount: number;
  policyNumber: string;
}

interface ClaimsStore {
  claims: Claim[];
  addClaim: (claim: Omit<Claim, "id" | "status">) => void;
}

const useClaimsStore = create<ClaimsStore>((set) => ({
  claims: [
    // {
    //   id: "1",
    //   type: "Vehicle",
    //   description: "Minor accident repair claim",
    //   date: "2025-01-15",
    //   status: "approved",
    //   amount: 2500,
    //   policyNumber: "VEH-2024-001",
    // },
    // {
    //   id: "2",
    //   type: "Health",
    //   description: "Hospital admission for treatment",
    //   date: "2025-01-18",
    //   status: "processing",
    //   amount: 5000,
    //   policyNumber: "HEA-2024-003",
    // },
  ],
  addClaim: (claim) =>
    set((state) => ({
      claims: [
        ...state.claims,
        { ...claim, id: String(state.claims.length + 1), status: "pending" },
      ],
    })),
}));

const MobileClaimCard = ({ claim }: { claim: Claim }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getStatusColor = (status: Claim["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const getStatusIcon = (status: Claim["status"]) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      processing: <Upload className="h-4 w-4" />,
      approved: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
    };
    return icons[status];
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">Claim #{claim.id}</div>
          <div className="text-sm text-gray-500">{claim.type}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className={`mt-2 space-y-2 ${isExpanded ? "block" : "hidden"}`}>
        <div className="text-sm">
          <span className="font-medium">Description:</span> {claim.description}
        </div>
        <div className="text-sm">
          <span className="font-medium">Date:</span>{" "}
          {new Date(claim.date).toLocaleDateString()}
        </div>
        <div className="text-sm">
          <span className="font-medium">Amount:</span> N
          {claim.amount.toLocaleString()}
        </div>
        <div className="text-sm">
          <span className="font-medium">Policy:</span> {claim.policyNumber}
        </div>
        <div className="text-sm">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}
          >
            {getStatusIcon(claim.status)}
            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
          </span>
        </div>
      </div>
    </Card>
  );
};

const ClaimsPage = () => {
  const { claims, addClaim } = useClaimsStore();
  const [activeTab, setActiveTab] = React.useState<"submit" | "track">(
    "submit"
  );
  const [formData, setFormData] = React.useState({
    type: "",
    description: "",
    date: "",
    amount: "",
    policyNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClaim({
      type: formData.type,
      description: formData.description,
      date: formData.date,
      amount: Number(formData.amount),
      policyNumber: formData.policyNumber,
    });
    setFormData({
      type: "",
      description: "",
      date: "",
      amount: "",
      policyNumber: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Claims Management</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <Button
            variant={activeTab === "submit" ? "default" : "outline"}
            onClick={() => setActiveTab("submit")}
            className="flex-1 sm:flex-initial"
          >
            Submit Claim
          </Button>
          <Button
            variant={activeTab === "track" ? "default" : "outline"}
            onClick={() => setActiveTab("track")}
            className="flex-1 sm:flex-initial"
          >
            Track Claims
          </Button>
        </div>
      </div>

      {/* Submit Claim Form */}
      {activeTab === "submit" && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-6">Submit New Claim</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Insurance Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vehicle">Vehicle Insurance</SelectItem>
                    <SelectItem value="Health">Health Insurance</SelectItem>
                    <SelectItem value="Property">Property Insurance</SelectItem>
                    <SelectItem value="Business">Business Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Policy Number</label>
                <Input
                  placeholder="Enter policy number"
                  value={formData.policyNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, policyNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Incident Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Claim Amount</label>
                <Input
                  type="number"
                  placeholder="Enter claim amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe the incident and claim details"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="h-32"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                Submit Claim
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Track Claims */}
      {activeTab === "track" && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-6">Track Claims</h2>

          {/* Mobile View */}
          <div className="md:hidden">
            {claims.map((claim) => (
              <MobileClaimCard key={claim.id} claim={claim} />
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-full divide-y divide-gray-200">
              <div className="grid grid-cols-7 gap-4 py-3 bg-gray-50 text-sm font-medium text-gray-500">
                <div className="px-4">Claim ID</div>
                <div className="px-4">Type</div>
                <div className="px-4">Description</div>
                <div className="px-4">Date</div>
                <div className="px-4">Amount</div>
                <div className="px-4">Policy Number</div>
                <div className="px-4">Status</div>
              </div>

              <div className="divide-y divide-gray-200">
                {claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="grid grid-cols-7 gap-4 py-4 text-sm"
                  >
                    <div className="px-4">{claim.id}</div>
                    <div className="px-4">{claim.type}</div>
                    <div className="px-4">{claim.description}</div>
                    <div className="px-4">
                      {new Date(claim.date).toLocaleDateString()}
                    </div>
                    <div className="px-4">₦{claim.amount.toLocaleString()}</div>
                    <div className="px-4">{claim.policyNumber}</div>
                    <div className="px-4">
                      {/* <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}>
                        {getStatusIcon(claim.status)}
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ClaimsPage;
