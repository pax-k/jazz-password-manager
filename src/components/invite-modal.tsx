import React, { useState } from "react";
import BaseModal from "./base-modal";
import Button from "./button";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: string[];
  onInvite: (folderName: string, permission: string) => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  folders,
  onInvite,
}) => {
  const [selectedFolder, setSelectedFolder] = useState(folders[0] || "");
  const [selectedPermission, setSelectedPermission] = useState("reader");
  const [inviteLink, setInviteLink] = useState("");

  const handleCreateInviteLink = () => {
    // In a real application, this would make an API call to create an invite link
    const link = `https://example.com/invite?folder=${selectedFolder}&permission=${selectedPermission}`;
    setInviteLink(link);
    onInvite(selectedFolder, selectedPermission);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Invite Users">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="folder"
            className="block text-sm font-medium text-gray-700"
          >
            Select Folder to Share
          </label>
          <select
            id="folder"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
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
        <Button onClick={handleCreateInviteLink}>Create Invite Link</Button>
        {inviteLink && (
          <div className="mt-4">
            <label
              htmlFor="inviteLink"
              className="block text-sm font-medium text-gray-700"
            >
              Invite Link
            </label>
            <input
              type="text"
              id="inviteLink"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={inviteLink}
              readOnly
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default InviteModal;
