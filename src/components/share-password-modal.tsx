import React, { useState } from "react";
import BaseModal from "./base-modal";
import Button from "./button";
import { shareItem } from "../actions";
import { Alert, AlertDescription } from "./alert";
import { PasswordItem } from "../schema";

interface SharePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  passwordItem: PasswordItem | null;
}

const SharePasswordModal: React.FC<SharePasswordModalProps> = ({
  isOpen,
  onClose,
  passwordItem,
}) => {
  const [selectedPermission, setSelectedPermission] = useState("reader");
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateInviteLink = async () => {
    if (passwordItem) {
      try {
        const link = await shareItem(passwordItem, selectedPermission);
        setInviteLink(link);
      } catch (err) {
        setError("Failed to create invite link. Please try again.");
      }
    }
  };

  if (!passwordItem) {
    return null;
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share Password: ${passwordItem.name}`}
    >
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <label
            htmlFor="permission"
            className="block text-sm font-medium text-gray-700"
          >
            Select Permission
          </label>
          <select
            id="permission"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedPermission}
            onChange={(e) => setSelectedPermission(e.target.value)}
          >
            <option value="reader">Reader</option>
            <option value="writer">Writer</option>
          </select>
        </div>
        <Button onClick={handleCreateInviteLink} className="w-full">
          Create Invite Link
        </Button>
        {inviteLink && (
          <div className="mt-4">
            <label
              htmlFor="inviteLink"
              className="block text-sm font-medium text-gray-700"
            >
              Invite Link
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="inviteLink"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                value={inviteLink}
                readOnly
              />
              <Button
                type="button"
                className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                onClick={() => navigator.clipboard.writeText(inviteLink)}
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default SharePasswordModal;
