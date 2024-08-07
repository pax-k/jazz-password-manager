import React, { useState } from "react";
import Button from "../components/button";
import Table from "../components/table";
import NewItemModal from "../components/new-item-modal";
import InviteModal from "../components/invite-modal";
import { PasswordItem } from "../types";
import { flattenedItems, folderNames } from "../data";
import {
  saveItem,
  updateItem,
  deleteItem,
  createFolder,
  shareFolder,
  shareItem,
} from "../actions";
import { Alert, AlertDescription } from "../components/alert";

const VaultPage: React.FC = () => {
  const [items, setItems] = useState<PasswordItem[]>(flattenedItems);
  const [folders, setFolders] = useState<string[]>(folderNames);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isNewFolderInputVisible, setIsNewFolderInputVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingItem, setEditingItem] = useState<PasswordItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredItems = selectedFolder
    ? items.filter((item) => item.folder === selectedFolder && !item.deleted)
    : items.filter((item) => !item.deleted);

  const handleSaveNewItem = async (newItem: PasswordItem) => {
    try {
      const savedItem = await saveItem(newItem);
      setItems((prevItems) => [...prevItems, savedItem]);
    } catch (err) {
      setError("Failed to save new item. Please try again.");
    }
  };

  const handleUpdateItem = async (updatedItem: PasswordItem) => {
    try {
      const updated = await updateItem(updatedItem);
      setItems((prevItems) =>
        prevItems.map((item) => (item._id === updated._id ? updated : item))
      );
      setEditingItem(null);
    } catch (err) {
      setError("Failed to update item. Please try again.");
    }
  };

  const handleDeleteItem = async (item: PasswordItem) => {
    try {
      await deleteItem(item);
      setItems((prevItems) =>
        prevItems.map((i) => (i._id === item._id ? { ...i, deleted: true } : i))
      );
    } catch (err) {
      setError("Failed to delete item. Please try again.");
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderName) {
      try {
        const newFolder = await createFolder(newFolderName);
        setFolders((prevFolders) => [...prevFolders, newFolder.name]);
        setNewFolderName("");
        setIsNewFolderInputVisible(false);
      } catch (err) {
        setError("Failed to create folder. Please try again.");
      }
    }
  };

  const handleShareFolder = async (folderName: string, permission: string) => {
    try {
      const inviteLink = await shareFolder(folderName, permission);
      console.log("Folder invite link created:", inviteLink);
    } catch (err) {
      setError("Failed to share folder. Please try again.");
    }
  };

  const handleShareItem = async (item: PasswordItem, permission: string) => {
    try {
      const inviteLink = await shareItem(item, permission);
      console.log("Item invite link created:", inviteLink);
    } catch (err) {
      setError("Failed to share item. Please try again.");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Username", accessor: "username" as const },
    { header: "URI", accessor: "uri" as const },
    {
      header: "Actions",
      accessor: "_id" as const,
      render: (item: PasswordItem) => (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigator.clipboard.writeText(item.password)}>
            Copy Password
          </Button>
          <Button onClick={() => setEditingItem(item)}>Edit</Button>
          <Button
            onClick={() => handleShareItem(item, "reader")}
            variant="secondary"
          >
            Share
          </Button>
          <Button onClick={() => handleDeleteItem(item)} variant="danger">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Password Vault</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {folders.map((folder) => (
            <Button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              variant={selectedFolder === folder ? "primary" : "secondary"}
            >
              {folder}
            </Button>
          ))}
          {isNewFolderInputVisible ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <Button onClick={handleCreateFolder}>Save</Button>
            </div>
          ) : (
            <Button onClick={() => setIsNewFolderInputVisible(true)}>
              New Folder
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsNewItemModalOpen(true)}>New Item</Button>
          <Button onClick={() => setIsInviteModalOpen(true)}>Share</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table data={filteredItems} columns={columns} />
      </div>
      <NewItemModal
        isOpen={isNewItemModalOpen || !!editingItem}
        onClose={() => {
          setIsNewItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={editingItem ? handleUpdateItem : handleSaveNewItem}
        folders={folders}
        editingItem={editingItem}
      />
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        folders={folders}
        onInvite={handleShareFolder}
      />
    </div>
  );
};

export default VaultPage;
