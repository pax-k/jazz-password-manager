import React, { useState, useEffect } from "react";
import BaseModal from "./base-modal";
import Button from "./button";
import { getSharedUsers } from "../actions";
import { Alert, AlertDescription } from "./alert";
import { Folder } from "../schema";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onInvite: (folder: Folder, permission: string) => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  folders,
  onInvite,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const selectedFolder = folders.find(
    (folder) => folder.id === selectedFolderId
  );
  const [selectedPermission, setSelectedPermission] = useState("reader");
  const [inviteLink, setInviteLink] = useState("");
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFolder) {
      getSharedUsers(selectedFolder)
        .then(setSharedUsers)
        .catch(() =>
          setError("Failed to fetch shared users. Please try again.")
        );
    }
  }, [selectedFolder]);

  const handleCreateInviteLink = () => {
    const link = `https://example.com/invite?folder=${selectedFolder}&permission=${selectedPermission}`;
    setInviteLink(link);
    if (selectedFolder) {
      onInvite(selectedFolder, selectedPermission);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Invite Users">
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
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
            value={selectedFolderId}
            onChange={(e) => setSelectedFolderId(e.target.value)}
          >
            {folders.map((folder) => (
              <option key={folder.id} value={folder.name}>
                {folder.name}
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
        <div>
          <h3 className="text-lg font-medium mb-2">Existing Shared Users</h3>
          <div className="max-h-40 overflow-y-auto bg-gray-100 rounded-md p-2">
            {sharedUsers.length > 0 ? (
              <ul className="list-disc list-inside">
                {sharedUsers.map((user, index) => (
                  <li key={index} className="text-sm">
                    {user}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No users currently have access to this folder.
              </p>
            )}
          </div>
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

export default InviteModal;
